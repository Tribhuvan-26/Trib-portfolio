"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/GipsyDanger.glb";
const TARGET_HEIGHT = 1.7;

function GipsyDanger() {
  const { scene, animations } = useGLTF(MODEL_URL);
  const ref = useRef<THREE.Group>(null);

  // auto-fit
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
  }, [scene]);

  // GLB already binds textures + skinning correctly. Just nudge specular for
  // a slight metal feel and bump emissive a touch on a light bg.
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if ("roughness" in mat) {
          mat.roughness = 0.45;
          mat.metalness = 0.45;
        }
        if ("emissiveIntensity" in mat) {
          // lift shadow areas slightly so panel gaps don't crush
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity ?? 0, 0.15);
        }
        if (mat.map) {
          mat.map.magFilter = THREE.NearestFilter;
          mat.map.minFilter = THREE.NearestFilter;
          mat.map.generateMipmaps = false;
          mat.map.needsUpdate = true;
        }
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  const mixer = useMemo(() => {
    const m = new THREE.AnimationMixer(scene);
    m.timeScale = 0.6;
    const emote =
      animations.find((c) => /emote/i.test(c.name)) ?? animations[0];
    if (emote) {
      m.clipAction(emote).reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
    return m;
  }, [scene, animations]);

  useFrame((_, dt) => mixer.update(dt));
  useEffect(() => () => mixer.stopAllAction(), [mixer]);

  return <primitive ref={ref} object={scene} />;
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
        <hemisphereLight args={["#ffffff", "#e2e0d8", 2.6]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[2, 4, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[4, 1, 2]} intensity={1.2} color="#ffe9b0" />
        <directionalLight position={[-4, 1.5, 2]} intensity={1.2} color="#cfe0f2" />
        <directionalLight position={[0, -3, 3]} intensity={1.2} color="#ffffff" />

        <Suspense fallback={null}>
          <GipsyDanger />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
