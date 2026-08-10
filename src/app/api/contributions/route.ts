import { social } from "@/config/social";

export const runtime = 'nodejs';
// Always hit GitHub live (no Next data-cache); the CDN edge caches the response
// for 10s via Cache-Control below. GitHub's own graph lags a few min anyway.
export const dynamic = "force-dynamic";

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: "missing_token" }, { status: 500 });
  }

  // "Today" in the account's local zone (+05:30), not UTC: GitHub buckets
  // contributions by that zone, so a UTC `today` drops commits made past local
  // midnight. Query the whole calendar year, then trim the future off below.
  const today = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
  const year = Number(today.slice(0, 4));
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { login: social.githubHandle, from, to },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json(
      { error: "github_api_error", status: res.status },
      { status: 502 },
    );
  }

  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) {
    return Response.json({ error: "shape", body: json }, { status: 502 });
  }

  // GitHub returns the full requested range, including future days as zeroes.
  // Keep them and the graph renders ~5 months of empty cells past today.
  const data = cal.weeks
    .flatMap(
      (w: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVEL_MAP[d.contributionLevel] ?? 0,
        })),
    )
    .filter((d: { date: string }) => d.date <= today);

  return Response.json(
    { total: cal.totalContributions, data, year },
    {
      headers: {
        // Client polls every 5s; cap origin hits to match. No
        // stale-while-revalidate — it would hand out data up to 30s old.
        "Cache-Control": "public, s-maxage=5",
      },
    },
  );
}
