import type { MiddlewareHandler } from "astro";

// Simplified middleware: remove CSP hardening (user request) while keeping a few low-risk headers.
// NOTE: Re-introduce a stricter CSP later once inline scripts are refactored.
export const onRequest: MiddlewareHandler = async (_context, next) => {
  const response = await next();
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  return response;
};
