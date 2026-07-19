"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/config/projects";
import { Section } from "./Section";

function Card({ project, n }: { project: Project; n: number }) {
  return (
    <motion.article
      id={project.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="brut scroll-mt-24 overflow-hidden"
    >
      {/* cover band — generative dot-grid + ghost index; drop a real screenshot
          in later by adding an `image` field and rendering an <img> here */}
      <div
        className="relative flex h-28 items-center justify-between overflow-hidden border-b-[2.5px] border-ink bg-paper-2 px-6 md:h-32 md:px-8"
        style={{
          backgroundImage:
            "radial-gradient(var(--ink) 1.1px, transparent 1.1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "-4px -4px",
        }}
        aria-hidden
      >
        <span className="font-display text-[5.5rem] font-extrabold leading-none tracking-tighter text-ink/[0.08] md:text-[7rem]">
          {String(n).padStart(2, "0")}
        </span>
        <span className="bg-accent px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
          {project.id}
        </span>
      </div>

      <div className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-3xl font-extrabold text-accent md:text-4xl">
            {String(n).padStart(2, "0")}
          </span>
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            {project.title}
          </h3>
        </div>
        <span className="shrink-0 border-[1.5px] border-ink px-2 py-1 font-mono text-[11px] font-bold tracking-widest text-ink">
          {project.year}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
          {project.role}
        </span>
        {project.metric && (
          <span className="mark font-mono text-[11px] font-bold tracking-wide">
            {project.metric}
          </span>
        )}
      </div>

      <p className="mt-5 max-w-3xl font-sans text-base leading-relaxed text-muted md:text-lg">
        {project.summary}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="border-[1.5px] border-ink/70 px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink"
          >
            {s}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="brut brut-hover group inline-flex items-center gap-1.5 bg-pop px-3.5 py-2 font-mono text-[12px] font-bold uppercase tracking-widest text-ink"
            >
              {l.label}
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>
      )}
      </div>
    </motion.article>
  );
}

export function Work() {
  return (
    <Section
      id="work"
      index="01"
      label="Selected Work"
      title="Projects"
      kicker="A few things I've shipped recently — full-stack, machine learning, and AR."
    >
      <div className="flex flex-col gap-8 md:gap-10">
        {projects.map((p, i) => (
          <Card key={p.id} project={p} n={i + 1} />
        ))}
      </div>
    </Section>
  );
}
