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

/**
 * Shatterdome-style section header: numbered chip + uppercase label + big title.
 */
export function Section({ id, index, label, title, kicker, children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`relative border-t border-line px-6 py-24 md:px-10 md:py-32 ${className}`}
    >
      <div className="mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest">
              <span className="bg-fg px-2 py-1 text-bg">{index}</span>
              <span className="text-fg-muted">{label}</span>
            </div>
            <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-fg md:text-7xl">
              {title}
              <span className="text-accent">.</span>
            </h2>
          </div>
          {kicker && (
            <div className="max-w-md font-display text-sm leading-relaxed text-fg-muted md:text-base">
              {kicker}
            </div>
          )}
        </motion.div>

        {children}
      </div>
    </section>
  );
}
