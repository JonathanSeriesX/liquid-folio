/* Helpers for the live numbers in a project's stat strip.
 *
 * Each project in site.config.tsx may declare an async `stats()`; these are
 * the building blocks it composes. Everything returns null on failure so the
 * caller can fall back to a hardcoded figure rather than render an empty
 * strip — a portfolio should never go blank because GitHub rate-limited it.
 *
 * REVALIDATE is the per-request cache window. Keep it in step with the route's
 * `revalidate` in page.tsx, which Next requires to be a literal. */
export const REVALIDATE = 86_400;

/* A dropped fetch is by design invisible on the page, so make it visible in
   the build log — otherwise a fork ships someone else's hardcoded figure and
   nobody knows why. */
function warn(what: string, why: string): null {
  console.warn(`stats: ${what} unavailable (${why}), using the fallback`);
  return null;
}

/** Row count of a remote CSV, header excluded. */
export async function countCsvRows(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return warn(url, `HTTP ${res.status}`);
    return (await res.text()).trim().split("\n").length - 1;
  } catch (e) {
    return warn(url, e instanceof Error ? e.message : "fetch failed");
  }
}

/** Stars on a public GitHub repo, given as "owner/name".

    Unauthenticated GitHub API calls share 60 requests/hour per IP — on a
    busy CI runner that limit is often already spent, and the count silently
    falls back. Set GITHUB_TOKEN (any fine-grained token, no scopes needed)
    to get 5,000/hour instead. */
export async function githubStars(repo: string): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: REVALIDATE },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      const hint =
        res.status === 403 || res.status === 429
          ? `HTTP ${res.status} — likely rate-limited; set GITHUB_TOKEN`
          : `HTTP ${res.status}`;
      return warn(`github.com/${repo} stars`, hint);
    }
    return ((await res.json())?.stargazers_count as number) ?? null;
  } catch (e) {
    return warn(
      `github.com/${repo} stars`,
      e instanceof Error ? e.message : "fetch failed",
    );
  }
}
