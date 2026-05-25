"use client";

import { motion } from "framer-motion";
import { social } from "@/config/social";
import { Section } from "./Section";

export function Signals() {
  // ghchart — classic GitHub green palette (reads well on dark bg).
  const chartSrc = `https://ghchart.rshah.org/26a641/${social.githubHandle}`;

  return (
    <Section
      id="signals"
      index="006"
      label="NEURAL FEED"
      title="live"
      kicker="Drift telemetry from the public GitHub. Updates daily."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-xs tracking-widest text-fg-muted hover:text-fg"
          >
            <span className="bg-accent px-1.5 py-0.5 text-fg">@</span>
            {social.githubHandle}
            <span className="ml-2 hidden md:inline">↗ OPEN PROFILE</span>
          </a>
          <span className="font-mono text-[10px] tracking-widest text-fg-faint">
            LAST 52 WEEKS
          </span>
        </div>

        <div className="relative border border-line bg-bg-elev p-4 md:p-8">
          <span className="absolute -top-3 left-4 bg-bg-elev px-2 font-mono text-[10px] tracking-widest text-fg-muted">
            // DRIFT TELEMETRY
          </span>
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
