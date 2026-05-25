"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/GipsyDanger.fbx";
const EMOTE_CLIP = "Armature|Gipsy.Emote1";
const TARGET_HEIGHT = 1.7;

function GipsyDanger() {
  const fbx = useFBX(MODEL_URL);
  const ref = useRef<THREE.Group>(null);

  // measure-and-fit
  useLayoutEffect(() => {
    const obj = ref.current;
    if (!obj) return;
    obj.scale.setScalar(1);
    obj.position.set(0, 0, 0);
    obj.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(obj);
    if (!isFinite(box.min.x)) return;

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    obj.scale.setScalar(TARGET_HEIGHT / maxDim);
    obj.updateMatrixWorld(true);

    const box2 = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    box2.getCenter(center);
    obj.position.x = -center.x;
    obj.position.y = -center.y;
    obj.position.z = -center.z;
  }, [fbx]);

  // Apply to EVERY material on the model (phong, lambert, standard, basic).
  // Meshes with the UV palette map get its colors; meshes without a map get a
  // dark slate-blue fallback so they don't render white. DoubleSide kills
  // any thin-piece backface gaps.
  useEffect(() => {
    fbx.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshPhongMaterial &
          THREE.MeshStandardMaterial & { map: THREE.Texture | null };
        if ("color" in mat) {
          mat.color = new THREE.Color(mat.map ? "#ffffff" : "#3f4e66");
        }
        if ("emissive" in mat) {
          mat.emissive = new THREE.Color("#1a2030");
          mat.emissiveIntensity = 0.4;
        }
        if ("shininess" in mat) {
          (mat as THREE.MeshPhongMaterial).shininess = 18;
          (mat as THREE.MeshPhongMaterial).specular = new THREE.Color("#6a7488");
        }
        if ("roughness" in mat) {
          (mat as THREE.MeshStandardMaterial).roughness = 0.55;
          (mat as THREE.MeshStandardMaterial).metalness = 0.35;
        }
        mat.flatShading = false;
        mat.side = THREE.DoubleSide;
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.minFilter = THREE.LinearFilter;
          mat.map.magFilter = THREE.LinearFilter;
          mat.map.anisotropy = 4;
          mat.map.needsUpdate = true;
        }
        mat.needsUpdate = true;
      });
    });
  }, [fbx]);

  const mixer = useMemo(() => {
    const m = new THREE.AnimationMixer(fbx);
    const clip =
      fbx.animations.find((c) => c.name === EMOTE_CLIP) ?? fbx.animations[0];
    if (clip) {
      const action = m.clipAction(clip).reset().setLoop(THREE.LoopRepeat, Infinity);
      action.setEffectiveTimeScale(0.45);
      action.play();
    }
    return m;
  }, [fbx]);

  useFrame((_, dt) => mixer.update(dt));
  useEffect(() => () => mixer.stopAllAction(), [mixer]);

  return <primitive ref={ref} object={fbx} />;
}

export function Mecha({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 3], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        style={{ background: "transparent" }}
      >
        <hemisphereLight args={["#ffffff", "#e2e0d8", 4.0]} />
        <ambientLight intensity={2.6} />
        {/* soft key from front-above */}
        <directionalLight position={[2, 4, 5]} intensity={2.2} color="#ffffff" />
        {/* warm fill from screen-right */}
        <directionalLight position={[4, 1, 2]} intensity={1.2} color="#ffe9b0" />
        {/* cool fill from screen-left */}
        <directionalLight position={[-4, 1.5, 2]} intensity={1.2} color="#cfe0f2" />
        {/* under-lift so legs don't go black */}
        <directionalLight position={[0, -3, 3]} intensity={1.6} color="#ffffff" />

        <Suspense fallback={null}>
          <GipsyDanger />
        </Suspense>
      </Canvas>
    </div>
  );
}

useFBX.preload(MODEL_URL);
