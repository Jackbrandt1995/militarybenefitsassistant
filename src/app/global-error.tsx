'use client';

/**
 * Root error boundary — the last line of defense when the app shell itself
 * crashes (must render its own <html>/<body>). Users get a plain-language
 * recovery screen instead of a white page; the error is logged with a stable
 * "[client-error]" token and its digest so a user report ("it said error
 * A1B2C3") can be matched to the server log line.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[client-error]', error.message, error.digest ?? '');
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
        <div style={{ maxWidth: 480, margin: '15vh auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, color: '#0f172a', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
            An unexpected error kept this page from loading. Your saved information is not
            affected. Please try again — if it keeps happening, email{' '}
            <a href="mailto:info@militarybenefitsassistant.com" style={{ color: '#1e3a8a' }}>
              info@militarybenefitsassistant.com
            </a>
            {error.digest ? ` and mention code ${error.digest}` : ''}.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 20,
              background: '#1e3a8a',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
