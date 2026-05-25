"use client";

import { motion } from "framer-motion";
import { trajectory } from "@/config/trajectory";
import { Section } from "./Section";

const THREAT_FROM_INDEX = ["CAT-IV", "CAT-III", "CAT-III", "CAT-II"];

export function Trajectory() {
  return (
    <Section
      id="trajectory"
      index="005"
      label="KAIJU LOG"
      title="defeated"
      kicker="Battle log — most recent operations first. Each entry: threat level, payload, lessons learned."
    >
      <ol className="border-t-2 border-fg">
        {trajectory.map((t, i) => {
          const threat = THREAT_FROM_INDEX[i] ?? "CAT-I";
          return (
            <motion.li
              key={t.title + t.date}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[64px_1fr] gap-4 border-b border-line py-6 md:grid-cols-[140px_120px_1fr] md:gap-12 md:py-8"
            >
              <span className="font-mono text-[11px] font-medium tracking-widest text-fg">
                {t.date}
              </span>
              <span className="hidden font-mono text-[10px] tracking-widest text-alert md:block">
                ◢ {threat}
              </span>
              <div>
                <h4 className="font-display text-xl font-bold tracking-tight text-fg md:text-2xl">
                  {t.title}
                </h4>
                {t.org && (
                  <div className="mt-1 font-mono text-[11px] tracking-widest text-accent-strong">
                    {t.org}
                  </div>
                )}
                <p className="mt-2 max-w-2xl font-display text-sm leading-relaxed text-fg-muted md:text-base">
                  {t.summary}
                </p>
                {/* threat on mobile */}
                <div className="mt-2 font-mono text-[10px] tracking-widest text-alert md:hidden">
                  ◢ {threat}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
