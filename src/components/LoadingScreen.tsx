"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

const PHRASES = [
  "fetching neurons",
  "warming up gpus",
  "loading work",
  "establishing signal",
  "ready",
];

export function LoadingScreen() {
  const [pct, setPct] = useState(0);
  const [phrase, setPhrase] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 2200;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / DURATION) * 100);
      setPct(p);
      setPhrase(Math.min(PHRASES.length - 1, Math.floor((p / 100) * PHRASES.length)));
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 500);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
        >
          <div className="flex flex-col items-center gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="text-accent"
            >
              <Logo size={64} />
            </motion.div>

            <div className="font-mono text-[11px] tracking-[0.3em] text-fg-muted">
              {PHRASES[phrase]}
              <span className="ml-1 animate-pulse-accent">_</span>
            </div>
          </div>

          {/* bottom bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-8 pb-8">
            <div className="font-mono text-[10px] tracking-widest text-fg-faint">
              tribhuvan / portfolio / v2
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-40 bg-fg-faint/30">
                <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
              <div className="font-mono text-[11px] tabular-nums text-fg">
                {pct.toFixed(0).padStart(3, "0")}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
