"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress } from "@react-three/drei";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";

const MODEL_URL = "/models/GipsyDanger.glb";
const TARGET_HEIGHT = 1.7;

type Theme = "light" | "dark";
type Pointer = { x: number; y: number };

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
  pointer,
  reduced,
  onReady,
}: {
  theme: Theme;
  clip: string;
  pointer: React.RefObject<Pointer>;
  reduced: boolean;
  onReady: () => void;
}) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const ref = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);

  // model is resolved (Suspense cleared) by the time this effect runs —
  // signal the boot overlay it can clear.
  useEffect(() => {
    onReady();
  }, [onReady]);

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
    const ACCENT = new THREE.Color("#8a5a00");
    // Visor reads as a flat unlit color (no scene light hits it), so it needs a
    // brighter gold than ACCENT or it goes muddy. Decoupled on purpose: dimming
    // ACCENT must not drag the visor into the dark.
    const VISOR = new THREE.Color("#e0a420");
    const REACTOR_NAMES = /spinning_blade/i;
    const GLASS_NAMES = /visor|helmet|eye|glass|lens|hud/i;
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
        const wasTransparent =
          mat.transparent === true ||
          (typeof mat.opacity === "number" && mat.opacity < 0.95) ||
          ("transmission" in mat && (mat.transmission ?? 0) > 0.01) ||
          ("transmissionMap" in mat && !!mat.transmissionMap) ||
          !!mat.alphaMap;
        const isReactor =
          REACTOR_NAMES.test(mesh.name || "") || REACTOR_NAMES.test(mat.name || "");
        const isGlass =
          GLASS_NAMES.test(mesh.name || "") ||
          GLASS_NAMES.test(mat.name || "") ||
          wasTransparent;

        // Reactor: tint the existing material gold but keep the pinwheel
        // texture so detail isn't lost.
        if (isReactor) {
          if ("color" in mat && mat.color) mat.color.copy(ACCENT);
          if ("emissive" in mat && mat.emissive) {
            mat.emissive.copy(ACCENT);
            mat.emissiveIntensity = 0.4;
          }
          mat.transparent = false;
          mat.opacity = 1;
          mat.depthWrite = true;
          if ("transmission" in mat) mat.transmission = 0;
          if ("transmissionMap" in mat) mat.transmissionMap = null;
          if ("roughness" in mat) {
            mat.roughness = 0.35;
            mat.metalness = 0.2;
          }
          mat.needsUpdate = true;
          mesh.renderOrder = 1;
          return;
        }

        // Glass parts (helmet visor, eyes): force fully opaque + accent so
        // they pop instead of showing the bg through.
        if (isGlass) {
          const basic = new THREE.MeshBasicMaterial({
            color: VISOR.clone(),
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
        mat.blending = THREE.NormalBlending;
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

    // Second pass: find the helmet by position (topmost ~22% of the model)
    // and force its meshes fully opaque with a visible base color so it
    // doesn't disappear into the panel background.
    scene.updateMatrixWorld(true);
    const fullBox = new THREE.Box3().setFromObject(scene);
    if (isFinite(fullBox.min.y)) {
      const fullSize = new THREE.Vector3();
      fullBox.getSize(fullSize);
      const headLineY = fullBox.max.y - fullSize.y * 0.22;
      const HEAD_COLOR = new THREE.Color("#2a2d35");
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mb = new THREE.Box3().setFromObject(mesh);
        const mc = new THREE.Vector3();
        mb.getCenter(mc);
        if (mc.y < headLineY) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          mat.transparent = false;
          mat.opacity = 1;
          mat.depthWrite = true;
          mat.alphaTest = 0;
          mat.alphaMap = null;
          mat.blending = THREE.NormalBlending;
          if ("color" in mat && mat.color) {
            const sum = mat.color.r + mat.color.g + mat.color.b;
            if (sum < 0.45) mat.color.copy(HEAD_COLOR);
          }
          mat.needsUpdate = true;
        });
      });
    }
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

    // cursor-follow: ease the tilt group toward the pointer so the jaeger
    // subtly "watches" the visitor. Recenters when the pointer leaves.
    const t = tilt.current;
    if (t && !reduced) {
      const p = pointer.current ?? { x: 0, y: 0 };
      const targetY = p.x * 0.35;
      const targetX = p.y * 0.12;
      const k = Math.min(1, dt * 3);
      t.rotation.y += (targetY - t.rotation.y) * k;
      t.rotation.x += (targetX - t.rotation.x) * k;
    }
  });
  useEffect(
    () => () => {
      mixer.stopAllAction();
    },
    [mixer],
  );

  return (
    <group ref={tilt}>
      <primitive ref={ref} object={scene} />
    </group>
  );
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

// Jaeger-themed boot screen shown over the canvas until the GLB resolves.
function BootOverlay({ ready }: { ready: boolean }) {
  const { progress } = useProgress();
  const pct = ready ? 100 : Math.min(99, Math.round(progress));
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 overflow-hidden bg-bg/80 backdrop-blur-sm"
        >
          {/* sweeping scanline */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-accent shadow-[0_0_12px_var(--accent-glow)] animate-scan"
          />
          <span className="font-mono text-[10px] tracking-[0.3em] text-fg-muted animate-pulse-accent">
            SYNCING NEURAL HANDSHAKE
          </span>
          {/* progress bar */}
          <div className="h-1 w-40 overflow-hidden border border-line bg-bg-elev/60">
            <div
              className="h-full bg-accent transition-[width] duration-200 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-accent">
            {pct}% DRIFT COMPATIBLE
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// "drag to rotate" affordance — fades out the first time the user grabs.
function DragHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute bottom-28 left-1/2 z-10 -translate-x-1/2"
        >
          <span className="flex items-center gap-1.5 border border-line bg-bg-elev/70 px-2.5 py-1 font-mono text-[10px] tracking-widest text-fg-muted backdrop-blur animate-pulse-accent">
            <span aria-hidden>⇄</span> DRAG TO ROTATE
          </span>
        </motion.div>
      )}
    </AnimatePresence>
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
  const reduced = useReducedMotion() ?? false;

  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleStart = () => {
    setInteracted(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setAutoRotate(false);
  };
  const handleEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoRotate(true), 2500);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const onPointerLeave = () => {
    pointer.current.x = 0;
    pointer.current.y = 0;
  };

  return (
    <div
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 3], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        style={{ background: "transparent" }}
      >
        <SceneLights theme={theme} />
        <Suspense fallback={null}>
          <GipsyDanger
            theme={theme}
            clip={clip}
            pointer={pointer}
            reduced={reduced}
            onReady={() => setReady(true)}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          autoRotate={autoRotate && !reduced}
          autoRotateSpeed={0.6}
          onStart={handleStart}
          onEnd={handleEnd}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
        />
      </Canvas>

      <BootOverlay ready={ready} />
      <DragHint show={ready && !interacted && !reduced} />
    </div>
  );
}

useGLTF.preload(MODEL_URL);
