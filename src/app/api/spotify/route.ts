export const runtime = "nodejs";
// Now-playing is live data — never prerender, and only cache it for a few
// seconds so the widget tracks the actual track without spamming Spotify.
export const dynamic = "force-dynamic";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
// Full player state — returns the loaded track even when PAUSED (needs the
// user-read-playback-state scope), so pausing keeps the current song visible.
const PLAYER_URL = "https://api.spotify.com/v1/me/player";
const RECENT_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

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
};

// Access tokens live ~1h. Cache one in memory (module scope, survives warm
// invocations) and reuse it until just before expiry — so tight polling only
// hits the now-playing endpoint, not the token endpoint every time.
let cachedToken: { value: string; exp: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.exp) return cachedToken.value;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.access_token) return null;

  // refresh 60s before the real expiry to avoid edge-of-expiry 401s
  const ttl = ((json.expires_in as number) ?? 3600) - 60;
  cachedToken = { value: json.access_token, exp: Date.now() + ttl * 1000 };
  return json.access_token;
}

function mapTrack(
  item: Record<string, unknown>,
  isPlaying: boolean,
  progressMs = 0,
): Track {
  const artists = (item.artists as Array<{ name: string }>) ?? [];
  const album = item.album as {
    name?: string;
    images?: Array<{ url: string }>;
  };
  const external = item.external_urls as { spotify?: string } | undefined;
  return {
    isPlaying,
    title: (item.name as string) ?? "Unknown",
    artist: artists.map((a) => a.name).join(", "),
    album: album?.name ?? "",
    albumImageUrl: album?.images?.[0]?.url ?? null,
    songUrl: external?.spotify ?? "https://open.spotify.com",
    trackId: (item.id as string) ?? "",
    durationMs: (item.duration_ms as number) ?? 0,
    progressMs,
  };
}

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return Response.json({ error: "not_configured" }, { status: 200 });
  }

  const auth = { Authorization: `Bearer ${token}` };

  // 1. What's on the player right now? This covers BOTH playing and paused, so
  //    pausing keeps the current track instead of jumping to an older one.
  const player = await fetch(PLAYER_URL, { headers: auth, cache: "no-store" });
  if (player.status === 200) {
    const json = await player.json();
    if (json?.item) {
      return Response.json(
        { ...mapTrack(json.item, Boolean(json.is_playing), json.progress_ms ?? 0) },
        // never cache — every poll must reflect the actual current track
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  // 2. Player fully closed (no active device) — fall back to the last track.
  const recent = await fetch(RECENT_URL, { headers: auth, cache: "no-store" });
  if (recent.ok) {
    const json = await recent.json();
    const item = json?.items?.[0]?.track;
    if (item) {
      return Response.json(
        { ...mapTrack(item, false) },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  return Response.json({ isPlaying: false, idle: true }, { status: 200 });
}
