"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { social } from "@/config/social";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Links" | "Actions";
  run: () => void;
};

export function Command() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const link = (href: string) => () => window.open(href, "_blank", "noopener");

  const cmds = useMemo<Cmd[]>(
    () => [
      { id: "work", label: "Selected Work", hint: "01", group: "Navigate", run: go("work") },
      { id: "about", label: "About", hint: "02", group: "Navigate", run: go("about") },
      { id: "stack", label: "Stack", hint: "03", group: "Navigate", run: go("stack") },
      { id: "signals", label: "Signals", hint: "04", group: "Navigate", run: go("signals") },
      { id: "contact", label: "Contact", hint: "05", group: "Navigate", run: go("contact") },
      { id: "top", label: "Back to top", hint: "↑", group: "Navigate", run: go("top") },
      { id: "gh", label: "GitHub", hint: "↗", group: "Links", run: link(social.github) },
      { id: "li", label: "LinkedIn", hint: "↗", group: "Links", run: link(social.linkedin) },
      { id: "tw", label: "Twitter / X", hint: "↗", group: "Links", run: link(social.twitter) },
      {
        id: "copy",
        label: "Copy email address",
        hint: "⎘",
        group: "Actions",
        run: () => {
          navigator.clipboard?.writeText(social.email);
          setCopied(true);
        },
      },
      { id: "mail", label: "Send an email", hint: "→", group: "Actions", run: link(`mailto:${social.email}`) },
    ],
    [],
  );

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return cmds;
    return cmds.filter((c) => c.label.toLowerCase().includes(s) || c.group.toLowerCase().includes(s));
  }, [q, cmds]);

  // global ⌘K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // let the Nav (or anything) open it via a plain event; #menu deep-links it
    const openIt = () => setOpen(true);
    window.addEventListener("open-command", openIt);
    if (window.location.hash === "#menu") setOpen(true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", openIt);
    };
  }, []);

  // reset + focus each time it opens
  useEffect(() => {
    if (!open) return;
    setQ("");
    setI(0);
    setCopied(false);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => setI(0), [q]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setI((v) => Math.min(results.length - 1, v + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setI((v) => Math.max(0, v - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = results[i];
      if (!c) return;
      c.run();
      if (c.id !== "copy") setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/40 px-4 pt-[14vh] backdrop-blur-[2px]"
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
            className="brut w-full max-w-lg overflow-hidden bg-paper"
          >
            <div className="flex items-center gap-3 border-b-[2.5px] border-ink bg-pop px-4 py-2.5">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                ~/tribhuvan
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="type a command…"
                className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ink/50 focus:outline-none"
                aria-label="Search commands"
              />
              <kbd className="border-[1.5px] border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">
                ESC
              </kbd>
            </div>

            <ul className="max-h-[52vh] overflow-y-auto py-1.5">
              {results.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-[12px] tracking-widest text-faint">
                  No matches.
                </li>
              )}
              {results.map((c, idx) => (
                <li key={c.id}>
                  <button
                    onMouseEnter={() => setI(idx)}
                    onClick={() => {
                      c.run();
                      if (c.id !== "copy") setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left font-mono text-[13px] transition-colors ${
                      idx === i ? "bg-accent text-paper" : "text-ink hover:bg-paper-2"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`text-[10px] uppercase tracking-widest ${
                          idx === i ? "text-paper/70" : "text-faint"
                        }`}
                      >
                        {c.group}
                      </span>
                      <span className="font-semibold">
                        {c.id === "copy" && copied ? "Copied ✓" : c.label}
                      </span>
                    </span>
                    <span className={idx === i ? "text-paper/80" : "text-faint"}>{c.hint}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t-[1.5px] border-paper-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-faint">
              <span>↑↓ move · ⏎ run</span>
              <span>⌘K anytime</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
