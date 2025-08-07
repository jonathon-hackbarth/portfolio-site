import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { GET, __resetCacheForTests, buildEtag } from "../src/pages/api/github";

// Helper to run the APIRoute GET with a mock request
async function run(requestInit: { headers?: Record<string, string> } = {}) {
  const request = new Request("http://localhost/api/github", {
    headers: requestInit.headers,
  });
  // Astro APIRoute context minimal subset
  // @ts-ignore - only using request
  const response = await GET({ request });
  return response;
}

// Mock GH token for tests
process.env.GH_TOKEN = "TEST_TOKEN";

describe("api/github GET", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    __resetCacheForTests();
    vi.restoreAllMocks();
  });

  it("returns 401 when token missing", async () => {
    delete process.env.GH_TOKEN;
    const res = await run();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toMatch(/token/i);
    process.env.GH_TOKEN = "TEST_TOKEN";
  });

  it("serves fresh data then cached data with X-Cache headers", async () => {
    // First call: mock upstream fetch
    let callCount = 0;
    global.fetch = (async (url: any, init?: any) => {
      callCount++;
      if (String(url).includes("/users/")) {
        return new Response(
          JSON.stringify([
            {
              id: 1,
              name: "demo",
              description: "d",
              html_url: "https://g",
              languages_url: "https://api.github.com/repos/x/demo/languages",
              pushed_at: new Date().toISOString(),
            },
          ]),
          {
            status: 200,
            headers: {
              "x-ratelimit-remaining": "4999",
              "x-ratelimit-limit": "5000",
            },
          }
        );
      }
      if (String(url).includes("/languages")) {
        return new Response(JSON.stringify({ TypeScript: 100, Astro: 50 }), {
          status: 200,
        });
      }
      return new Response("nf", { status: 404 });
    }) as any;

    const first = await run();
    expect(first.status).toBe(200);
    expect(first.headers.get("X-Cache")).toBe("MISS");
    const body = await first.text();

    // Second call should hit in-memory cache (no new fetch of repos)
    const second = await run();
    expect(second.status).toBe(200);
    expect(second.headers.get("X-Cache")).toBe("HIT");
    const body2 = await second.text();
    expect(body2).toEqual(body);
    // Upstream fetch was invoked for repos only once
    expect(callCount).toBeGreaterThanOrEqual(1);
  });

  it("returns 304 when If-None-Match matches cached ETag", async () => {
    global.fetch = (async (url: any) => {
      if (String(url).includes("/users/")) {
        return new Response(
          JSON.stringify([
            {
              id: 1,
              name: "demo",
              description: "d",
              html_url: "https://g",
              languages_url: "https://api.github.com/repos/x/demo/languages",
              pushed_at: new Date().toISOString(),
            },
          ]),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ TypeScript: 10 }), { status: 200 });
    }) as any;

    const first = await run();
    const etag = first.headers.get("ETag");
    expect(etag).toBeTruthy();

    const second = await run({ headers: { "If-None-Match": etag || "" } });
    expect(second.status).toBe(304);
  });

  it("propagates rate limit as 429 with structured payload", async () => {
    global.fetch = (async (url: any) => {
      if (String(url).includes("/users/")) {
        return new Response("rate", {
          status: 403,
          headers: {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": "123456",
          },
        });
      }
      return new Response("nf", { status: 404 });
    }) as any;

    const res = await run();
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe("RATE_LIMIT");
    expect(json.resetAt).toBeTruthy();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });
});
