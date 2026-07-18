"use client";

import { useEffect, useState } from "react";

// "⌘" on Apple platforms, "Ctrl" everywhere else. Starts as "⌘" so SSR markup
// is stable, then corrects on mount (no layout shift — it's a tiny kbd).
export function useMod() {
  const [mod, setMod] = useState("⌘");
  useEffect(() => {
    const apple = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
    if (!apple) setMod("Ctrl");
  }, []);
  return mod;
}
