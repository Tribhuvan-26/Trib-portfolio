"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Signals", href: "#signals" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-[3px] border-ink bg-paper">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="font-display text-lg font-extrabold tracking-tight text-ink">
          TRIBHUVAN<span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-mono text-[12px] font-medium uppercase tracking-widest text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
          <button
            onClick={() => window.dispatchEvent(new Event("open-command"))}
            aria-label="Open command menu"
            className="flex items-center gap-1.5 border-[1.5px] border-ink px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted transition-colors hover:bg-pop hover:text-ink"
          >
            <kbd className="font-sans">⌘</kbd>K
          </button>
          <a
            href="#contact"
            className="brut brut-hover brut-accent bg-accent px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-widest text-paper"
          >
            Get in touch
          </a>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-ink md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t-[3px] border-ink bg-paper px-5 py-6 md:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-paper-2 py-3 font-display text-2xl font-bold text-ink"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 bg-accent px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-widest text-paper"
          >
            Get in touch
          </a>
        </nav>
      )}
    </header>
  );
}
