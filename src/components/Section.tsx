"use client";

import { motion } from "framer-motion";

interface Props {
  id: string;
  index: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}

/** Shared section shell — numbered kicker, big title, content. */
export function Section({ id, index, title, kicker, children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`relative border-t border-line px-6 py-24 md:px-10 md:py-32 ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="font-mono text-xs tracking-[0.3em] text-fg-faint">
              {index}
            </div>
            <h2 className="mt-3 font-display text-5xl font-bold leading-none tracking-tight text-fg md:text-7xl">
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
