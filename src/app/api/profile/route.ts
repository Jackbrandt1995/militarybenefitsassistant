import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/encryption';
import { aal2Satisfied } from '@/lib/server/mfa';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await aal2Satisfied(supabase))) {
    return NextResponse.json({ error: 'MFA required' }, { status: 403 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('[profile GET]', error.message);
    return NextResponse.json({ error: 'Something went wrong loading your profile. Please try again.' }, { status: 500 });
  }

  // Decrypt sensitive values for the client. If decrypt fails (a still-plaintext
  // row during transition), fall back to the stored value so nothing renders blank.
  if (profile.ssn_encrypted) {
    try { profile.ssn_decrypted = decrypt(profile.ssn_encrypted); }
    catch { profile.ssn_decrypted = profile.ssn_encrypted; }
  }
  // VA file number is often the veteran's SSN, so it's encrypted at rest too
  // (stored as ciphertext in the va_file_number column).
  if (profile.va_file_number) {
    try { profile.va_file_number_decrypted = decrypt(profile.va_file_number); }
    catch { profile.va_file_number_decrypted = profile.va_file_number; }
    // Never send ciphertext under the same key the client edits and PUTs back —
    // that round-trip would re-encrypt the ciphertext and corrupt the stored value.
    profile.va_file_number = profile.va_file_number_decrypted;
  }

  return NextResponse.json(profile, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await aal2Satisfied(supabase))) {
    return NextResponse.json({ error: 'MFA required' }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Never trust a client-supplied encrypted-column value (it would let plaintext
    // bypass encryption); the real value is derived from `ssn` just below.
    delete body.ssn_encrypted;

    // Encrypt sensitive fields before storing. Check presence, not truthiness, so
    // an empty value CLEARS the stored one — otherwise the phantom `ssn` key (no
    // such column on profiles) reaches the update and PostgREST rejects it.
    if ('ssn' in body) {
      body.ssn_encrypted = body.ssn ? encrypt(body.ssn) : null;
      delete body.ssn;
    }
    // VA file number is stored encrypted (in the va_file_number column).
    if ('va_file_number' in body) {
      // Real VA file numbers are ~8–9 characters; anything much longer is a
      // ciphertext echo (a base64 blob shown after a failed decrypt being PUT
      // back), which would get double-encrypted and corrupt the stored value.
      if (typeof body.va_file_number === 'string' && body.va_file_number.length > 20) {
        return NextResponse.json({ error: 'That VA file number looks too long. Please enter it as shown on your VA letters.' }, { status: 400 });
      }
      body.va_file_number = body.va_file_number ? encrypt(body.va_file_number) : null;
    }

    // Remove fields that shouldn't be directly updated
    delete body.user_id;
    delete body.id;
    delete body.created_at;
    delete body.ssn_decrypted;
    delete body.va_file_number_decrypted;

    const { data, error } = await supabase
      .from('profiles')
      .update(body)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[profile PUT]', error.message);
      return NextResponse.json({ error: 'Something went wrong saving your profile. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    // Surface encryption-config failures as readable JSON instead of an opaque 500.
    console.error('[profile PUT]', err);
    const msg = err instanceof Error && err.message.includes('ENCRYPTION_KEY')
      ? 'The server is missing its encryption configuration, so this could not be saved.'
      : 'Something went wrong saving your profile. Please try again.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
