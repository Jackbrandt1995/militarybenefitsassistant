/**
 * Server-side error telemetry (zero dependencies).
 *
 * Next.js calls onRequestError for every uncaught error in server components,
 * route handlers, server actions, and middleware. We emit ONE structured JSON
 * line with a stable "[server-error]" token so Vercel log tooling can alert on
 * it (Vercel → Observability → Logs → query "[server-error]" → Create Alert).
 *
 * No request bodies, headers, or answer payloads are logged — veteran PII must
 * never reach the log stream. Path + method + digest is enough to find and
 * reproduce an issue.
 */
import type { Instrumentation } from 'next';

export function register() {
  // No init needed — reserved for a future APM/Sentry bootstrap.
}

export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const e = err instanceof Error ? err : new Error(String(err));
  console.error(
    '[server-error]',
    JSON.stringify({
      message: e.message,
      // Next attaches a stable digest to server errors; it is also shown to the
      // user on error screens, letting you correlate a report to this log line.
      digest: (e as { digest?: string }).digest,
      path: request.path,
      method: request.method,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
      stack: e.stack?.split('\n').slice(0, 6).join(' | '),
    }),
  );
};
