"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { social } from "@/config/social";
import { Section } from "./Section";

// client-only — calendar fetches from GitHub via useEffect, no SSR needed.
// Resolve `.default` explicitly so dynamic gets a component, not the module.
const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="font-mono text-[10px] tracking-widest text-fg-faint">
        // SYNCING GITHUB FEED…
      </div>
    ),
  },
);

// Match the look of github.com's contribution graph (dark mode greens).
const GITHUB_DARK_THEME = {
  light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function Signals() {
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
            <span className="bg-accent px-1.5 py-0.5 text-bg">@</span>
            {social.githubHandle}
            <span className="ml-2 hidden md:inline">↗ OPEN PROFILE</span>
          </a>
          <span className="font-mono text-[10px] tracking-widest text-fg-faint">
            LAST 12 MONTHS
          </span>
        </div>

        <div className="relative border border-line bg-bg-elev p-6 md:p-10">
          <span className="absolute -top-3 left-4 bg-bg-elev px-2 font-mono text-[10px] tracking-widest text-fg-muted">
            // DRIFT TELEMETRY
          </span>
          <div className="github-calendar-wrap overflow-x-auto">
            <GitHubCalendar
              username={social.githubHandle}
              colorScheme="dark"
              theme={GITHUB_DARK_THEME}
              fontSize={12}
              blockSize={12}
              blockMargin={4}
              labels={{
                totalCount: "{{count}} contributions in the last year",
              }}
            />
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
