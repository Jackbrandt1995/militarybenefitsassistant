import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('direct_deposit')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data) {
    if (data.routing_number_encrypted) {
      try { data.routing_number = decrypt(data.routing_number_encrypted); } catch { data.routing_number = ''; }
    }
    if (data.account_number_encrypted) {
      try { data.account_number = decrypt(data.account_number_encrypted); } catch { data.account_number = ''; }
    }
  }

  return NextResponse.json(data || null);
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Encrypt sensitive fields
  if (body.routing_number) {
    body.routing_number_encrypted = encrypt(body.routing_number);
    delete body.routing_number;
  }
  if (body.account_number) {
    body.account_number_encrypted = encrypt(body.account_number);
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
