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

  return null;
}
