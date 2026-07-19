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

  // Whole current year, not `now`: GitHub buckets contributions by the account's
  // local timezone, so a `to = now` (UTC) drops "today's" commits made past
  // midnight in a +5:30 zone. End-of-year `to` captures them; GitHub returns
  // only up to the present anyway. Rolls over automatically each year.
  const now = new Date();
  const year = now.getUTCFullYear();
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

  const data = cal.weeks.flatMap(
    (w: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL_MAP[d.contributionLevel] ?? 0,
      })),
  );

  return Response.json(
    { total: cal.totalContributions, data, year },
    {
      headers: {
        // Let the CDN serve a cached copy for 15 min, then hand out the stale
        // one while it refetches in the background — no stuck-for-an-hour feed,
        // no hammering the GitHub API on every hit.
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    },
  );
}
