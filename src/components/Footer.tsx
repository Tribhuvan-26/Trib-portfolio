"use client";

import { Logo } from "./Logo";
import { social } from "@/config/social";

export function Footer() {
  return (
    <footer className="relative border-t border-line px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3 text-accent">
          <Logo size={36} />
          <div>
            <div className="font-display text-lg font-semibold text-fg">
              {social.name}
            </div>
            <div className="font-mono text-[10px] tracking-widest text-fg-muted">
              {social.role}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 font-mono text-[11px] tracking-widest text-fg-faint md:items-end">
          <span>© {new Date().getFullYear()} — built with next.js + tailwind</span>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            source on github
          </a>
        </div>
      </div>
    </footer>
  );
}
