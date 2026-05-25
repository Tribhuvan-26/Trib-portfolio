"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  speed?: number; // ms between scramble ticks
  duration?: number; // total ms to settle
  className?: string;
  /** scramble pool — biased toward jaeger/sci-fi glyphs */
  chars?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▰▱◢◣◤◥◆◇";

/**
 * Reactbits-style decrypt: every char cycles through random glyphs then locks
 * to the target left-to-right. Re-runs on hover.
 */
export function DecryptedText({
  text,
  speed = 38,
  duration = 1100,
  className = "",
  chars = DEFAULT_CHARS,
}: Props) {
  const [output, setOutput] = useState(text);
  const interval = useRef<number | null>(null);
  const startedAt = useRef<number>(0);

  const run = () => {
    if (interval.current) window.clearInterval(interval.current);
    startedAt.current = performance.now();
    interval.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt.current;
      const lockCount = Math.min(text.length, Math.floor((elapsed / duration) * text.length));
      const next = text
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (i < lockCount) return ch;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      setOutput(next);
      if (lockCount >= text.length) {
        if (interval.current) window.clearInterval(interval.current);
        interval.current = null;
        setOutput(text);
      }
    }, speed);
  };

  useEffect(() => {
    run();
    return () => {
      if (interval.current) window.clearInterval(interval.current);
    };
    // run on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      onPointerEnter={run}
      style={{ display: "inline-block" }}
    >
      {output}
    </span>
  );
}
