"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/GipsyDanger.fbx";
const EMOTE_CLIP = "Armature|Gipsy.Emote1";

function GipsyDanger() {
  const fbx = useFBX(MODEL_URL);

  const { scene, mixer } = useMemo(() => {
    const root = fbx.clone(true) as THREE.Group;
    const m = new THREE.AnimationMixer(root);

    const clip =
      root.animations.find((c) => c.name === EMOTE_CLIP) ??
      fbx.animations.find((c) => c.name === EMOTE_CLIP) ??
      fbx.animations[0];

    if (clip) {
      m.clipAction(clip).reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      const mat = mesh.material as THREE.MeshPhongMaterial;
      if (mat && "shininess" in mat) {
        mat.shininess = 18;
        mat.specular = new THREE.Color("#1c2230");
        mat.flatShading = false;
      }
    });

    return { scene: root, mixer: m };
  }, [fbx]);

  useFrame((_, dt) => mixer.update(dt));
  useEffect(() => () => mixer.stopAllAction(), [mixer]);

  // tiny, centered — Blender FBX comes in cm so 0.003 → roughly 0.6m tall on screen
  return <primitive object={scene} scale={0.003} position={[0, -0.3, 0]} />;
}

export function Mecha({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 3.5], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ background: "transparent" }}
      >
        {/* sky / overcast hangar */}
        <hemisphereLight args={["#ffffff", "#c8c6be", 0.7]} />
        <ambientLight intensity={0.45} />

        {/* key light from above-front */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.4}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* hazard rim — yellow from below-left */}
        <directionalLight position={[-3, 0.5, -1]} intensity={0.7} color="#ffb800" />
        {/* ocean fill */}
        <pointLight position={[-2, 0.4, 2.5]} intensity={0.55} color="#1e4d6b" />

        <Suspense fallback={null}>
          <GipsyDanger />
          <ContactShadows
            position={[0, -0.32, 0]}
            opacity={0.4}
            scale={1.6}
            blur={2}
            far={1}
            color="#14181f"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useFBX.preload(MODEL_URL);
