"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { social } from "@/config/social";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-between px-6 pb-12 pt-32 md:px-10 md:pt-40"
    >
      {/* top meta strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center justify-between font-mono text-[11px] tracking-widest text-fg-muted"
      >
        <span>
          <span className="text-accent">●</span> available — building things
        </span>
        <span className="hidden md:inline">{social.location}</span>
      </motion.div>

      {/* centerpiece */}
      <div className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-mono text-xs tracking-[0.3em] text-fg-faint"
        >
          001 — index
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-accent"
        >
          <Logo size={140} interactive />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 font-display text-[14vw] font-bold leading-[0.92] tracking-tight text-fg md:text-[10vw]"
        >
          tribhuvan
          <span className="text-accent">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-6 max-w-2xl font-display text-xl leading-snug text-fg-muted md:text-3xl"
        >
          turning research into{" "}
          <span className="text-fg">fast, useful software</span> at the edge of
          AI/ML and full-stack engineering.
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-6 font-mono text-[12px] tracking-widest text-fg-muted"
        >
          <span>// {social.role.toLowerCase()}</span>
          <span className="h-px w-12 bg-line-accent" />
          <a
            href="#work"
            className="group flex items-center gap-2 text-fg hover:text-accent"
          >
            see selected work
            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      {/* bottom meta strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex items-end justify-between font-mono text-[10px] tracking-widest text-fg-faint"
      >
        <span>scroll</span>
        <div className="hidden gap-6 md:flex">
          <span>v2.0</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </motion.div>
    </section>
  );
}
