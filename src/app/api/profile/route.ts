import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  }

  return NextResponse.json(profile, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Encrypt sensitive fields before storing.
  if (body.ssn) {
    body.ssn_encrypted = encrypt(body.ssn);
    delete body.ssn;
  }
  // VA file number is stored encrypted (in the va_file_number column).
  if (body.va_file_number) {
    body.va_file_number = encrypt(body.va_file_number);
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
