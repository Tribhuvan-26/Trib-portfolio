"use client";

import { social } from "@/config/social";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <div className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            {social.name}<span className="text-pop">.</span>
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-paper/60">
            {social.role}
          </div>
        </div>

        <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-paper/60 md:items-end">
          <span>© {new Date().getFullYear()} · Built with Next.js</span>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper hover:text-pop"
          >
            Source on GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
