"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { social } from "@/config/social";
import { Section } from "./Section";

const VITALS = [
  { label: "LOCATION", value: social.location },
  { label: "DISCIPLINE", value: "AI/ML · Full-Stack · IoT" },
  { label: "CURRENT OP", value: "Tech Mentor @ CIE-MLRIT" },
  { label: "DRIFT STATUS", value: "Open to collab" },
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
      "Mentoring 100+ students at CIE-MLRIT across IoT, vibe-coding, CAD, and additive manufacturing — pushed project delivery rate up 2x and shipped a Python application serving 30+ institutional users.",
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
          className="relative border border-line bg-bg-elev p-6"
        >
          <div className="absolute -top-3 left-4 bg-bg-elev px-2 font-mono text-[10px] tracking-widest text-fg-muted">
            // PILOT VITALS
          </div>
          <dl className="grid grid-cols-1 gap-5">
            {VITALS.map((f) => (
              <div key={f.label} className="border-l-2 border-accent pl-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                  {f.label}
                </dt>
                <dd className="mt-1 font-display text-base font-medium text-fg md:text-lg">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </Section>
  );
}
