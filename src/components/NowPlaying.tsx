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

  return (
    <a
      href={loading || idle ? undefined : track!.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="brut brut-hover group flex w-full select-none flex-col no-underline"
    >
      <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-pop px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
        <span className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full bg-ink ${playing ? "animate-pulse-dot" : "opacity-40"}`}
            aria-hidden
          />
          {headerLabel}
        </span>
        <span className="transition-transform group-hover:translate-x-0.5">
          {loading || idle ? "◌" : "↗"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          {track?.albumImageUrl && !idle ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.albumImageUrl}
              alt={track.album}
              width={80}
              height={80}
              className="block h-20 w-20 shrink-0 border-[2.5px] border-ink object-cover"
            />
          ) : (
            <div
              className="grid h-20 w-20 shrink-0 place-items-center border-[2.5px] border-ink bg-paper-2 text-3xl text-faint"
              aria-hidden
            >
              ♫
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              className="font-display text-xl font-extrabold leading-tight tracking-tight text-ink line-clamp-2"
              title={title}
            >
              {title}
            </span>
            <span className="w-fit max-w-full truncate bg-ink px-1.5 py-0.5 font-mono text-[11px] font-medium text-paper">
              {artist}
            </span>
          </div>
        </div>

        {showProgress && (
          <div className="mt-auto flex flex-col gap-1.5">
            <div className="relative h-2.5 w-full overflow-hidden border-[1.5px] border-ink bg-paper">
              <div
                className="h-full bg-accent"
                style={{ width: `${pct}%`, transition: "width 0.4s linear" }}
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] font-medium tabular-nums text-muted">
              <span>{fmt(pos)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
