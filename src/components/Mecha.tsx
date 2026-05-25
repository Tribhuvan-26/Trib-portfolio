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

  // Use whatever texture FBXLoader bound (UVs were authored for it). Just
  // tune color/emissive/specular for the light bg. Don't replace the map.
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
          mat.emissive = new THREE.Color("#10141f");
          mat.emissiveIntensity = 0.3;
        }
        if ("shininess" in mat) {
          (mat as THREE.MeshPhongMaterial).shininess = 22;
          (mat as THREE.MeshPhongMaterial).specular = new THREE.Color("#5e6878");
        }
        if ("roughness" in mat) {
          (mat as THREE.MeshStandardMaterial).roughness = 0.55;
          (mat as THREE.MeshStandardMaterial).metalness = 0.35;
        }
        mat.flatShading = false;
        mat.side = THREE.DoubleSide;
        mat.vertexColors = false;
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.flipY = false; // FBX UV convention — picks correct palette row
          mat.map.magFilter = THREE.NearestFilter;
          mat.map.minFilter = THREE.NearestFilter;
          mat.map.generateMipmaps = false;
          mat.map.needsUpdate = true;
        }
        mat.needsUpdate = true;
      });
    });
  }, [fbx]);

  const mixer = useMemo(() => {
    const m = new THREE.AnimationMixer(fbx);
    m.timeScale = 0.6; // 60% speed — slowed but visibly moving
    const clip =
      fbx.animations.find((c) => c.name === EMOTE_CLIP) ?? fbx.animations[0];
    if (clip) {
      m.clipAction(clip).reset().setLoop(THREE.LoopRepeat, Infinity).play();
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
        <hemisphereLight args={["#ffffff", "#e2e0d8", 3.5]} />
        <ambientLight intensity={2.2} />
        <directionalLight position={[2, 4, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[4, 1, 2]} intensity={1.3} color="#ffe9b0" />
        <directionalLight position={[-4, 1.5, 2]} intensity={1.3} color="#cfe0f2" />
        <directionalLight position={[0, -3, 3]} intensity={1.4} color="#ffffff" />

        <Suspense fallback={null}>
          <GipsyDanger />
        </Suspense>
      </Canvas>
    </div>
  );
}

useFBX.preload(MODEL_URL);
