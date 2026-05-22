"use client";

import { motion } from "framer-motion";
import { skills } from "@/config/skills";
import { Section } from "./Section";

export function Stack() {
  return (
    <Section
      id="stack"
      index="004 — stack"
      title="tooling"
      kicker="Tools I keep reaching for. Not exhaustive — just what I currently ship with."
    >
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ delay: gi * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
                {group.title}
              </h3>
              <span className="font-mono text-[10px] tracking-widest text-fg-faint">
                {group.items.length.toString().padStart(2, "0")}
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="font-display text-base text-fg-muted transition-colors hover:text-accent md:text-lg"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
