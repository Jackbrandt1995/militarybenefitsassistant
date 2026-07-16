import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Only allow same-origin path redirects: must start with '/' but not '//'
  // (protocol-relative) so a crafted ?next= can't send users off-site.
  const rawNext = searchParams.get('next');
  const next =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // The link was invalid, expired, or opened in a different browser. Send
  // password-reset attempts back to the request-a-new-link page; everything
  // else goes to login with an explanatory banner.
  if (next === '/reset-password') {
    return NextResponse.redirect(`${origin}/forgot-password?error=expired`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
