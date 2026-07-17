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

  return null;
}
