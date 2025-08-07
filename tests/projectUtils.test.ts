import { describe, it, expect, afterAll } from "vitest";
import { getProjectsData, type Repository } from "../src/utils/projectUtils";

// Mock fetch for languages
const originalFetch = global.fetch;

describe("getProjectsData", () => {
  it("computes language percentages summing to ~100", async () => {
    global.fetch = (async (url: RequestInfo | URL) => {
      const u = url.toString();
      if (u.endsWith("/languages")) {
        return new Response(
          JSON.stringify({ TypeScript: 300, Astro: 100, CSS: 100 }),
          { status: 200 }
        );
      }
      return new Response("Not Found", { status: 404 });
    }) as any;

    const repos: Repository[] = [
      {
        id: 1,
        name: "demo",
        description: "test",
        html_url: "https://github.com/example/demo",
        languages_url: "https://api.github.com/repos/example/demo/languages",
        pushed_at: new Date().toISOString(),
      },
    ];

    const result = await getProjectsData(repos, "TOKEN");
    expect(result).toHaveLength(1);
    const langs = result[0].languages;
    const sum = langs.reduce(
      (acc: number, l: any) => acc + parseFloat(l.percentage),
      0
    );
    expect(sum).toBeGreaterThan(99.9);
    expect(sum).toBeLessThan(100.2);
  });

  it("throws if token missing", async () => {
    await expect(getProjectsData([], "" as any)).rejects.toThrow(/token/i);
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});
