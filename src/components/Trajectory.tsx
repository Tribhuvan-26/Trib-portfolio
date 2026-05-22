"use client";

import { motion } from "framer-motion";
import { trajectory } from "@/config/trajectory";
import { Section } from "./Section";

export function Trajectory() {
  return (
    <Section
      id="trajectory"
      index="005 — trajectory"
      title="path"
      kicker="A compact log of work — most recent first."
    >
      <ol className="border-b border-line">
        {trajectory.map((t, i) => (
          <motion.li
            key={t.title + t.date}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-[80px_1fr] gap-6 border-t border-line py-6 md:grid-cols-[160px_1fr] md:gap-12 md:py-8"
          >
            <span className="font-mono text-[11px] tracking-widest text-fg-faint">
              {t.date}
            </span>
            <div>
              <h4 className="font-display text-xl font-semibold tracking-tight text-fg md:text-2xl">
                {t.title}
              </h4>
              {t.org && (
                <div className="mt-1 font-mono text-[11px] tracking-widest text-accent">
                  {t.org}
                </div>
              )}
              <p className="mt-2 max-w-2xl font-display text-sm leading-relaxed text-fg-muted md:text-base">
                {t.summary}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
