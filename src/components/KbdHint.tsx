"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMod } from "@/lib/useMod";

// Small persistent nudge so first-time visitors discover the command palette.
// Vanishes for good once they open it (remembered across visits).
export function KbdHint() {
  const mod = useMod();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cmdk-seen")) return;
    const t = setTimeout(() => setShow(true), 1400);
    const seen = () => {
      setShow(false);
      try {
        localStorage.setItem("cmdk-seen", "1");
      } catch {}
    };
    window.addEventListener("open-command", seen);
    return () => {
      clearTimeout(t);
      window.removeEventListener("open-command", seen);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.dispatchEvent(new Event("open-command"))}
          className="brut brut-hover fixed bottom-5 right-5 z-40 hidden items-center gap-2 bg-paper px-3.5 py-2.5 font-mono text-[12px] font-bold uppercase tracking-widest text-ink md:flex"
          aria-label="Open command menu"
        >
          Press
          <kbd className="border-[1.5px] border-ink bg-pop px-1.5 py-0.5 text-[11px]">
            {mod} K
          </kbd>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
