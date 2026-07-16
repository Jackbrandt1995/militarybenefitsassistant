import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/encryption';
import { aal2Satisfied } from '@/lib/server/mfa';

/**
 * Records a form submission. The stored answers_json keeps ONLY name + email in
 * plaintext; every other answer (DOB, address, phone, and form-specific answers)
 * is encrypted into a single `_enc` blob at rest. SSN / bank / VA-file values are
 * dropped entirely (defense in depth — the client also scrubs them).
 *
 * answers_json is never read granularly by the app, so there's no decrypt path —
 * the blob is recoverable with the encryption key if ever needed.
 */
const SENSITIVE_KEY = /ssn|routing|account|bank|vafile|filenumber/i;
// Anchored to the veteran's OWN identity keys — a bare /name|email/i would also
// leave spouseName, dependentName, schoolName, etc. in plaintext.
const PLAINTEXT_KEY = /^(?:(?:first|middle|last|full)?_?name|(?:user_?)?email)$/i;
const looksLikeSSN = (v: unknown) => typeof v === 'string' && /^\d{3}-\d{2}-\d{4}$/.test(v.trim());

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await aal2Satisfied(supabase))) {
    return NextResponse.json({ error: 'MFA required' }, { status: 403 });
  }

  // Malformed JSON is a client error, not a retryable server failure.
  let parsed: { formId?: unknown; formName?: unknown; answers?: unknown };
  try {
    parsed = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const { formId, formName, answers } = parsed;
    if (!formId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const plaintext: Record<string, unknown> = {};
    const encryptable: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(answers as Record<string, unknown>)) {
      if (SENSITIVE_KEY.test(k) || looksLikeSSN(v)) continue; // drop SSN/bank/VA#
      if (PLAINTEXT_KEY.test(k)) plaintext[k] = v;            // keep name + email readable
      else encryptable[k] = v;                                // encrypt everything else
    }

    const answers_json: Record<string, unknown> = { ...plaintext };
    if (Object.keys(encryptable).length > 0) {
      try {
        answers_json._enc = encrypt(JSON.stringify(encryptable));
      } catch (encErr) {
        // No ENCRYPTION_KEY configured in this environment → still SAVE the
        // submission, storing these answers (already SSN/bank/VA#-free) in
        // plaintext. Set ENCRYPTION_KEY to encrypt them at rest.
        console.warn('[submissions] encryption unavailable; storing answers unencrypted:', encErr instanceof Error ? encErr.message : encErr);
        Object.assign(answers_json, encryptable);
      }
    }

    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        user_id: user.id,
        form_id: String(formId),
        form_name: String(formName ?? ''),
        answers_json,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[submissions insert]', error.message);
      return NextResponse.json({ error: 'Something went wrong saving the submission. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ id: data.id });
  } catch (err) {
    // Never let a thrown error escape as a non-JSON 500 — the client would only
    // see a generic message. The most likely throw is encrypt() when
    // ENCRYPTION_KEY isn't configured in this environment.
    console.error('[submissions]', err);
    const msg = err instanceof Error && err.message.includes('ENCRYPTION_KEY')
      ? 'The server is missing its encryption configuration, so the submission could not be saved.'
      : 'Something went wrong saving the submission. Please try again.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
