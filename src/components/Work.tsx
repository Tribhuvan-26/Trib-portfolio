"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/config/projects";
import { Section } from "./Section";

function Row({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-1 gap-6 border-t border-line py-10 md:grid-cols-[80px_1fr_auto] md:gap-10 md:py-14"
    >
      {/* index + year */}
      <div className="flex flex-row items-baseline gap-4 font-mono text-[11px] tracking-widest text-fg-faint md:flex-col md:gap-2">
        <span className="text-accent">{(index + 1).toString().padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>

      {/* main content */}
      <div className="space-y-4">
        <h3 className="font-display text-3xl font-bold leading-tight tracking-tight text-fg transition-colors group-hover:text-accent md:text-5xl">
          {project.title}
        </h3>
        <p className="max-w-2xl font-display text-base leading-relaxed text-fg-muted md:text-lg">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="border border-line bg-bg-soft/50 px-2.5 py-1 font-mono text-[10px] tracking-wider text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 font-mono text-[11px] tracking-widest">
          <span className="text-fg-faint">
            role <span className="ml-2 text-fg">{project.role}</span>
          </span>
          {project.metric && (
            <span className="text-fg-faint">
              metric <span className="ml-2 text-accent">{project.metric}</span>
            </span>
          )}
        </div>
      </div>

      {/* links column */}
      <div className="flex flex-col items-start gap-2 md:items-end">
        {project.links.length > 0 ? (
          project.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 font-mono text-xs tracking-widest text-fg-muted transition-colors hover:text-accent"
            >
              {l.label}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
          ))
        ) : (
          <span className="font-mono text-xs tracking-widest text-fg-faint">
            in progress
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function Work() {
  return (
    <Section
      id="work"
      index="003 — selected work"
      title="work"
      kicker="A short list of recent things — research, products, and tools."
    >
      <div className="border-b border-line">
        {projects.map((p, i) => (
          <Row key={p.id} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
