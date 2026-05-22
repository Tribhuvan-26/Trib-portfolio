"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/config/projects";
import { Section } from "./Section";

function Entry({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const side = index % 2 === 0 ? "left" : "right";

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-12"
    >
      {/* card */}
      <motion.article
        initial={{ opacity: 0, x: side === "left" ? -32 : 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`group flex flex-col gap-4 ${
          side === "right" ? "md:col-start-3 md:text-left" : "md:text-right"
        }`}
      >
        <div
          className={`flex items-baseline gap-3 font-mono text-[10px] tracking-widest text-fg-faint ${
            side === "right" ? "md:justify-start" : "md:justify-end"
          }`}
        >
          <span className="text-accent">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <span>{project.year}</span>
          <span>· {project.role.toLowerCase()}</span>
        </div>

        <h3 className="font-display text-3xl font-bold leading-tight tracking-tight text-fg transition-colors group-hover:text-accent md:text-5xl">
          {project.title}
        </h3>

        <p className="font-display text-base leading-relaxed text-fg-muted md:text-lg">
          {project.summary}
        </p>

        <div
          className={`flex flex-wrap gap-2 ${
            side === "right" ? "md:justify-start" : "md:justify-end"
          }`}
        >
          {project.stack.map((s) => (
            <span
              key={s}
              className="border border-line bg-bg-soft/40 px-2.5 py-1 font-mono text-[10px] tracking-wider text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>

        <div
          className={`flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 font-mono text-[11px] tracking-widest ${
            side === "right" ? "md:justify-start" : "md:justify-end"
          }`}
        >
          {project.metric && (
            <span className="text-accent">{project.metric}</span>
          )}
          {project.links.length > 0 ? (
            project.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
              >
                {l.label}
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>
            ))
          ) : (
            <span className="text-fg-faint">in progress</span>
          )}
        </div>
      </motion.article>

      {/* center marker */}
      <div className="relative hidden md:flex md:flex-col md:items-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.25, type: "spring", stiffness: 240, damping: 18 }}
          className="z-10 h-3 w-3 rotate-45 border border-accent bg-bg"
          style={{ boxShadow: "0 0 0 4px var(--color-bg), 0 0 12px var(--color-accent)" }}
        />
      </div>

      {/* opposite spacer */}
      <div className="hidden md:block" />
    </div>
  );
}

export function Work() {
  return (
    <Section
      id="work"
      index="002 — selected work"
      title="work"
      kicker="A short timeline of recent things — research, products, and tools."
    >
      <div className="relative">
        {/* central vertical line */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-line-accent to-transparent md:block" />

        <div className="flex flex-col gap-20 md:gap-28">
          {projects.map((p, i) => (
            <Entry key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}
