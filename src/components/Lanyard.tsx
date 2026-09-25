"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { social } from "@/config/social";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const CARD_GLB = "/lanyard/card.glb";
const LANYARD_PNG = "/lanyard/lanyard.svg";
const FRONT_JPG = "/lanyard/front.jpg";

// same "editorial-brutalist dossier" palette as globals.css
const THEME = {
  paper: "#f1eee4",
  ink: "#16150e",
  pop: "#ffe14d",
};

// card.glb's front face is UV-mapped to the left half of the texture atlas,
// the back face to the right half (measured from the model, same convention
// React Bits' Lanyard uses for custom card images).
const FRONT_UV = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

// the card mesh ships portrait (0.8 x 1.125 half-extents); stretch just the
// flat face into a landscape badge while the clip/clamp hardware stays put
// at the top-center — same rig as a real event badge that clips at the top
// of its short edge, unlike a full 90° rotation which would swing the clip
// out to the side.
const CARD_KY = 0.65;
const CARD_HALF_H = 1.125;
// card.glb's front UV rect maps onto the whole flat face, so filling it
// edge-to-edge always displays at aspect (0.8*CARD_KX)/(CARD_HALF_H*CARD_KY)
// (the mesh's own landscape aspect) regardless of the atlas's raw pixel
// shape. Picking CARD_KX so that aspect exactly equals the reference photo's
// own aspect means a plain edge-to-edge fill needs no cropping *and* no
// stretch — the two are only in tension when the aspects don't match.
const FRONT_IMAGE_ASPECT = 1400 / 888; // public/lanyard/front.jpg's native size
const CARD_KX = (FRONT_IMAGE_ASPECT * CARD_HALF_H * CARD_KY) / 0.8;
const CARD_Y_OFFSET = CARD_HALF_H * (1 - CARD_KY);

// on-screen pixels per world unit — what the card was tuned at in its old
// 536px-tall slot canvas; narrow screens shrink it so the card fits the column
const PX_PER_UNIT = 117;
const pxPerUnit = (width: number) => Math.min(PX_PER_UNIT, width / 4);
const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(10));
// meshline's attenuated width scales with canvas width/height while the card
// scales with height only; this was the slot canvas's aspect the strap was tuned at
const STRAP_TUNED_ASPECT = 0.85;

// adapted from React Bits' Lanyard (https://reactbits.dev/components/lanyard) —
// same rope-physics rig, trimmed to this site's fixed card texture. The canvas
// is fixed over the whole viewport so the strap and a dragged card are never
// clipped; `slotRef` marks where the card rests, and pointer events come from
// `eventSource` so the (pointer-events-none) canvas never blocks the page.
export function Lanyard({
  slotRef,
  eventSource,
}: {
  slotRef: RefObject<HTMLElement | null>;
  eventSource: RefObject<HTMLElement | null>;
}) {
  const anchor = useRef(new THREE.Vector3());
  const [start, setStart] = useState<[number, number] | null>(null);
  const [dragging, setDragging] = useState(false);

  return (
    // under the Nav bar at rest (so the strap tucks behind it), above it mid-drag
    <div className={`pointer-events-none fixed inset-0 ${dragging ? "z-[60]" : "z-40"}`}>
      <Canvas
        camera={{ position: [0, 0, 13], fov: 20 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        eventSource={eventSource as RefObject<HTMLElement>}
        onCreated={({ gl, setEvents }) => {
          gl.setClearColor(new THREE.Color(0x000000), 0);
          // events arrive from the hero section, so map client coords onto the canvas
          setEvents({
            compute: (e, s) => {
              const r = s.gl.domElement.getBoundingClientRect();
              s.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
              s.raycaster.setFromCamera(s.pointer, s.camera);
            },
          });
        }}
      >
        <LayoutRig
          slotRef={slotRef}
          sectionRef={eventSource}
          anchor={anchor}
          onFirst={(a) => setStart((s) => s ?? a)}
        />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          {start && <Band start={start} anchor={anchor} onDragChange={setDragging} />}
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

// every frame: sizes the camera so one world unit is PX_PER_UNIT pixels, and turns the slot's on-screen position into the strap
// anchor — the hero's top edge (flush under the Nav bar) on desktop, the gap
// above the slot on stacked mobile layouts — so the rig scrolls with the hero
function LayoutRig({
  slotRef,
  sectionRef,
  anchor,
  onFirst,
}: {
  slotRef: RefObject<HTMLElement | null>;
  sectionRef: RefObject<HTMLElement | null>;
  anchor: RefObject<THREE.Vector3>;
  onFirst: (a: [number, number]) => void;
}) {
  useFrame(({ camera, size }) => {
    const slot = slotRef.current;
    const section = sectionRef.current;
    if (!slot || !section) return;
    const s = slot.getBoundingClientRect();
    const px = pxPerUnit(size.width);
    camera.position.z = size.height / (2 * HALF_FOV_TAN * px);
    camera.updateProjectionMatrix();
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const ax = s.left + s.width / 2;
    // mobile: start in the grid gap above the slot so the card clears the index card
    const ay = desktop ? section.getBoundingClientRect().top : s.top - 36;
    anchor.current.set((ax - size.width / 2) / px, (size.height / 2 - ay) / px, 0);
    onFirst([anchor.current.x, anchor.current.y]);
  });
  return null;
}

function Band({
  start,
  anchor,
  onDragChange,
}: {
  start: [number, number];
  anchor: RefObject<THREE.Vector3>;
  onDragChange: (dragging: boolean) => void;
}) {
  const { size } = useThree();
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const segmentProps = { type: "dynamic" as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshPhysicalMaterial>;
  };
  const texture = useTexture(LANYARD_PNG, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 16;
  });
  const frontTex = useTexture(FRONT_JPG);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    const baseImg = baseMap?.image as HTMLImageElement | undefined;
    const frontImg = frontTex?.image as HTMLImageElement | undefined;
    if (!baseImg) return baseMap;

    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const rect = (r: typeof FRONT_UV) => ({ x: r.x * W, y: r.y * H, w: r.w * W, h: r.h * H });

    // front — your actual reference image, drawn full-bleed, no hand-redraw
    const f = rect(FRONT_UV);
    ctx.save();
    ctx.beginPath();
    ctx.rect(f.x, f.y, f.w, f.h);
    ctx.clip();
    ctx.fillStyle = THEME.paper;
    ctx.fillRect(f.x, f.y, f.w, f.h);
    // edge-to-edge fill — CARD_KX is calibrated so the mesh's own final
    // aspect equals the image's native aspect, so this never crops or
    // stretches it despite the raw atlas rect being a different shape
    if (frontImg) ctx.drawImage(frontImg, f.x, f.y, f.w, f.h);
    ctx.restore();

    // back — plain wordmark, keeps the reverse side simple
    const b = rect(BACK_UV);
    ctx.save();
    ctx.beginPath();
    ctx.rect(b.x, b.y, b.w, b.h);
    ctx.clip();
    ctx.fillStyle = THEME.ink;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = THEME.pop;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${b.w * 0.14}px Arial, sans-serif`;
    ctx.fillText("TRIBHUVAN.", b.x + b.w / 2, b.y + b.h * 0.46);
    ctx.fillStyle = THEME.paper;
    ctx.font = `500 ${b.w * 0.03}px "Courier New", monospace`;
    ctx.fillText(`@${social.githubHandle} · 2026`, b.x + b.w / 2, b.y + b.h * 0.6);
    ctx.restore();

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap?.flipY ?? true;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [materials.base.map, frontTex]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);

  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useEffect(() => onDragChange(!!dragged), [dragged, onDragChange]);

  useFrame((state, delta) => {
    fixed.current?.setNextKinematicTranslation(anchor.current);
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      type Lerped = RapierRigidBody & { lerped?: THREE.Vector3 };
      [j1, j2].forEach((ref) => {
        const r = ref.current as Lerped;
        if (!r.lerped) r.lerped = new THREE.Vector3().copy(r.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, r.lerped.distanceTo(r.translation())));
        // capped at 1: on a slow frame (delta > 20ms) an uncapped factor overshoots
        // the target and, past 2, diverges — flinging the strap off-screen
        r.lerped.lerp(r.translation(), Math.min(1, delta * (50 * clampedDistance)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy((j2.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
      curve.points[2].copy((j1.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as unknown as { setPoints: (p: THREE.Vector3[]) => void }).setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });


  return (
    <>
      <group position={[start[0], start[1], 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="kinematicPosition" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[0.8 * CARD_KX, CARD_HALF_H * CARD_KY, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element & { releasePointerCapture: (id: number) => void }).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element & { setPointerCapture: (id: number) => void }).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <group scale={[CARD_KX, CARD_KY, 1]} position={[0, CARD_Y_OFFSET, 0]}>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            </group>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(1000, 1000) }]}
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap={1}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={(STRAP_TUNED_ASPECT * size.height) / size.width}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
