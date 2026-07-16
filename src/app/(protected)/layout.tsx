'use client';

import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Demo accounts are exempt from mandatory MFA so the one-click demo still works.
// They have no TOTP factor, so the AAL2 gate on the PII APIs naturally lets them
// through (their nextLevel is aal1).
const DEMO_EMAILS = new Set(
  [
    process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || 'demo.user@militarybenefitsassistant.com',
    process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || 'demo.admin@militarybenefitsassistant.com',
  ].map(e => e.toLowerCase())
);

function Spinner() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  // Once a user passes all gates this session, don't re-check on every navigation.
  const validatedFor = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      validatedFor.current = null;
      router.replace('/login');
      return;
    }

    // The MFA pages are part of the gating flow itself — always allow them.
    if (pathname.startsWith('/mfa')) {
      setReady(true);
      return;
    }

    // Terms gate (unchanged).
    if (pathname === '/terms/accept') {
      setReady(true);
      return;
    }
    if (!user.user_metadata?.terms_accepted_at) {
      router.replace('/terms/accept');
      return;
    }

    // Already fully validated this session → render immediately (no flicker).
    if (validatedFor.current === user.id) {
      setReady(true);
      return;
    }

    // Demo accounts skip MFA — but ONLY when demo mode is on. This must match the
    // AAL2 gate in mfa.ts exactly; otherwise demo accounts get waved past MFA here
    // yet 403'd on every PII route there (browse works, profile/submit hard-fail).
    if (
      process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true' &&
      user.email && DEMO_EMAILS.has(user.email.toLowerCase())
    ) {
      validatedFor.current = user.id;
      setReady(true);
      return;
    }

    // MFA enforcement is currently OFF (NEXT_PUBLIC_REQUIRE_MFA !== 'true'). The
    // whole TOTP flow (setup, challenge, reset) stays in the codebase — set the
    // flag to 'true' to re-enable mandatory two-step verification. Until then no
    // setup/challenge is required, so demos and signups go straight through.
    if (process.env.NEXT_PUBLIC_REQUIRE_MFA !== 'true') {
      validatedFor.current = user.id;
      setReady(true);
      return;
    }

    // MFA gate — mandatory TOTP; a fresh login is aal1 until the code is entered.
    let cancelled = false;
    setReady(false);
    (async () => {
      try {
        const supabase = createClient();
        const [{ data: aal }, { data: factors }] = await Promise.all([
          supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
          supabase.auth.mfa.listFactors(),
        ]);
        if (cancelled) return;

        const hasVerifiedTotp = (factors?.totp ?? []).some(f => f.status === 'verified');
        if (!hasVerifiedTotp) {
          router.replace('/mfa/setup');
          return;
        }
        if (aal?.nextLevel === 'aal2' && aal?.currentLevel !== 'aal2') {
          router.replace('/mfa');
          return;
        }
        validatedFor.current = user.id;
        setReady(true);
      } catch {
        // Couldn't determine MFA state → fail closed: send to the challenge page.
        if (!cancelled) router.replace('/mfa');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, pathname, router]);

  if (loading || !user || !ready) return <Spinner />;
  return <>{children}</>;
}
