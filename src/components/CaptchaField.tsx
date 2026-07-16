'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    hcaptcha?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit';

/**
 * hCaptcha widget — env-gated.
 *
 * Renders nothing (and yields no token) unless NEXT_PUBLIC_HCAPTCHA_SITE_KEY is
 * set. Pair it with hCaptcha enabled in the Supabase dashboard (Authentication →
 * Bot & Abuse Protection), where you paste the hCaptcha SECRET key. The token is
 * passed to supabase.auth.* via options.captchaToken. Re-mount (change the `key`
 * prop) to force a fresh token after a failed attempt — tokens are single-use.
 */
export default function CaptchaField({ onToken }: { onToken: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [loadFailed, setLoadFailed] = useState(false);

  // Keep the latest callback without re-rendering the widget (refs must not be
  // written during render).
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function stopWaiting() {
      if (pollId) clearInterval(pollId);
      if (timeoutId) clearTimeout(timeoutId);
    }

    function fail() {
      if (cancelled) return;
      stopWaiting();
      setLoadFailed(true);
    }

    function renderWidget() {
      if (cancelled || !window.hcaptcha?.render || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      });
    }

    if (window.hcaptcha?.render) {
      renderWidget();
    } else {
      if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        const s = document.createElement('script');
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        s.onerror = fail;
        document.head.appendChild(s);
      }
      // Blocked script (ad blocker, offline, CSP) → give up after 10s and explain.
      timeoutId = setTimeout(fail, 10000);
      pollId = setInterval(() => {
        if (window.hcaptcha?.render) {
          stopWaiting();
          renderWidget();
        }
      }, 200);
    }

    return () => {
      cancelled = true;
      stopWaiting();
      const id = widgetIdRef.current;
      if (id && window.hcaptcha) {
        try { window.hcaptcha.remove(id); } catch { /* already gone */ }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  if (!siteKey) return null;
  if (loadFailed) {
    return (
      <p role="alert" className="text-sm text-red-600 text-center">
        The security check could not load. Please turn off your ad blocker for this site and reload the page.
      </p>
    );
  }
  return <div ref={containerRef} className="flex justify-center" />;
}
