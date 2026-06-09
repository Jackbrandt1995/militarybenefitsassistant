import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Build a per-request CSP nonce + policy. We emit it as REPORT-ONLY for now:
 * the browser reports violations (visible in its console) but blocks nothing, so
 * it can't break the app. Once the violation reports are clean, switch the
 * response header from `Content-Security-Policy-Report-Only` to
 * `Content-Security-Policy` to enforce it.
 *
 * Next.js reads the nonce from the `Content-Security-Policy` header we set on the
 * forwarded REQUEST headers and applies it to its own scripts; 'strict-dynamic'
 * then trusts anything those nonce'd scripts load.
 */
function buildCsp(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self'`,
    `connect-src 'self' https://*.supabase.co https://*.vercel-scripts.com https://vitals.vercel-insights.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

export async function updateSession(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  // Forward the nonce + CSP to the Next render so it nonces its inline scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes under (protected) group
  const protectedPaths = ['/dashboard', '/profile', '/forms', '/history'];
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirect = NextResponse.redirect(url);
    redirect.headers.set('Content-Security-Policy-Report-Only', csp);
    return redirect;
  }

  supabaseResponse.headers.set('Content-Security-Policy-Report-Only', csp);
  return supabaseResponse;
}
