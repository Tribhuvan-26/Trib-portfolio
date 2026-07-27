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

// Custom cover pics instead of Spotify album art — reshuffled to a fresh random
// pic on every song change (see the trackId effect below).
const COVERS = [
  "/covers/cover1.jpg",
  "/covers/cover2.webp",
  "/covers/cover3.webp",
  "/covers/cover4.webp",
  "/covers/cover5.webp",
  "/covers/cover6.webp",
  "/covers/cover7.webp",
  "/covers/cover8.webp",
  "/covers/cover9.jpg",
];

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [dead, setDead] = useState(false);
  const [pos, setPos] = useState(0); // live playhead (ms)
  const [coverIdx, setCoverIdx] = useState(0);
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
    const id = setInterval(load, 2_000);
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

  // reshuffle to a fresh random cover whenever the song changes
  useEffect(() => {
    if (!track?.trackId || track.idle) return;
    setCoverIdx((prev) => {
      let n = Math.floor(Math.random() * COVERS.length);
      if (COVERS.length > 1 && n === prev) n = (n + 1) % COVERS.length;
      return n;
    });
  }, [track?.trackId, track?.idle]);

  // Spotify not configured — render nothing so layout stays clean.
  if (dead || track?.error) return null;

  const loading = !track;
  const idle = track?.idle;
  const playing = Boolean(track?.isPlaying);
  const title = loading ? "Syncing…" : idle ? "Nothing playing" : track!.title;
  const artist = loading ? "—" : idle ? "silence" : track!.artist;
  const headerLabel = playing ? "Now playing" : idle ? "Idle" : "Last played";

  const duration = track?.durationMs ?? 0;
  const pct = duration > 0 ? Math.min(100, (pos / duration) * 100) : 0;
  const showProgress = !loading && !idle && duration > 0;

  const hasCover = Boolean(track?.trackId) && !idle;
  const cover = hasCover ? COVERS[coverIdx] : null;

  return (
    <a
      href={loading || idle ? undefined : track!.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="brut brut-hover brut-accent group relative flex min-h-[260px] w-full select-none flex-col overflow-hidden no-underline"
    >
      {/* shuffled pic as the whole card background + scrim for legibility */}
      {cover && (
        <>
          <div className="absolute inset-0 bg-ink" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt="Cover"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="absolute inset-0 bg-ink/45" aria-hidden />
        </>
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <div
          className={`flex items-center justify-between border-b-[2.5px] border-pop-ink bg-pop px-4 py-2.5 font-mono text-[11px] font-black uppercase tracking-widest text-pop-ink`}
        >
          <span className="flex items-center gap-2.5">
            {playing ? (
              <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-ink opacity-40" aria-hidden />
            )}
            {headerLabel}
          </span>
          <span className="border-[1.5px] border-ink bg-paper px-1.5 py-0.5 font-black transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            {loading || idle ? "◌" : "↗"}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <span
              className={`font-display text-2xl font-black leading-tight tracking-tight line-clamp-3 ${
                hasCover ? "text-paper [text-shadow:2px_2px_0_rgba(0,0,0,0.6)]" : "text-ink"
              }`}
              title={title}
            >
              {title}
            </span>
            <span className="max-w-full truncate border-[1.5px] border-ink bg-ink px-2 py-0.5 font-mono text-[11px] font-bold text-paper">
              {artist}
            </span>
          </div>

          {showProgress && (
            <div className="mt-auto flex flex-col gap-2">
              <div
                className={`relative h-3.5 w-full overflow-hidden border-[2.5px] ${
                  hasCover ? "border-paper bg-ink/40" : "border-ink bg-paper"
                }`}
              >
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${pct}%`,
                    transition: "width 0.4s linear",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.18) 5px, rgba(0,0,0,0.18) 10px)",
                  }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] font-bold tabular-nums">
                <span className="border-[1.5px] border-ink bg-paper px-1.5 py-0.5 text-ink">
                  {fmt(pos)}
                </span>
                <span className="border-[1.5px] border-ink bg-paper px-1.5 py-0.5 text-ink">
                  {fmt(duration)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
