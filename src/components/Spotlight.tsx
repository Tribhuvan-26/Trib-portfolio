"use client";

import { useEffect } from "react";

// Cursor-tracked light over the dossier grid — turns the blank paper into a
// live light-table instead of dead space. Pure CSS var updates, no re-renders.
export function Spotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip on touch
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <div aria-hidden className="spotlight" />;
}
