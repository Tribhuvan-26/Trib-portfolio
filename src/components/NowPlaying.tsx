"use client";

import { useEffect, useRef, useState } from "react";

type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | null;
  songUrl: string;
  trackId: string;
  durationMs: number;
  progressMs: number;
  idle?: boolean;
  error?: string;
};

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};


// Committed neo-brutalist palette (fixed, not theme-tokened) so the card reads
// as one bold sticker-object in both light and dark.
const INK = "#14181f";
const PAPER = "#faf7ef";
const YELLOW = "#ffb800";
const CORAL = "#ff5c39";

// 4-point sparkle used as a decorative sticker.
const STAR = "polygon(50% 0%, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0% 50%, 42% 42%)";

// halftone dot-grid behind the body
const DOTS = {
  backgroundImage: "radial-gradient(rgba(20,24,31,0.16) 1.5px, transparent 1.6px)",
  backgroundSize: "13px 13px",
};

// deterministic bar heights (%) for the waveform — no Math.random, so SSR and
// client hydrate identically.
const WAVE = [
  38, 62, 45, 88, 54, 30, 72, 96, 60, 42, 78, 50, 34, 66, 90, 48, 58, 82, 40,
  70, 52, 94, 46, 64, 36, 76, 56, 86, 44, 68, 32, 80,
];

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [dead, setDead] = useState(false);
  const [pos, setPos] = useState(0); // live playhead (ms)
  const hadTrack = useRef(false); // have we ever gotten a real track?

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/spotify")
        .then((r) => r.json())
        .then((j: Track) => {
          if (cancelled) return;
          if (j?.error) {
            // Only hide the card if Spotify was NEVER configured (no creds at
            // first load). Once we've shown a track, a transient error/token
            // blip must NOT remove the card — keep the last known state.
            if (!hadTrack.current) setDead(true);
            return;
          }
          hadTrack.current = true;
          setTrack(j);
        })
        // transient network error → ignore, keep showing last track, retry next poll
        .catch(() => {});

    load();
    // tight poll so a track change shows almost immediately (Spotify has no
    // push API, so short polling is the fastest option). Cache is no-store and
    // the access token is cached server-side, so 2s is cheap and safe.
    const id = setInterval(load, 2_000);
    // refetch the instant the tab regains focus — feels immediate on return
    const onFocus = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Advance the playhead locally between polls off the real progress_ms, then
  // each poll resyncs it — so the bar tracks the actual song position.
  useEffect(() => {
    if (!track) return;
    const base = track.progressMs;
    if (!track.isPlaying) {
      setPos(base);
      return;
    }
    const start = Date.now();
    setPos(base);
    const id = setInterval(
      () => setPos(Math.min(track.durationMs, base + (Date.now() - start))),
      500,
    );
    return () => clearInterval(id);
  }, [track]);

  // Spotify not configured — render nothing so layout stays clean.
  if (dead || track?.error) return null;

  const loading = !track;
  const idle = track?.idle;
  const playing = Boolean(track?.isPlaying);
  const title = loading ? "SYNCING…" : idle ? "NOTHING SPINNING" : track!.title;
  const artist = loading ? "audio uplink" : idle ? "silence" : track!.artist;
  const badge = playing ? "LIVE" : idle ? "IDLE" : "RECENT";
  const badgeColor = playing ? CORAL : idle ? "#9aa0aa" : YELLOW;
  const headerLabel = playing ? "NOW PLAYING" : idle ? "SIGNAL IDLE" : "LAST PLAYED";

  const duration = track?.durationMs ?? 0;
  const pct = duration > 0 ? Math.min(100, (pos / duration) * 100) : 0;
  const showProgress = !loading && !idle && duration > 0;

  // marquee ticker text
  const ticker = loading
    ? "SYNCING"
    : idle
      ? "STANDBY — QUEUE EMPTY"
      : `${track!.title} — ${track!.artist}`;
  const tickerLine = `${ticker}  ✦  `.repeat(4);

  return (
    <a
      href={loading || idle ? undefined : track!.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full select-none flex-col overflow-hidden no-underline md:min-h-[420px]"
      style={{
        color: INK,
        background: PAPER,
        border: `3px solid ${INK}`,
        boxShadow: `7px 7px 0 0 ${INK}`,
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(3px, 3px)";
        e.currentTarget.style.boxShadow = `2px 2px 0 0 ${INK}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0, 0)";
        e.currentTarget.style.boxShadow = `7px 7px 0 0 ${INK}`;
      }}
    >
      {/* HEADER — yellow bar, chunky title + rotated status sticker */}
      <div
        className="relative flex items-center justify-between px-4 py-3"
        style={{ background: YELLOW, borderBottom: `3px solid ${INK}` }}
      >
        <span className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest">
          <span
            className={`inline-block h-3 w-3 ${playing ? "animate-spin-slow" : ""}`}
            style={{ background: INK, clipPath: STAR }}
            aria-hidden
          />
          {headerLabel}
        </span>
        <span
          className="-rotate-3 px-2 py-0.5 font-mono text-[10px] font-black tracking-widest"
          style={{ background: badgeColor, border: `2px solid ${INK}`, color: INK }}
        >
          {badge}
        </span>
      </div>

      {/* hazard-stripe divider */}
      <div className="hazard-stripe-thin h-2" style={{ borderBottom: `3px solid ${INK}` }} aria-hidden />

      {/* BODY — dotted field, album art w/ sparkle sticker, title, artist */}
      <div className="relative flex flex-1 flex-col gap-4 overflow-hidden p-4" style={DOTS}>
        {/* faint blurred album cover filling the dead space with warmth */}
        {track?.albumImageUrl && !idle && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumImageUrl}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 object-cover opacity-15 blur-md"
          />
        )}

        {/* decorative barcode, top-right */}
        <span className="absolute right-3 top-3 z-10 flex items-end gap-[2px]" aria-hidden>
          {[3, 6, 2, 5, 3, 7, 2, 4].map((h, i) => (
            <span key={i} style={{ height: h * 3, width: 2, background: INK, opacity: 0.7 }} />
          ))}
        </span>

        <div className="relative flex items-start gap-4">
        <div className="relative shrink-0" style={{ boxShadow: `4px 4px 0 0 ${INK}` }}>
          {track?.albumImageUrl && !idle ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.albumImageUrl}
              alt={track.album}
              width={104}
              height={104}
              className="block h-[104px] w-[104px] object-cover"
              style={{ border: `3px solid ${INK}` }}
            />
          ) : (
            <div
              className="grid h-[104px] w-[104px] place-items-center text-3xl"
              style={{ border: `3px solid ${INK}`, background: "#fff" }}
              aria-hidden
            >
              ♫
            </div>
          )}
          {/* sparkle sticker punched onto the art corner */}
          <span
            className={`absolute -right-3 -top-3 h-7 w-7 ${playing ? "animate-spin-slow" : ""}`}
            style={{ background: CORAL, clipPath: STAR }}
            aria-hidden
          />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col gap-2 py-0.5 pr-8">
          <span
            className="font-display text-2xl font-black uppercase leading-[0.95] tracking-tight line-clamp-3"
            title={title}
          >
            {title}
          </span>
          <span
            className="inline-block w-fit max-w-full truncate px-1.5 py-0.5 font-mono text-[11px] font-bold"
            style={{ background: INK, color: PAPER }}
          >
            {artist}
          </span>

          {/* real playback progress, synced to the live playhead */}
          {showProgress && (
            <div className="mt-1 flex flex-col gap-1">
              <div className="relative h-2.5 w-full overflow-hidden" style={{ border: `2px solid ${INK}`, background: "#fff" }}>
                <div className="h-full" style={{ width: `${pct}%`, background: CORAL, transition: "width 0.4s linear" }} />
              </div>
              <div className="flex justify-between font-mono text-[9px] font-bold tabular-nums" style={{ color: INK }}>
                <span>{fmt(pos)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* WAVEFORM panel — fills the leftover space with an animated bar field */}
        <div
          className="relative mt-auto flex flex-1 flex-col"
          style={{ background: "rgba(255,255,255,0.55)", border: `3px solid ${INK}`, minHeight: 96 }}
        >
          <span className="flex items-center justify-between px-2 py-1 font-mono text-[9px] font-bold tracking-widest" style={{ borderBottom: `2px solid ${INK}`, color: INK }}>
            <span>WAVEFORM // OUT</span>
            <span>{playing ? "▶ STEREO" : idle ? "— —" : "❚❚ PAUSED"}</span>
          </span>
          {/* soundcloud-style scrubber: mirrored bars, the "played" portion fills
              with the REAL progress %, a yellow marker rides the playhead */}
          <div className="flex flex-1 items-center gap-[2px] px-2 py-2">
            {WAVE.map((h, i) => {
              const barPct = ((i + 0.5) / WAVE.length) * 100;
              const played = showProgress && barPct <= pct;
              const atHead = showProgress && Math.abs(barPct - pct) < (100 / WAVE.length) / 1.4;
              return (
                <span
                  key={i}
                  className={atHead && playing ? "animate-pulse-accent" : ""}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: atHead ? YELLOW : played ? CORAL : INK,
                    opacity: atHead || played ? 1 : 0.28,
                  }}
                  aria-hidden
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* MARQUEE TICKER strip */}
      <div
        className="relative overflow-hidden py-1.5"
        style={{ background: CORAL, borderTop: `3px solid ${INK}`, borderBottom: `3px solid ${INK}` }}
      >
        <div className="animate-marquee flex whitespace-nowrap font-mono text-[10px] font-black tracking-widest" style={{ color: INK }}>
          <span className="pr-6">{tickerLine}</span>
          <span className="pr-6" aria-hidden>{tickerLine}</span>
        </div>
      </div>

      {/* FOOTER — ink bar CTA */}
      <div
        className="flex items-center justify-between px-4 py-3 font-mono text-[11px] font-black tracking-widest"
        style={{ background: INK, color: YELLOW }}
      >
        <span>{loading ? "◇ CONNECTING" : idle ? "◇ STANDBY" : "▶ OPEN ON SPOTIFY"}</span>
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>
          {loading || idle ? "◌" : "↗"}
        </span>
      </div>
    </a>
  );
}
