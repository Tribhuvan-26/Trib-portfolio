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

    let rx = 0, ry = 0, mx = 0, my = 0, raf = 0;

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
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
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
        className={`pointer-events-none fixed left-0 top-0 z-[90] transition-[width,height,border-color] duration-200 ease-out ${
          hovering
            ? "h-10 w-10 border-2 border-accent"
            : "h-6 w-6 border border-accent"
        }`}
        style={{
          background: hovering ? "rgba(255,184,0,0.12)" : "transparent",
        }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 bg-black"
        style={{ boxShadow: "0 0 6px rgba(0,0,0,0.7)" }}
      />
    </>
  );
}
