"use client";

import { motion } from "framer-motion";
import { social } from "@/config/social";
import { Section } from "./Section";

export function Signals() {
  // ghchart returns a themed contribution SVG for any public GH user.
  const chartSrc = `https://ghchart.rshah.org/1f9bff/${social.githubHandle}`;

  return (
    <Section
      id="signals"
      index="006 — signals"
      title="live"
      kicker="Public activity feed from GitHub. Updates daily."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-6 border-t border-line pt-10"
      >
        <div className="flex items-center justify-between">
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-xs tracking-widest text-fg-muted hover:text-accent"
          >
            <span className="text-accent">@</span>
            {social.githubHandle}
            <span className="ml-2 hidden md:inline">↗ open profile</span>
          </a>
          <span className="font-mono text-[10px] tracking-widest text-fg-faint">
            last 52 weeks
          </span>
        </div>

        <div className="overflow-hidden rounded-none border border-line bg-bg-soft/40 p-4 md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={chartSrc}
            alt={`${social.githubHandle} GitHub contributions`}
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      </motion.div>
    </Section>
  );
}
