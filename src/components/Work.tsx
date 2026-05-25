"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/config/projects";
import { Section } from "./Section";

const STATUS_FROM_ROLE: Record<string, { tag: string; tone: "active" | "deployed" | "classified" }> = {
  "Team Lead": { tag: "ACTIVE", tone: "active" },
  Solo: { tag: "DEPLOYED", tone: "deployed" },
  Architect: { tag: "CLASSIFIED", tone: "classified" },
};

function StatusBadge({ status }: { status: Project["role"] }) {
  const meta = STATUS_FROM_ROLE[status] ?? { tag: "ACTIVE", tone: "active" as const };
  const cls =
    meta.tone === "active"
      ? "border-accent text-fg bg-accent"
      : meta.tone === "deployed"
        ? "border-fg bg-fg text-bg"
        : "border-alert text-alert bg-bg-elev";
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] tracking-widest ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-blip" />
      {meta.tag}
    </span>
  );
}

function Unit({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const idx = (index + 1).toString().padStart(2, "0");

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-1 gap-6 border border-line bg-bg-elev p-6 transition-colors hover:border-fg md:grid-cols-[88px_1fr_auto] md:gap-10 md:p-8"
    >
      {/* index slab */}
      <div className="flex flex-col gap-2">
        <span className="bg-fg px-2 py-1 text-center font-mono text-xs tracking-widest text-bg">
          UNIT-{idx}
        </span>
        <span className="text-center font-mono text-[10px] tracking-widest text-fg-faint">
          {project.year}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.role} />
          <span className="font-mono text-[10px] tracking-widest text-fg-muted">
            ROLE / {project.role.toUpperCase()}
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-fg md:text-4xl">
          {project.title}
        </h3>
        <p className="max-w-2xl font-display text-base leading-relaxed text-fg-muted md:text-lg">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {project.stack.map((s) => (
            <span
              key={s}
              className="border border-line bg-bg px-2.5 py-1 font-mono text-[10px] tracking-wider text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* right rail */}
      <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
        {project.metric && (
          <div className="border-l-2 border-accent pl-3 md:border-l-0 md:border-r-2 md:pl-0 md:pr-3">
            <div className="font-mono text-[10px] tracking-widest text-fg-faint">
              METRIC
            </div>
            <div className="font-display text-xl font-bold text-fg">
              {project.metric}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1.5 font-mono text-[11px] tracking-widest md:items-end">
          {project.links.length > 0 ? (
            project.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
              >
                {l.label.toUpperCase()}
                <ArrowUpRight size={13} />
              </a>
            ))
          ) : (
            <span className="text-fg-faint">// IN DEV</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Work() {
  return (
    <Section
      id="work"
      index="002"
      label="DEPLOYED UNITS"
      title="work"
      kicker="Active jaegers, archived units, and projects still in the bay. Each one a fight worth logging."
    >
      <div className="flex flex-col gap-6 md:gap-8">
        {projects.map((p, i) => (
          <Unit key={p.id} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
