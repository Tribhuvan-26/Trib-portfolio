"use client";

import { motion } from "framer-motion";
import { Section } from "./Section";

const STATS = [
  ["100+", "Students mentored"],
  ["2×", "Delivery rate lift"],
  ["30+", "Users in prod"],
  ["117+", "Commits, one build"],
];

export function About() {
  return (
    <Section
      id="about"
      index="02"
      label="About"
      title="Who"
      kicker="A short note on what I do and how I work."
    >
      <div className="flex flex-col gap-14">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl font-display text-2xl font-semibold leading-[1.15] tracking-tight text-ink md:text-4xl"
        >
          I like work that lives at the seam between{" "}
          <span className="mark inline-block">research and production</span> —
          ResNet classifiers with Grad-CAM explainability, Next.js + Supabase
          platforms running live, AR pipelines in Unity.
        </motion.p>

        <div className="grid gap-10 border-t-[1.5px] border-paper-2 pt-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
              The work
            </h3>
            <p className="font-sans text-base leading-relaxed text-muted md:text-lg">
              CSE student at MLR Institute of Technology, building
              research-flavored systems where AI/ML meets full-stack engineering.
              The good stuff usually shows up when the model, the interface, and
              the deployment all have to agree.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
              The day job
            </h3>
            <p className="font-sans text-base leading-relaxed text-muted md:text-lg">
              Leading and mentoring 100+ students at CIE-MLRIT across IoT,
              vibe-coding, CAD, and additive manufacturing — pushing project
              delivery rate up 2×, and shipping a Python application now serving
              30+ institutional users.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {STATS.map(([n, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i, duration: 0.5 }}
              className="brut flex flex-col gap-1 p-5"
            >
              <span className="font-display text-4xl font-extrabold leading-none tracking-tight text-ink md:text-5xl">
                {n}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
