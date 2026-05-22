"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  size?: number;
  className?: string;
  /** When true, mark reacts to hover + cursor + breathes. Default false (static). */
  interactive?: boolean;
}

/**
 * Original Tribhuvan mark — angular winged V silhouette with notched edges.
 * Geometry is custom (no DC / brand reproduction). Inherits color via currentColor.
 *
 * - Two wing halves with descending angular notches
 * - Central downward body/spear
 * - Optional breathing + hover-spread + cursor-tilt interactions
 */
export function Logo({ size = 28, className = "", interactive = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // mouse tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 160, damping: 16 });
  const rotX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 160, damping: 16 });

  useEffect(() => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    };
    const onLeave = () => {
      mx.set(0.5);
      my.set(0.5);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, mx, my]);

  const Mark = (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 200 140"
      fill="currentColor"
      aria-label="Tribhuvan"
      className="block"
    >
      <defs>
        <filter id="markGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Single filled path — left wing → body spike → right wing.
          Anchor points create the angular notch silhouette. */}
      <path
        filter="url(#markGlow)"
        d="
          M 100 18
          L 100 8
          L 110 18
          L 112 14
          L 122 24
          L 138 22
          L 152 38
          L 168 36
          L 180 52
          L 196 54
          L 190 68
          L 174 70
          L 162 88
          L 148 86
          L 138 102
          L 124 100
          L 116 112
          L 110 110
          L 112 124
          L 100 138
          L 88 124
          L 90 110
          L 84 112
          L 76 100
          L 62 102
          L 52 86
          L 38 88
          L 26 70
          L 10 68
          L 4 54
          L 20 52
          L 32 36
          L 48 38
          L 62 24
          L 78 22
          L 88 14
          L 90 18
          Z
        "
      />
    </svg>
  );

  if (!interactive) {
    return <span className={`inline-block ${className}`}>{Mark}</span>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 800 }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={`relative inline-block cursor-none ${className}`}
    >
      {/* Breathing wrapper */}
      <motion.div
        animate={{ scale: hover ? 1.06 : [1, 1.025, 1] }}
        transition={
          hover
            ? { duration: 0.4 }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          filter: hover
            ? "drop-shadow(0 0 18px currentColor) drop-shadow(0 0 32px currentColor)"
            : "drop-shadow(0 0 8px currentColor)",
          transition: "filter 0.4s ease",
        }}
      >
        {Mark}
      </motion.div>

      {/* Floating scan-line decoration */}
      <motion.span
        aria-hidden
        animate={{ y: hover ? [0, size * 0.7, 0] : 0, opacity: hover ? [0, 0.7, 0] : 0 }}
        transition={{ duration: 1.4, repeat: hover ? Infinity : 0 }}
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-current"
        style={{ filter: "blur(1px)" }}
      />
    </motion.div>
  );
}
