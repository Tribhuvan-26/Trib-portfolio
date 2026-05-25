"use client";

import { motion } from "framer-motion";
import { skills } from "@/config/skills";
import { Section } from "./Section";
import { TechIcon, hasIcon } from "./TechIcon";

/**
 * Each skill rendered with a hazard-style power bar.
 * Proficiency is derived heuristically by group position;
 * AI/ML & Frontend top out, Infra a notch lower — easy to swap to real values.
 */
const LEVELS: Record<string, number> = {
  // Languages
  Python: 92, TypeScript: 88, JavaScript: 88, Java: 70, C: 75, "C#": 78,
  // AI/ML
  PyTorch: 88, "Transfer Learning": 85, ResNet: 85, "Grad-CAM": 80,
  "scikit-learn": 82, "Computer Vision": 84,
  // Web
  React: 92, "Next.js": 90, Vite: 85, FastAPI: 88, Supabase: 86, Tailwind: 92,
  // Tools
  Unity: 75, AutoCAD: 78, "Fusion 360": 72, "3D Modelling": 70,
  "IoT Systems": 75, "Augmented Reality": 78,
};

function PowerBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between font-mono text-[11px] tracking-widest">
        <span className="inline-flex items-center gap-2 text-fg group-hover:text-accent">
          {hasIcon(name) && <TechIcon name={name} size={13} className="text-accent" />}
          {name.toUpperCase()}
        </span>
        <span className="text-fg-faint">{level}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden border border-line bg-bg-soft">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 bg-fg group-hover:bg-accent"
        />
        {/* notches */}
        <div className="absolute inset-0 flex">
          {[20, 40, 60, 80].map((p) => (
            <span
              key={p}
              className="block h-full w-px bg-bg/40"
              style={{ marginLeft: `${p}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <Section
      id="stack"
      index="004"
      label="POWER LEVELS"
      title="loadout"
      kicker="Calibrated stack — the systems I keep online. Levels approximate, in active rotation."
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
        {skills.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ delay: gi * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-baseline justify-between border-b-2 border-fg pb-3">
              <h3 className="font-display text-xl font-bold tracking-tight text-fg">
                {group.title.toUpperCase()}
              </h3>
              <span className="font-mono text-[10px] tracking-widest text-fg-faint">
                SYS // {group.items.length.toString().padStart(2, "0")}
              </span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {group.items.map((item) => (
                <li key={item}>
                  <PowerBar name={item} level={LEVELS[item] ?? 70} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
