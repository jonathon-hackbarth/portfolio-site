import { describe, it, expect } from "vitest";
import { onRequest } from "../src/middleware";

async function run(url: string) {
  const request = new Request(url);
  // Provide minimal shape expected by middleware (only request is used)
  const context: any = { request };
  const response = await onRequest(context, async () => new Response("ok"));
  return response as Response;
}

describe("CSP middleware (basic inline-allowed policy)", () => {
  it("always includes unsafe-inline due to inline scripts", async () => {
    const res = await run("http://localhost/");
    const csp = res.headers.get("Content-Security-Policy") || "";
    expect(csp).toMatch(/script-src 'self' 'unsafe-inline'/);
    expect(csp).toMatch(/style-src 'self' 'unsafe-inline'/);
  });

  it("adds upgrade-insecure-requests on HTTPS non-local hosts", async () => {
    const res = await run("https://example.com/");
    const csp = res.headers.get("Content-Security-Policy") || "";
    expect(csp).toMatch(/upgrade-insecure-requests/);
  });
});
