"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { social } from "@/config/social";
import { useTheme } from "@/lib/theme";
import { Section } from "./Section";
import { NowPlaying } from "./NowPlaying";

type Activity = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Payload = { total: number; data: Activity[]; year: number };

const ActivityCalendar = dynamic(
  () => import("react-activity-calendar").then((m) => ({ default: m.ActivityCalendar })),
  {
    ssr: false,
    loading: () => (
      <div className="font-mono text-[11px] tracking-widest text-faint">
        Loading GitHub feed…
      </div>
    ),
  },
);

// cobalt ramp — empty cell is the paper-2 grid tone, then ramps to accent
const CALENDAR_THEME = {
  light: ["#e0dccd", "#b9c0ff", "#8090ff", "#4d5eff", "#2b39ff"],
  dark: ["#201f16", "#2f3a7a", "#4450c9", "#5a68f0", "#6b78ff"],
};

export function Signals() {
  const { theme } = useTheme();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const calWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/contributions")
        .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
        .then((j: Payload) => {
          if (!cancelled) {
            setPayload(j);
            setErr(null);
          }
        })
        .catch((e) => !cancelled && setErr(String(e)));
    load();
    const id = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // scroll the calendar to the newest month once it renders — `ready` (not
  // `payload`) so the 5s poll doesn't yank the scroll back on every refresh
  const ready = payload !== null;
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const el = calWrap.current;
      if (el) el.scrollLeft = el.scrollWidth;
    }, 120);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <Section
      id="signals"
      index="04"
      label="Signals"
      title="Live from the desk"
      kicker="What I've been shipping and what's playing while I do it."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start"
      >
        <div className="brut flex flex-col">
          <div className="flex items-center justify-between border-b-[2.5px] border-ink px-4 py-2.5">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink hover:text-accent"
            >
              @{social.githubHandle} ↗
            </a>
            <span className="font-mono text-[11px] tracking-widest text-faint">
              {payload ? `${payload.year} · YTD` : "Loading"}
            </span>
          </div>
          <div ref={calWrap} className="github-calendar-wrap overflow-x-auto p-5 md:p-8">
            {err && (
              <div className="font-mono text-[11px] tracking-widest text-accent">
                Feed error: {err}
              </div>
            )}
            {!err && payload && (
              <ActivityCalendar
                data={payload.data}
                colorScheme={theme}
                theme={CALENDAR_THEME}
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                labels={{
                  totalCount: `${payload.total} contributions in ${payload.year}`,
                }}
              />
            )}
            {!err && !payload && (
              <div className="font-mono text-[11px] tracking-widest text-faint">
                Loading GitHub feed…
              </div>
            )}
          </div>
        </div>

        <NowPlaying />
      </motion.div>
    </Section>
  );
}
