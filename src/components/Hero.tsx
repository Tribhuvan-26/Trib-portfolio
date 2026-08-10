"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileDown } from "lucide-react";
import { social } from "@/config/social";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const FACTS = [
  ["Now", "Technical Lead & Mentor @ CIE-MLRIT"],
  ["Focus", "AI/ML · Full-stack · IoT"],
  ["Based", social.location],
  ["Status", "Open to collaborate"],
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center px-5 pb-16 pt-24 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-end">
        <div>
          <motion.div
            custom={0}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted"
          >
            <span className="bg-ink px-2 py-1 text-paper">Portfolio</span>
            <span>2026 — Hyderabad, IN</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-6 font-display text-[15vw] font-extrabold leading-[0.86] tracking-tight text-ink sm:text-[12vw] lg:text-[7.5vw]"
          >
            I build software
            <br />
            that holds up in{" "}
            <span className="mark inline-block -rotate-1">the real world</span>.
          </motion.h1>

          <motion.p
            custom={2}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-muted md:text-xl"
          >
            I&apos;m <span className="font-semibold text-ink">Tribhuvan</span> — an
            AI/ML engineer and full-stack developer, technical lead and mentor to
            200+ students at CIE-MLRIT. I ship research-flavored products that
            survive contact
            with production.
          </motion.p>

          <motion.div
            custom={3}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="brut brut-hover brut-accent group inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-paper"
            >
              View work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/resume.pdf"
              download="Tribhuvan-Resume.pdf"
              className="brut brut-hover group inline-flex items-center gap-2 px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-ink"
            >
              <FileDown size={16} className="transition-transform group-hover:translate-y-0.5" />
              Résumé
            </a>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="brut brut-hover inline-flex items-center gap-2 px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-ink"
            >
              GitHub ↗
            </a>
          </motion.div>
        </div>

        {/* index card — brutalist spec sheet */}
        <motion.div
          custom={4}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="brut"
        >
          <div className="flex items-center justify-between border-b-[2.5px] border-pop-ink bg-pop px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-pop-ink">
            <span>Index card</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-pop-ink" aria-hidden />
              2026
            </span>
          </div>
          <dl className="divide-y-[1.5px] divide-paper-2">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 px-4 py-3.5">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-faint">{k}</dt>
                <dd className="font-sans text-[15px] font-medium leading-snug text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
