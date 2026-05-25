"use client";

import { social } from "@/config/social";

export function Footer() {
  return (
    <footer className="relative">
      <div className="h-3 hazard-stripe-thin" aria-hidden />
      <div className="bg-fg text-bg">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-bg/60">
              SHATTERDOME // PILOT 01
            </div>
            <div className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              {social.name.toUpperCase()}
              <span className="text-accent">.</span>
            </div>
            <div className="mt-1 font-mono text-[11px] tracking-widest text-bg/70">
              {social.role.toUpperCase()}
            </div>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[11px] tracking-widest text-bg/60 md:items-end">
            <span>© {new Date().getFullYear()} — BUILT IN THE BAY · NEXT.JS · R3F</span>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bg/80 hover:text-accent"
            >
              SOURCE ON GITHUB ↗
            </a>
          </div>
        </div>
      </div>
      <div className="h-3 hazard-stripe-thin" aria-hidden />
    </footer>
  );
}
