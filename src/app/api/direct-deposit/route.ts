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

  const { data, error } = await supabase
    .from('direct_deposit')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[direct-deposit GET]', error.message);
    return NextResponse.json({ error: 'Something went wrong loading your banking info. Please try again.' }, { status: 500 });
  }

  if (data) {
    // Decrypt for the client; if a value is still plaintext (pre-backfill), fall
    // back to the stored value so nothing shows blank during the transition.
    if (data.routing_number_encrypted) {
      try { data.routing_number = decrypt(data.routing_number_encrypted); } catch { data.routing_number = data.routing_number_encrypted; }
    }
    if (data.account_number_encrypted) {
      try { data.account_number = decrypt(data.account_number_encrypted); } catch { data.account_number = data.account_number_encrypted; }
    }
  }

  return NextResponse.json(data || null, { headers: { 'Cache-Control': 'no-store' } });
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

    // Validate format before storing — a bad routing/account number flows onto
    // the veteran's VA direct-deposit form and means a rejected or lost payment.
    if (body.routing_number && !/^\d{9}$/.test(body.routing_number)) {
      return NextResponse.json({ error: 'Routing number must be exactly 9 digits, with no spaces or dashes.' }, { status: 400 });
    }
    if (body.account_number && !/^\d{4,17}$/.test(body.account_number)) {
      return NextResponse.json({ error: 'Account number must be 4 to 17 digits, with no spaces or dashes.' }, { status: 400 });
    }

    // Never trust client-supplied encrypted-column values; they're derived below.
    delete body.routing_number_encrypted;
    delete body.account_number_encrypted;

    // Encrypt sensitive fields. Check presence, not truthiness, so an empty value
    // CLEARS the stored one — otherwise the phantom plain-named key (no such
    // column on direct_deposit) reaches the upsert and PostgREST rejects it.
    if ('routing_number' in body) {
      body.routing_number_encrypted = body.routing_number ? encrypt(body.routing_number) : null;
      delete body.routing_number;
    }
    if ('account_number' in body) {
      body.account_number_encrypted = body.account_number ? encrypt(body.account_number) : null;
      delete body.account_number;
    }

    delete body.user_id;
    delete body.id;

    // Upsert: insert if not exists, update if exists
    const { data, error } = await supabase
      .from('direct_deposit')
      .upsert({ ...body, user_id: user.id }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('[direct-deposit PUT]', error.message);
      return NextResponse.json({ error: 'Something went wrong saving your banking info. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    // Surface encryption-config failures as readable JSON instead of an opaque 500.
    console.error('[direct-deposit PUT]', err);
    const msg = err instanceof Error && err.message.includes('ENCRYPTION_KEY')
      ? 'The server is missing its encryption configuration, so this could not be saved.'
      : 'Something went wrong saving your banking info. Please try again.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
