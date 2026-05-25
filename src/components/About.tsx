"use client";

import { motion } from "framer-motion";
import { social } from "@/config/social";
import { Section } from "./Section";

const VITALS = [
  { label: "LOCATION", value: social.location },
  { label: "DISCIPLINE", value: "AI/ML · Full-Stack · IoT" },
  { label: "INSTITUTION", value: "B.Tech CSE @ MLRIT" },
  { label: "CURRENT OP", value: "Tech Mentor @ CIE-MLRIT" },
  { label: "DRIFT STATUS", value: "Open to collab" },
];

export function About() {
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
          className="space-y-6 font-display text-xl leading-relaxed text-fg-muted md:text-2xl"
        >
          <p>
            <span className="text-fg">{social.bio}</span>
          </p>
          <p>
            I like work that lives at the seam between research and production:
            ResNet classifiers with Grad-CAM explainability, Next.js + Supabase
            platforms running in prod, AR pipelines in Unity. The good stuff
            usually shows up when those three meet.
          </p>
          <p>
            Day job: mentoring 30+ students at CIE-MLRIT across IoT, vibe-coding,
            CAD, and additive manufacturing — pushed project delivery rate up
            40% and shipped a Python application serving 30+ institutional
            users.
          </p>
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
