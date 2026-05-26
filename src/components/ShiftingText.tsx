"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  words: string[];
  interval?: number; // ms between swaps
  className?: string;
}

/**
 * Sudden-shift text swap (reactbits "TextRotate" / sid-style).
 * Each word skews/slams in from the right, then exits left.
 */
export function ShiftingText({ words, interval = 2200, className = "" }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const t = window.setInterval(() => {
      setI((prev) => (prev + 1) % words.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-block ${className}`} style={{ minWidth: "1ch" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${i}-${words[i]}`}
          initial={{ opacity: 0, y: 10, skewY: 4 }}
          animate={{ opacity: 1, y: 0, skewY: 0 }}
          exit={{ opacity: 0, y: -10, skewY: -4 }}
          transition={{ duration: 0.38, ease: [0.65, 0, 0.35, 1] }}
          className="inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
