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
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Decrypt SSN for the client
  if (profile.ssn_encrypted) {
    try {
      profile.ssn_decrypted = decrypt(profile.ssn_encrypted);
    } catch {
      profile.ssn_decrypted = '';
    }
  }

  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // If SSN is provided, encrypt it before storing
  if (body.ssn) {
    body.ssn_encrypted = encrypt(body.ssn);
    delete body.ssn;
  }

  // Remove fields that shouldn't be directly updated
  delete body.user_id;
  delete body.id;
  delete body.created_at;
  delete body.ssn_decrypted;

  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
