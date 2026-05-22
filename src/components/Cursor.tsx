"use client";

import { useEffect, useRef, useState } from "react";

const isTouch = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isTouch()) {
      setShow(false);
      return;
    }

    let rx = 0,
      ry = 0,
      mx = 0,
      my = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as HTMLElement | null;
      if (target) {
        setHovering(
          !!target.closest("a, button, [role='button'], input, textarea, label"),
        );
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (dot.current)
        dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!show) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[90] rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-out ${
          hovering
            ? "h-12 w-12 border-accent bg-accent/10"
            : "h-7 w-7 border-fg/40"
        }`}
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1 w-1 rounded-full bg-accent"
        style={{ boxShadow: "0 0 8px #1f9bff" }}
      />
    </>
  );
}
