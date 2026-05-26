"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { id: "01", label: "Kaijus Defeated", href: "#work" },
  { id: "02", label: "Pilot Dossier", href: "#about" },
  { id: "03", label: "Loadout", href: "#stack" },
  { id: "04", label: "Transmission", href: "#contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-line bg-bg-elev/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <span
            aria-hidden
            className="hazard-stripe-thin block h-5 w-5"
          />
          <span className="font-display text-sm font-bold tracking-widest text-fg">
            TRIBHUVAN
          </span>
          <span className="hidden font-mono text-[10px] tracking-widest text-fg-faint md:inline">
            / PILOT 01
          </span>
        </a>

        <nav className="hidden gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group flex items-baseline gap-2 font-mono text-[11px] tracking-widest text-fg-muted transition-colors hover:text-fg"
            >
              <span className="text-fg-faint group-hover:text-accent">
                {n.id}
              </span>
              <span className="uppercase">{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="text-fg md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* always-on hazard hairline */}
      <div className="h-1 hazard-stripe-thin" aria-hidden />

      {open && (
        <nav className="flex flex-col gap-6 border-t border-line bg-bg-elev px-6 py-8 md:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-3 font-mono text-sm uppercase tracking-widest text-fg-muted hover:text-fg"
            >
              <span className="text-accent">{n.id}</span>
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
