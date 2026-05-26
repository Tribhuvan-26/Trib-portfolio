"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/GipsyDanger.glb";
const TARGET_HEIGHT = 1.7;

type Theme = "light" | "dark";

function useDocTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const read = () =>
      (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(read());
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return theme;
}

function GipsyDanger({
  theme,
  clip: requested,
}: {
  theme: Theme;
  clip: string;
}) {
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

  // Force every material opaque + adequately lit so reactor/helmet visor
  // never go blank. Emissive-tagged parts (reactor core, eyes) get hard-
  // overridden to an unlit basic material — guarantees they always glow
  // regardless of theme / scene lighting / depth issues.
  useEffect(() => {
    const ACCENT = new THREE.Color("#ffb800");
    const GLOW_NAMES = /reactor|core|visor|helmet|eye|glass|lens|hud|light|emit|glow/i;
    const dump: { mesh: string; mat: string; type: string; emissive: string; map: boolean }[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.visible = true;
      mesh.frustumCulled = true;
      mesh.renderOrder = 0;

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m, idx) => {
        const mat = m as THREE.MeshStandardMaterial & {
          transmission?: number;
          transmissionMap?: THREE.Texture | null;
          thickness?: number;
          alphaMap?: THREE.Texture | null;
        };
        const hasEmissive =
          !!mat.emissive &&
          (mat.emissive.r > 0 || mat.emissive.g > 0 || mat.emissive.b > 0);
        dump.push({
          mesh: mesh.name,
          mat: mat.name,
          type: mat.type,
          emissive: mat.emissive
            ? `${mat.emissive.r.toFixed(2)},${mat.emissive.g.toFixed(2)},${mat.emissive.b.toFixed(2)}`
            : "-",
          map: !!mat.map,
        });
        const hasTransmission =
          ("transmission" in mat && (mat.transmission ?? 0) > 0.01) ||
          ("transmissionMap" in mat && !!mat.transmissionMap);
        const nameHit =
          GLOW_NAMES.test(mesh.name || "") || GLOW_NAMES.test(mat.name || "");
        const isGlow = hasEmissive || hasTransmission || nameHit;

        // Replace glow parts (reactor, helmet visor, eyes) with an unlit
        // basic material so they always pop, regardless of theme/lighting.
        if (isGlow) {
          // force accent on every glow part — keeps visor/eye/reactor on-brand
          const glow = ACCENT.clone();
          const basic = new THREE.MeshBasicMaterial({
            color: glow,
            map: null,
            transparent: false,
            opacity: 1,
            depthWrite: true,
            depthTest: true,
            side: THREE.FrontSide,
            toneMapped: false,
          });
          if (Array.isArray(mesh.material)) {
            (mesh.material as THREE.Material[])[idx] = basic;
          } else {
            mesh.material = basic;
          }
          mesh.renderOrder = 2;
          return;
        }

        // Non-glow parts: force fully opaque, kill transmission/alpha
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
        mat.alphaTest = 0;
        mat.alphaMap = null;
        mat.side = THREE.FrontSide;
        if ("transmission" in mat) mat.transmission = 0;
        if ("transmissionMap" in mat) mat.transmissionMap = null;
        if ("thickness" in mat) mat.thickness = 0;

        // floor near-black & ceiling near-white so panels don't disappear
        // against either theme's bg
        if ("color" in mat && mat.color) {
          const c = mat.color;
          const sum = c.r + c.g + c.b;
          if (sum < 0.15) c.setRGB(0.15, 0.18, 0.25);
          else if (sum > 2.7 && !mat.map) c.setRGB(0.4, 0.45, 0.55);
        }

        if ("roughness" in mat) {
          mat.roughness = 0.45;
          mat.metalness = 0.4;
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
    // One-time dump: open DevTools console, copy this table, paste back to
    // refine the GLOW_NAMES regex to target reactor / visor by exact name.
    console.table(dump);
  }, [scene, theme]);

  const mixer = useMemo(() => {
    const m = new THREE.AnimationMixer(scene);
    m.timeScale = 0.7;
    return m;
  }, [scene]);

  // switch which clip is active whenever `requested` changes
  const activeAction = useRef<THREE.AnimationAction | null>(null);
  useEffect(() => {
    const rx = new RegExp(requested, "i");
    const clip =
      animations.find((c) => rx.test(c.name)) ?? animations[0];
    if (!clip) return;
    const next = mixer.clipAction(clip);
    next.reset().setLoop(THREE.LoopRepeat, Infinity);
    if (activeAction.current && activeAction.current !== next) {
      next.crossFadeFrom(activeAction.current, 0.35, false);
    }
    next.play();
    activeAction.current = next;
  }, [requested, mixer, animations]);

  useFrame((_, dt) => {
    mixer.update(dt);
  });
  useEffect(
    () => () => {
      mixer.stopAllAction();
    },
    [mixer],
  );

  return <primitive ref={ref} object={scene} />;
}

function SceneLights({ theme }: { theme: Theme }) {
  if (theme === "light") {
    return (
      <>
        <hemisphereLight args={["#ffffff", "#d6d4cc", 2.6]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 5, 4]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-3, 2, 2]} intensity={1.2} color="#ffe9b0" />
        <directionalLight position={[0, -3, 3]} intensity={1.2} color="#ffffff" />
      </>
    );
  }
  return (
    <>
      <hemisphereLight args={["#cfd6e3", "#0a0e15", 1.0]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, 2, 1]} intensity={1.0} color="#ffb800" />
      <pointLight position={[0, 0.4, 2.5]} intensity={0.8} color="#7fb6ff" />
    </>
  );
}

export function Mecha({
  className = "",
  clip = "emote",
}: {
  className?: string;
  clip?: string;
}) {
  const theme = useDocTheme();
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 3], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        style={{ background: "transparent" }}
      >
        <SceneLights theme={theme} />
        <Suspense fallback={null}>
          <GipsyDanger theme={theme} clip={clip} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
