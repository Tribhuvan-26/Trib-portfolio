"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Mecha } from "./Mecha";
import { ShiftingText } from "./ShiftingText";
import { HazardTicker } from "./HazardTicker";

const CLIPS: { id: string; label: string }[] = [
  { id: "emote", label: "EMOTE" },
  { id: "idle", label: "IDLE" },
  { id: "walk", label: "WALK" },
  { id: "run", label: "RUN" },
];

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return (
    <span aria-hidden className={`absolute h-4 w-4 border-accent ${map[pos]}`} />
  );
}

export function Hero() {
  const [clip, setClip] = useState<string>("idle");
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col pt-14"
    >
      <div className="h-2 hazard-stripe-thin" aria-hidden />

      <div className="grid flex-1 grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[5fr_7fr] md:gap-12 md:px-10 md:py-16">
        {/* LEFT — jaeger panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[420px] border border-line bg-bg-elev/50 backdrop-blur md:min-h-[600px]"
        >
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {/* top label */}
          <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-center justify-between font-mono text-[10px] tracking-widest text-fg-muted">
            <span className="flex items-center gap-2">
              <span className="bg-accent px-1.5 py-0.5 text-fg">JGR</span>
              MK-III // GIPSY DANGER
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-blip" />
              ACTIVE
            </span>
          </div>

          {/* the mecha canvas */}
          <Mecha className="absolute inset-0" clip={clip} />

          {/* clip controls */}
          <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {CLIPS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setClip(c.id)}
                className={`border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-colors ${
                  clip === c.id
                    ? "border-accent bg-accent text-bg"
                    : "border-line bg-bg-elev/70 text-fg-muted hover:border-fg hover:text-fg"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* bottom readouts */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between font-mono text-[10px] leading-relaxed tracking-widest text-fg-muted">
            <div>
              <div>COORD / 35.4N 139.5E</div>
              <div className="text-alert">◢ {clip.toUpperCase()}</div>
            </div>
            <div className="text-right">
              <div>POWER / 98%</div>
              <div className="text-accent">SYNC / 100%</div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — identity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center gap-5"
        >
          {/* tag line — Sid's "yea, I'm batman" energy */}
          <div className="font-mono text-[13px] uppercase tracking-[0.25em] text-accent">
            yea, i&apos;m a ranger
          </div>

          {/* need a [Role]? */}
          <div className="flex flex-col leading-[0.9]">
            <span className="font-display text-3xl font-medium text-fg-muted md:text-5xl lg:text-6xl">
              need a
            </span>
            <div className="flex items-baseline whitespace-nowrap">
              <ShiftingText
                words={["Developer", "Builder", "Tech Enthusiast"]}
                className="font-display text-[14vw] font-extrabold tracking-tight text-accent whitespace-nowrap md:text-[7.5vw] lg:text-[6vw]"
              />
              <span className="font-display text-[14vw] font-extrabold tracking-tight text-accent md:text-[7.5vw] lg:text-[6vw]">
                ?
              </span>
            </div>
          </div>

          {/* subtitle */}
          <p className="max-w-xl font-display text-lg leading-relaxed text-fg-muted md:text-xl">
            I&apos;m <span className="text-fg">Tribhuvan</span> — AI/ML,
            full-stack & IoT enthusiast. CSE @ MLRIT · Tech Mentor @ CIE-MLRIT.
          </p>

          {/* explore CTA */}
          <a
            href="#work"
            className="group mt-2 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.25em] text-accent hover:text-fg"
          >
            <ArrowDown size={14} className="animate-blip" />
            explore
          </a>
        </motion.div>
      </div>

      <HazardTicker />
    </section>
  );
}

