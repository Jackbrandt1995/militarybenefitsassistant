import type { NextConfig } from "next";

// Static security headers applied to every response. (CSP is dynamic — it needs a
// per-request nonce — so it's set in middleware, not here.)
const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains. (Add `; preload` and submit to
  // hstspreload.org once you're confident every subdomain is HTTPS-only.)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Don't let the browser MIME-sniff responses.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // No framing (anti-clickjacking) — CSP frame-ancestors 'none' reinforces this.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Don't leak full URLs (which can carry ids) to third parties.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Turn off device APIs the app doesn't use.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
