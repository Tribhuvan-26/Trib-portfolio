"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { projects } from "@/config/projects";

// Small floating readout that swaps a section-relevant number as you scroll.
type Stat = { value: string; label: string };

// ponytail: stack count (27) hardcoded from Stack.tsx's LAYERS — bump if that
// list grows. projects count is derived live.
const STATS: Record<string, Stat> = {
  top: { value: "↓", label: "scroll down" },
  work: { value: String(projects.length), label: "projects" },
  about: { value: "200+", label: "mentored" },
  stack: { value: "27", label: "technologies" },
  signals: { value: "…", label: "commits '26" },
  contact: { value: "→", label: "let's talk" },
};
const ORDER = ["top", "work", "about", "stack", "signals", "contact"];

export function StatHUD() {
  const [sectionId, setSectionId] = useState("top");
  const [commits, setCommits] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    fetch("/api/contributions")
      .then((r) => r.json())
      .then((j: { total?: number }) => j?.total != null && setCommits(String(j.total)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting && STATS[en.target.id]) setSectionId(en.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    ORDER.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  if (hidden) return null;

  const base = STATS[sectionId] ?? STATS.top;
  const stat: Stat =
    sectionId === "signals" && commits
      ? { value: commits, label: "commits '26" }
      : base;

  return (
    <div className="brut fixed bottom-4 left-4 z-40 hidden min-w-[110px] bg-paper px-3.5 py-2.5 text-center md:block">
      <button
        onClick={() => setHidden(true)}
        aria-label="Dismiss"
        className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center border-[1.5px] border-ink bg-pop text-ink hover:bg-ink hover:text-paper"
      >
        <X size={11} strokeWidth={3} />
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={stat.value + stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-display text-3xl font-extrabold leading-none tracking-tight text-ink">
            {stat.value}
          </div>
          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
            {stat.label}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
