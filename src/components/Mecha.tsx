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

  // GLB binds textures + skinning correctly. Force opaque to fix the blank
  // helmet visor / reactor (those had transparent=true with low opacity from
  // Blender's Principled BSDF). Boost emissive so reactor glows on dark bg.
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        // force opaque rendering — kills the "invisible reactor/helmet" bug
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
        mat.alphaTest = 0;
        mat.side = THREE.FrontSide;

        if ("roughness" in mat) {
          mat.roughness = 0.45;
          mat.metalness = 0.45;
        }
        // boost any material that already has an emissive color (reactor, eyes)
        const hasEmissive =
          mat.emissive &&
          (mat.emissive.r > 0 || mat.emissive.g > 0 || mat.emissive.b > 0);
        if (hasEmissive) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity ?? 0, 2.2);
        } else if ("emissiveIntensity" in mat) {
          mat.emissiveIntensity = 0.1;
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
        {/* dark scene — moodier lighting, hazard rim */}
        <hemisphereLight args={["#cfd6e3", "#0a0e15", 1.0]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-4, 2, 1]} intensity={1.0} color="#ffb800" />
        <pointLight position={[0, 0.4, 2.5]} intensity={0.8} color="#7fb6ff" />

        <Suspense fallback={null}>
          <GipsyDanger />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
