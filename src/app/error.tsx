'use client';

/**
 * Route-level error boundary — catches page crashes while keeping the app
 * shell (navbar) alive, so the user can still navigate away. Logged with the
 * same "[client-error]" token as global-error for unified alerting.
 */
import Button from '@/components/ui/Button';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[client-error]', error.message, error.digest ?? '');
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          An unexpected error kept this page from loading. Your saved information is not
          affected. Try again, or head back to your dashboard — and if it keeps happening,
          email{' '}
          <a href="mailto:info@militarybenefitsassistant.com" className="text-blue-800 underline">
            info@militarybenefitsassistant.com
          </a>
          {error.digest ? ` and mention code ${error.digest}` : ''}.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try Again</Button>
          <a
            href="/dashboard"
            className="text-sm font-medium text-blue-800 hover:underline"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
