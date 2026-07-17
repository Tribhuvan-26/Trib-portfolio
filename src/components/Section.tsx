"use client";

import { motion } from "framer-motion";

interface Props {
  id: string;
  index: string;
  label: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, index, label, title, kicker, children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`relative border-t-[3px] border-ink px-5 py-20 md:px-10 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col gap-5 md:mb-16"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
            <span className="bg-ink px-2 py-1 text-paper">§{index}</span>
            <span>{label}</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-ink md:text-7xl">
              {title}
            </h2>
            {kicker && (
              <p className="max-w-sm font-sans text-sm leading-relaxed text-muted md:text-base">
                {kicker}
              </p>
            )}
          </div>
        </motion.header>

        {children}
      </div>
    </section>
  );
}
