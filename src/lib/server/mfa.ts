import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * AAL2 (MFA) gate for sensitive endpoints — STRICT and fail-closed.
 *
 * A caller is allowed ONLY if their session is fully stepped up to AAL2 (they
 * have entered their authenticator code this session). A user with no enrolled
 * TOTP factor is aal1 and is DENIED — they must enroll first (the protected
 * layout routes them to /mfa/setup). This closes the previous fail-open hole
 * where an un-enrolled session could read decrypted PII via a direct API call.
 *
 * Demo accounts are intentionally exempt (they carry no factor) so the one-click
 * demo still works — but only when NEXT_PUBLIC_ENABLE_DEMO is on, so the
 * exemption can never apply in a production build with demo disabled.
 */
const DEMO_EMAILS = new Set(
  [
    process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || 'demo.user@militarybenefitsassistant.com',
    process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || 'demo.admin@militarybenefitsassistant.com',
  ].map(e => e.toLowerCase()),
);

export async function aal2Satisfied(supabase: SupabaseClient): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    if (
      process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true' &&
      user.email &&
      DEMO_EMAILS.has(user.email.toLowerCase())
    ) {
      return true;
    }

    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!data) return false; // can't determine the level → deny
    return data.currentLevel === 'aal2';
  } catch {
    return false; // fail closed on any error
  }
}
