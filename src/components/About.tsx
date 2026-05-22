"use client";

import { motion } from "framer-motion";
import { social } from "@/config/social";
import { Section } from "./Section";

const FACTS = [
  { label: "based in", value: social.location },
  { label: "discipline", value: "AI/ML · Full-Stack" },
  { label: "currently", value: "building portfolio v2" },
  { label: "open to", value: "collab · roles" },
];

export function About() {
  return (
    <Section
      id="about"
      index="002 — about"
      title="who"
      kicker="A short note on what I do and how I think about building."
    >
      <div className="grid gap-12 md:grid-cols-[2fr_1fr] md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 font-display text-2xl leading-relaxed text-fg-muted md:text-3xl"
        >
          <p>
            <span className="text-fg">{social.bio}</span>
          </p>
          <p>
            I like work that lives at the seam between research and production:
            classifiers that ship, retrieval pipelines that hold under load,
            interfaces that respect the user&apos;s attention. The good stuff
            usually shows up when those three meet.
          </p>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="flex flex-col gap-6 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0"
        >
          {FACTS.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                {f.label}
              </dt>
              <dd className="mt-1 font-display text-base text-fg md:text-lg">
                {f.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </Section>
  );
}
