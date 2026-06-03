"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { social } from "@/config/social";
import { Section } from "./Section";

type Activity = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Payload = { total: number; data: Activity[] };

const ActivityCalendar = dynamic(
  () => import("react-activity-calendar").then((m) => ({ default: m.ActivityCalendar })),
  {
    ssr: false,
    loading: () => (
      <div className="font-mono text-[10px] tracking-widest text-fg-faint">
        // SYNCING GITHUB FEED…
      </div>
    ),
  },
);

const GITHUB_DARK_THEME = {
  light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function Signals() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contributions")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((j: Payload) => {
        if (!cancelled) setPayload(j);
      })
      .catch((e) => !cancelled && setErr(String(e)));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section
      id="signals"
      index="006"
      label="NEURAL FEED"
      title="active contributions"
      kicker="Drift telemetry from GitHub — public + private. Updates hourly."
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

        <div className="relative w-fit max-w-full border border-line bg-bg-elev p-6 md:p-10">
          <span className="absolute -top-3 left-4 bg-bg-elev px-2 font-mono text-[10px] tracking-widest text-fg-muted">
            // DRIFT TELEMETRY
          </span>
          <div className="github-calendar-wrap overflow-x-auto">
            {err && (
              <div className="font-mono text-[10px] tracking-widest text-alert">
                // FEED ERROR: {err}
              </div>
            )}
            {!err && payload && (
              <ActivityCalendar
                data={payload.data}
                colorScheme="dark"
                theme={GITHUB_DARK_THEME}
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                labels={{
                  totalCount: `${payload.total} contributions in the last year`,
                }}
              />
            )}
            {!err && !payload && (
              <div className="font-mono text-[10px] tracking-widest text-fg-faint">
                // SYNCING GITHUB FEED…
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
