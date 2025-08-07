import type { APIRoute } from "astro";
import { getProjectsData } from "../../utils/projectUtils";
import "../../types/env.d.ts";
import { GITHUB_CONFIG } from "../../utils/constants";

// Simple in-memory cache (persists for warm serverless instances / dev server runtime)
interface CacheEntry {
  timestamp: number;
  json: string; // serialized payload
  etag: string;
  rateLimit?: {
    remaining?: string | null;
    limit?: string | null;
    reset?: string | null;
  };
}

const CACHE_TTL_MS = 3600 * 1000; // 1 hour
let cache: CacheEntry | null = null;

// Exported for test harness
export const fetchGitHubRepos = async (username: string, token: string) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const rateLimit = {
    remaining: response.headers.get("x-ratelimit-remaining"),
    limit: response.headers.get("x-ratelimit-limit"),
    reset: response.headers.get("x-ratelimit-reset"),
  };

  if (response.status === 403 && rateLimit.remaining === "0") {
    return { error: "RATE_LIMIT", rateLimit } as const;
  }

  if (!response.ok) {
    return { error: `HTTP_${response.status}`, rateLimit } as const;
  }

  const data = await response.json();
  return { data, rateLimit } as const;
};

export function buildEtag(body: string) {
  // Weak ETag: size-hashlike (hash simplified to length + first/last chars)
  const len = body.length;
  const first = body.charCodeAt(0).toString(16);
  const last = body.charCodeAt(body.length - 1).toString(16);
  return `W/"${len}-${first}${last}"`;
}

// Test helper to reset in-memory cache between test cases
export function __resetCacheForTests() {
  cache = null;
}

export const GET: APIRoute = async ({ request }) => {
  const token = import.meta.env.GH_TOKEN || process.env.GH_TOKEN;

  if (!token) {
    return new Response(
      JSON.stringify({ message: "GitHub token not configured" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const now = Date.now();

  // Serve from cache if fresh
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && ifNoneMatch === cache.etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: cache.etag,
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }
    return new Response(cache.json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        ETag: cache.etag,
        "X-Cache": "HIT",
        ...(cache.rateLimit?.remaining
          ? { "X-RateLimit-Remaining": cache.rateLimit.remaining || "" }
          : {}),
      },
    });
  }

  try {
    const result = await fetchGitHubRepos(GITHUB_CONFIG.USERNAME, token);

    if ("error" in result) {
      const { error: code, rateLimit } = result;
      if (code === "RATE_LIMIT") {
        const resetSeconds = rateLimit.reset
          ? parseInt(rateLimit.reset, 10)
          : 0;
        const resetDate = resetSeconds
          ? new Date(resetSeconds * 1000).toISOString()
          : undefined;
        return new Response(
          JSON.stringify({
            error: code,
            message: "GitHub API rate limit exceeded",
            resetAt: resetDate,
            suggestion: "Try again after reset or reduce request frequency.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
              ...(rateLimit.remaining
                ? { "X-RateLimit-Remaining": rateLimit.remaining || "" }
                : {}),
            },
          }
        );
      }
      // Generic upstream error
      return new Response(
        JSON.stringify({
          error: code,
          message: "Failed to retrieve repositories from GitHub",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const { data: repos, rateLimit } = result;
    const projectsData = await getProjectsData(repos, token);
    const json = JSON.stringify(projectsData);
    const etag = buildEtag(json);
    cache = { json, timestamp: now, etag, rateLimit };

    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
          "X-Cache": "MISS-IMPLIED-304",
        },
      });
    }

    return new Response(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        ETag: etag,
        "X-Cache": "MISS",
        ...(rateLimit.remaining
          ? { "X-RateLimit-Remaining": rateLimit.remaining || "" }
          : {}),
      },
    });
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch GitHub data";
    console.error("API Error:", message);
    return new Response(JSON.stringify({ error: "INTERNAL_ERROR", message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
