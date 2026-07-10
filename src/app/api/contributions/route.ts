import { social } from "@/config/social";

export const runtime = 'nodejs';
// Regenerate the cached function at most every 15 min so the calendar tracks
// fresh commits instead of sitting stale for a full hour.
export const revalidate = 900;

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

  // Year-to-date: Jan 1 of the current year → now. Computed each request so it
  // rolls over automatically next year — no hardcoded 2026.
  const now = new Date();
  const year = now.getUTCFullYear();
  const from = `${year}-01-01T00:00:00Z`;
  const to = now.toISOString();

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
    next: { revalidate: 900 },
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
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    },
  );
}
