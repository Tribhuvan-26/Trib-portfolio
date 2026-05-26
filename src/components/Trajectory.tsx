"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { trajectory, type KaijuEntry } from "@/config/trajectory";
import { Section } from "./Section";

function ThreatBar({ category }: { category: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Cat-${category}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-5 ${
            i <= category
              ? category >= 4
                ? "bg-alert"
                : category >= 3
                  ? "bg-accent"
                  : "bg-fg"
              : "bg-line-strong"
          }`}
        />
      ))}
      <span className="ml-1 font-mono text-[10px] tracking-widest text-fg-muted">
        CAT-{["I", "II", "III", "IV", "V"][category - 1]}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: KaijuEntry["status"] }) {
  const cls =
    status === "DEFEATED"
      ? "border-fg-muted text-fg-muted"
      : status === "IN PURSUIT"
        ? "border-accent text-accent"
        : "border-fg-faint text-fg-faint";
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] tracking-widest ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-blip" />
      {status}
    </span>
  );
}

function KaijuRow({ entry, index, total }: { entry: KaijuEntry; index: number; total: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const idx = (index + 1).toString().padStart(2, "0");

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-[28px_1fr] gap-4 border-t border-line py-8 md:grid-cols-[60px_140px_1fr_auto] md:gap-10 md:py-10"
    >
      {/* index */}
      <div className="font-mono text-[11px] tracking-widest text-fg-faint">
        K-{idx}
      </div>

      {/* date + category (left col on desktop) */}
      <div className="col-start-2 flex flex-col gap-2 md:col-start-2">
        <span className="font-mono text-[12px] font-medium tracking-widest text-fg">
          {entry.date}
        </span>
        <ThreatBar category={entry.category} />
        <StatusPill status={entry.status} />
      </div>

      {/* body */}
      <div className="col-start-2 md:col-start-3">
        <div className="flex items-baseline gap-3">
          <h4 className="font-display text-2xl font-bold tracking-tight text-fg md:text-3xl">
            {entry.codename}
          </h4>
          <span className="font-mono text-[10px] tracking-widest text-fg-muted">
            ◢ KAIJU
          </span>
        </div>
        <div className="mt-1 font-mono text-[11px] tracking-widest text-accent">
          {entry.location.toUpperCase()}
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-widest text-fg-muted">
          JAEGER DEPLOYED / <span className="text-fg">{entry.jaeger.toUpperCase()}</span>
        </div>
        <p className="mt-3 max-w-2xl font-display text-sm leading-relaxed text-fg-muted md:text-base">
          {entry.summary}
        </p>
      </div>

      {/* end-cap */}
      <div className="hidden md:flex md:flex-col md:items-end md:gap-2 md:text-right">
        <span className="font-mono text-[10px] tracking-widest text-fg-faint">
          BATTLE
        </span>
        <span className="font-display text-2xl font-bold text-fg">
          {idx}/{total.toString().padStart(2, "0")}
        </span>
      </div>
    </motion.li>
  );
}

export function Trajectory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section
      id="work"
      index="002"
      label="KAIJU LOG"
      title="kaijus defeated"
      kicker="Battle log — each defeated kaiju a project that shipped. Categories scale with the breach size."
    >
      <div ref={containerRef} className="relative">
        {/* progress rail on the far left */}
        <div
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-line md:block"
          aria-hidden
        >
          <motion.span
            className="absolute left-0 top-0 block w-px bg-accent"
            style={{ height: lineHeight }}
          />
        </div>

        <ol className="md:pl-10">
          {trajectory.map((entry, i) => (
            <KaijuRow
              key={entry.codename}
              entry={entry}
              index={i}
              total={trajectory.length}
            />
          ))}
          <li className="border-t border-line py-6 text-center font-mono text-[10px] tracking-widest text-fg-faint md:py-8">
            ▰ END OF LOG ▰
          </li>
        </ol>
      </div>
    </Section>
  );
}
