"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Mecha } from "./Mecha";
import { ShiftingText } from "./ShiftingText";

const TICKER = [
  "SYSTEMS ONLINE",
  "CONN-POD SYNCED",
  "NEURAL HANDSHAKE STABLE",
  "DRIFT COMPATIBLE",
  "READY FOR DEPLOYMENT",
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
          <Mecha className="absolute inset-0" />

          {/* bottom readouts */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between font-mono text-[10px] leading-relaxed tracking-widest text-fg-muted">
            <div>
              <div>COORD / 35.4N 139.5E</div>
              <div className="text-alert">◢ KAIJU CAT-IV</div>
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
          <div className="flex items-center gap-3 font-mono text-[12px] tracking-widest text-fg-muted">
            <span className="bg-fg px-2 py-1 text-bg">001</span>
            <span>ABOUT</span>
          </div>

          <h1 className="font-display text-[20vw] font-bold leading-[0.85] tracking-tight text-fg md:text-[11.5vw] lg:text-[9.5vw]">
            tribhuvan
            <span className="text-accent">.</span>
          </h1>

          <div className="flex flex-wrap items-baseline gap-3 font-display text-2xl text-fg-muted md:text-3xl">
            <span>Hi, I&apos;m</span>
            <ShiftingText
              words={[
                "Ranger",
                "K-Sci",
                "J-Tech",
                "Drift-Compatible",
                "Conn-Pod Crew",
                "Architect",
              ]}
              className="font-bold text-accent"
            />
          </div>

          <div className="flex items-center gap-3 font-mono text-[12px] tracking-widest">
            <span className="h-px w-10 bg-fg" />
            <span className="text-fg-muted">
              CSE @ MLRIT · TECH MENTOR @ CIE-MLRIT
            </span>
          </div>

          <p className="max-w-xl font-display text-lg leading-relaxed text-fg-muted md:text-xl">
            Building research-flavored systems that ship — from ResNet
            classifiers to AR furniture pipelines to institutional platforms.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 border-2 border-fg bg-fg px-5 py-3 font-mono text-xs tracking-widest text-bg transition-colors hover:bg-accent hover:text-fg"
            >
              DEPLOYED UNITS
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 border-2 border-fg px-5 py-3 font-mono text-xs tracking-widest text-fg transition-colors hover:bg-fg hover:text-bg"
            >
              ESTABLISH TRANSMISSION
            </a>
          </div>

          <a
            href="#work"
            className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-fg-faint hover:text-fg"
          >
            <ArrowDown size={12} className="animate-blip" />
            SCROLL TO DEPLOY
          </a>
        </motion.div>
      </div>

      {/* bottom ticker */}
      <div>
        <div className="h-2 hazard-stripe-thin" aria-hidden />
        <div className="overflow-hidden bg-fg text-bg">
          <div className="flex animate-marquee whitespace-nowrap py-3 font-mono text-[11px] tracking-[0.35em]">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
                {TICKER.map((t, i) => (
                  <span key={`${k}-${i}`} className="flex items-center gap-10">
                    <span>{t}</span>
                    <span className="text-accent">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="h-2 hazard-stripe-thin" aria-hidden />
      </div>
    </section>
  );
}

