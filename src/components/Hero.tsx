"use client";

import { motion } from "framer-motion";
import { social } from "@/config/social";
import { Mecha } from "./Mecha";

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
    <span
      aria-hidden
      className={`absolute h-4 w-4 border-accent ${map[pos]}`}
    />
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col overflow-hidden pt-16"
    >
      {/* HUD callouts */}
      <div className="z-10 grid grid-cols-2 gap-4 px-6 pt-6 md:px-10 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xs border border-line bg-bg-elev/80 px-4 py-3 backdrop-blur"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-fg-muted">
            <span className="h-2 w-2 rounded-full bg-accent animate-blip" />
            PILOT 01 // IDENTITY
          </div>
          <div className="mt-2 font-display text-lg font-bold tracking-tight text-fg">
            {social.name.toUpperCase()}
          </div>
          <div className="font-mono text-[10px] tracking-widest text-fg-muted">
            ROLE / AI&nbsp;·&nbsp;ML&nbsp;·&nbsp;FULL-STACK
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xs justify-self-end border border-line bg-bg-elev/80 px-4 py-3 text-right backdrop-blur"
        >
          <div className="font-mono text-[10px] tracking-widest text-fg-muted">
            JAEGER MK-III // GIPSY DANGER
          </div>
          <div className="mt-2 font-display text-lg font-bold tracking-tight text-fg">
            STATUS — ACTIVE
          </div>
          <div className="font-mono text-[10px] tracking-widest text-alert">
            ◢ THREAT INCOMING
          </div>
        </motion.div>
      </div>

      {/* MECHA centerpiece */}
      <div className="relative flex-1">
        {/* crosshair frame */}
        <div
          className="pointer-events-none absolute inset-x-6 inset-y-4 md:inset-x-10 md:inset-y-6"
          aria-hidden
        >
          <div className="absolute inset-0 border border-line" />
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          {/* center crosshair */}
          <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-fg/20" />
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-fg/20" />
        </div>

        <Mecha className="absolute inset-0" />

        {/* readout corners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute left-8 bottom-10 hidden font-mono text-[10px] leading-relaxed tracking-widest text-fg-muted md:left-14 md:block"
        >
          <div>COORD / 35.4N 139.5E</div>
          <div>DEPTH / 0247m</div>
          <div className="text-alert">◢ KAIJU CAT-IV</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="absolute right-8 bottom-10 hidden text-right font-mono text-[10px] leading-relaxed tracking-widest text-fg-muted md:right-14 md:block"
        >
          <div>POWER / 98%</div>
          <div>PLASMACASTER / READY</div>
          <div className="text-accent">SYNC RATIO / 100%</div>
        </motion.div>
      </div>

      {/* big name slab */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 px-6 md:px-10"
      >
        <div className="flex items-baseline gap-3 font-mono text-[10px] tracking-widest text-fg-faint">
          <span className="bg-accent px-1.5 py-0.5 text-fg">001</span>
          <span>OPERATOR DOSSIER</span>
        </div>
        <h1 className="mt-3 font-display text-[16vw] font-bold leading-[0.85] tracking-tight text-fg md:text-[11vw]">
          tribhuvan
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-display text-base text-fg-muted md:text-lg">
          AI/ML engineer &amp; full-stack pilot. Building research-flavored
          systems that ship — from CNN classifiers to retrieval pipelines to
          interfaces that respect the operator.
        </p>
      </motion.div>

      {/* hazard stripe + ticker */}
      <div className="relative mt-8">
        <div className="h-3 hazard-stripe-thin" aria-hidden />
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
        <div className="h-3 hazard-stripe-thin" aria-hidden />
      </div>
    </section>
  );
}
