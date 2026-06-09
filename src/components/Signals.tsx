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

// react-activity-calendar picks the `light` or `dark` array via colorScheme.
// Light mode = GitHub's light palette (pale-grey empty cell) so squares don't
// sit as harsh black blocks on the white card. Dark mode keeps the dark palette.
const CALENDAR_THEME = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  // empty cell is a neutral grey (not near-black) and level-1 is a clearly
  // brighter green, so "no contribution" vs "a little" is readable without
  // zooming. Ramps up from there.
  dark: ["#2a2f37", "#1c7a3e", "#2ea043", "#39d353", "#57e070"],
};

function useDocTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const read = () =>
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") || "dark";
    setTheme(read());
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export function Signals() {
  const theme = useDocTheme();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [quote] = useState(() => {
    const quotes = [
      { text: "Code is poetry written in logic.", author: "Unknown" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
      { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
      { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
      { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

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
      title="github contributions"
      kicker="Drift telemetry from GitHub."
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
                colorScheme={theme}
                theme={CALENDAR_THEME}
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
