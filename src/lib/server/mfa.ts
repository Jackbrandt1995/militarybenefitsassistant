/**
 * AAL2 (MFA) gate for sensitive endpoints.
 *
 * Returns true unless the user HAS an MFA factor enrolled (nextLevel === 'aal2')
 * but has NOT completed the step-up this session (currentLevel !== 'aal2').
 * Demo / not-yet-enrolled accounts have nextLevel 'aal1' and pass (they're gated
 * separately at the layout level). Use this to block decrypted-PII reads/writes
 * until the user has actually entered their authenticator code.
 */
type MfaCapable = {
  auth: {
    mfa: {
      getAuthenticatorAssuranceLevel: () => Promise<{
        data: { currentLevel: string | null; nextLevel: string | null } | null;
      }>;
    };
  };
};

export async function aal2Satisfied(supabase: MfaCapable): Promise<boolean> {
  try {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!data) return false; // can't determine the level → deny (fail closed)
    // Allow if the session is stepped up, OR the user has no factor to step up to
    // (demo / not-yet-enrolled — those are gated at the layout instead).
    return data.currentLevel === 'aal2' || data.nextLevel !== 'aal2';
  } catch {
    return false; // fail closed on any error
  }
}
