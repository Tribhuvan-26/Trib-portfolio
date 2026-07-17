"use client";

import { motion } from "framer-motion";
import { TechIcon, hasIcon } from "./TechIcon";
import { Section } from "./Section";

const LAYERS: { label: string; nodes: string[] }[] = [
  { label: "Languages", nodes: ["Python", "TypeScript", "JavaScript", "Dart", "Java"] },
  { label: "AI / ML", nodes: ["TensorFlow", "PyTorch", "scikit-learn", "OpenCV", "NumPy", "Pandas"] },
  { label: "Frontend / Mobile", nodes: ["React", "Next.js", "React Native", "Flutter", "Three.js"] },
  { label: "Backend / Data", nodes: ["FastAPI", "Node.js", "Express", "Firebase", "Supabase", "MongoDB"] },
  { label: "Tools / Creative", nodes: ["Vercel", "Figma", "Blender", "Unity", "Arduino"] },
];

function Chip({ label }: { label: string }) {
  const icon = hasIcon(label);
  return (
    <span className="flex items-center gap-2 border-[1.5px] border-ink bg-paper px-2.5 py-1.5 font-mono text-[12px] tracking-wide text-ink transition-colors hover:bg-pop">
      {icon && <TechIcon name={label} size={15} className="text-ink" />}
      {label}
    </span>
  );
}

export function Stack() {
  return (
    <Section
      id="stack"
      index="03"
      label="Stack"
      title="Tools of the trade"
      kicker="What I reach for, grouped by where it lives in the build."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: 0.05 * i, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="brut p-5"
          >
            <h3 className="mb-4 flex items-center gap-2 border-b-[1.5px] border-paper-2 pb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
              <span className="bg-accent px-1.5 py-0.5 font-bold text-paper">
                {String(i + 1).padStart(2, "0")}
              </span>
              {layer.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {layer.nodes.map((n) => (
                <Chip key={n} label={n} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
