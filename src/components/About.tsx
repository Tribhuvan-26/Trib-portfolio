"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Cpu, GraduationCap, Radio, type LucideIcon } from "lucide-react";
import { social } from "@/config/social";
import { Section } from "./Section";

type Vital = {
  label: string;
  value: string;
  icon: LucideIcon;
  readout: string; // little mono telemetry code on the right
  live?: boolean; // pulses a green "online" indicator (drift status)
};

const VITALS: Vital[] = [
  { label: "LOCATION", value: social.location, icon: MapPin, readout: "17.4°N" },
  { label: "EXPERTISE", value: "AI/ML · Full-Stack · IoT", icon: Cpu, readout: "3-CORE" },
  { label: "CURRENT OP", value: "Technical Lead & Mentor @ CIE-MLRIT", icon: GraduationCap, readout: "ACTIVE" },
  { label: "DRIFT STATUS", value: "Open to collab", icon: Radio, readout: "OPEN", live: true },
];

const CHANNELS = [
  {
    id: "01",
    tag: "IDENTITY",
    body: social.bio,
  },
  {
    id: "02",
    tag: "PHILOSOPHY",
    body:
      "I like work that lives at the seam between research and production: ResNet classifiers with Grad-CAM explainability, Next.js + Supabase platforms running in prod, AR pipelines in Unity. The good stuff usually shows up when those three meet.",
  },
  {
    id: "03",
    tag: "DAY JOB",
    body:
      "Leading and mentoring 100+ students at CIE-MLRIT across IoT, vibe-coding, CAD, and additive manufacturing — pushed project delivery rate up 2x and shipped a Python application serving 30+ institutional users.",
  },
];

export function About() {
  const [active, setActive] = useState(0);
  const channel = CHANNELS[active];

  return (
    <Section
      id="about"
      index="003"
      label="PILOT DOSSIER"
      title="who"
      kicker="A short transmission on what I do and how I move."
    >
      <div className="grid gap-12 md:grid-cols-[2fr_1fr] md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          {/* channel selector */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
            {CHANNELS.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group flex items-baseline gap-2 border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-colors ${
                    isActive
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line text-fg-faint hover:border-fg-muted hover:text-fg-muted"
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-accent animate-blip" : "bg-fg-faint"
                    }`}
                    aria-hidden
                  />
                  CH-{c.id}
                  <span className="hidden sm:inline">// {c.tag}</span>
                </button>
              );
            })}
          </div>

          {/* active transmission */}
          <AnimatePresence mode="wait">
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-fg-faint">
                <span className="text-accent">▰▰</span>
                INCOMING / CH-{channel.id} / {channel.tag}
              </div>
              <p className="font-display text-xl leading-relaxed text-fg md:text-2xl">
                {channel.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="relative overflow-hidden border border-line-strong bg-bg-elev"
        >
          {/* faint blueprint grid + a soft accent glow bleeding from the top */}
          <div className="bp-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "var(--accent-glow)", opacity: 0.25 }}
            aria-hidden
          />
          {/* sweeping scanline */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="animate-scan absolute inset-x-0 top-0 h-px bg-accent/50" />
          </div>
          {/* HUD corner brackets */}
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "left-0 bottom-0 border-l-2 border-b-2",
            "right-0 bottom-0 border-r-2 border-b-2",
          ].map((pos) => (
            <span
              key={pos}
              className={`pointer-events-none absolute h-3.5 w-3.5 border-accent ${pos}`}
              aria-hidden
            />
          ))}

          {/* header strip */}
          <div className="relative flex items-center justify-between border-b border-line bg-bg-soft/60 px-4 py-2.5">
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-blip" aria-hidden />
              // PILOT VITALS
            </span>
            <span className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-fg-faint">
              <span className="flex items-end gap-[2px]" aria-hidden>
                <span className="h-1.5 w-[2px] bg-accent" />
                <span className="h-2 w-[2px] bg-accent" />
                <span className="h-2.5 w-[2px] bg-accent" />
                <span className="h-3 w-[2px] bg-accent/40" />
              </span>
              SYS OK
            </span>
          </div>

          {/* telemetry rows */}
          <dl className="relative divide-y divide-line">
            {VITALS.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent/[0.04]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center border border-line-strong bg-bg text-accent transition-colors group-hover:border-line-accent">
                    <Icon size={17} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                      <span className="text-fg-muted/60">{String(i + 1).padStart(2, "0")}</span>
                      {f.label}
                    </dt>
                    <dd className="mt-0.5 truncate font-display text-base font-medium text-fg md:text-lg">
                      {f.value}
                    </dd>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden font-mono text-[9px] tracking-widest text-fg-faint sm:inline">
                      {f.readout}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        f.live
                          ? "bg-[#39d353] shadow-[0_0_8px_#39d353] animate-pulse-accent"
                          : "bg-fg-faint/50"
                      }`}
                      aria-hidden
                    />
                  </div>
                </div>
              );
            })}
          </dl>

          {/* footer readout */}
          <div className="relative flex items-center justify-between border-t border-line bg-bg-soft/60 px-4 py-2 font-mono text-[9px] tracking-widest text-fg-faint">
            <span>LAT 17.38 · LON 78.48</span>
            <span className="text-accent">UPLINK 100%</span>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
