import type { MiddlewareHandler } from "astro";

// Security headers middleware (applies to all routes)
export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  const url = new URL(context.request.url);
  const isHttps = url.protocol === "https:";
  const isLocal = /^(localhost|127\.0\.0\.1)$/i.test(url.hostname);

  // Content Security Policy (basic; inline scripts currently require 'unsafe-inline')
  // NOTE: For stronger CSP, replace inline scripts with nonce or external files and remove 'unsafe-inline'.
  const cspDirectives: string[] = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data:",
    "font-src 'self' https: data:",
    "connect-src 'self' https://api.github.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ];
  // Only add upgrade-insecure-requests when already on HTTPS (prevents Safari attempting to upgrade localhost subresources)
  if (isHttps && !isLocal) {
    cspDirectives.push("upgrade-insecure-requests");
  }
  const csp = cspDirectives.join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  // HSTS only meaningful / safe on HTTPS and non-local
  if (isHttps && !isLocal) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  return response;
};
