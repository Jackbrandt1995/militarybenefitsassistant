-- ============================================================================
-- 009 — Authorization guards on admin RPCs  (security fix #2)
--
-- The admin RPCs are SECURITY DEFINER (they bypass RLS to read auth.users and
-- every user's submissions). Previously they performed NO check that the caller
-- is an admin, so ANY authenticated user could call them directly via the
-- Supabase client and read all users' PII, mark submissions mailed, send
-- messages as "admin", etc. The admin gate was client-side only.
--
-- This migration adds a server-side is_admin() check to every admin RPC.
-- Apply with `supabase db push` or by running this file in the SQL editor.
-- ============================================================================

-- Admin flag lives in auth.users.raw_user_meta_data->>'is_admin'.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select (au.raw_user_meta_data ->> 'is_admin')::boolean
       from auth.users au
      where au.id = auth.uid()),
    false
  );
$$;

-- ── get_agent_submissions() ─────────────────────────────────────────────────
create or replace function public.get_agent_submissions()
returns table (
  id                   uuid,
  user_id              uuid,
  form_id              text,
  form_name            text,
  submission_status    text,
  agent_auth_signature text,
  pdf_storage_path     text,
  created_at           timestamptz,
  first_name           text,
  last_name            text,
  email                text,
  tracking_number      text,
  return_reason        text,
  returned_at          timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
  select
    fs.id, fs.user_id, fs.form_id, fs.form_name, fs.submission_status,
    fs.agent_auth_signature, fs.pdf_storage_path, fs.generated_at as created_at,
    p.first_name, p.last_name, u.email::text,
    fs.tracking_number, fs.return_reason, fs.returned_at
  from public.form_submissions fs
  left join public.profiles p on p.id = fs.user_id
  left join auth.users      u on u.id = fs.user_id
  where fs.agent_filing_requested = true
  order by fs.generated_at desc;
end;
$$;

-- ── mark_submission_mailed() ────────────────────────────────────────────────
create or replace function public.mark_submission_mailed(p_submission_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  update public.form_submissions
  set submission_status = 'agent_mailed'
  where id = p_submission_id;
end;
$$;

-- ── set_tracking_number() ───────────────────────────────────────────────────
create or replace function public.set_tracking_number(
  p_submission_id uuid,
  p_tracking_number text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  update public.form_submissions
  set tracking_number = p_tracking_number
  where id = p_submission_id;
end;
$$;

-- ── return_submission_for_edits() ───────────────────────────────────────────
create or replace function public.return_submission_for_edits(
  p_submission_id uuid,
  p_return_reason text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  update public.form_submissions
  set submission_status = 'agent_returned',
      return_reason     = p_return_reason,
      returned_at       = now()
  where id = p_submission_id;
end;
$$;

-- ── admin_get_messages() ────────────────────────────────────────────────────
create or replace function public.admin_get_messages(p_submission_id uuid)
returns table (
  id            uuid,
  submission_id uuid,
  sender_type   text,
  message       text,
  created_at    timestamptz,
  is_read       boolean
)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  update public.submission_messages
     set is_read = true
   where submission_id = p_submission_id and sender_type = 'client';

  return query
  select sm.id, sm.submission_id, sm.sender_type, sm.message, sm.created_at, sm.is_read
    from public.submission_messages sm
   where sm.submission_id = p_submission_id
   order by sm.created_at asc;
end;
$$;

-- ── admin_send_message() ────────────────────────────────────────────────────
create or replace function public.admin_send_message(
  p_submission_id uuid,
  p_message       text
)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  insert into public.submission_messages (submission_id, sender_type, message)
  values (p_submission_id, 'admin', p_message)
  returning id into v_id;
  return v_id;
end;
$$;

-- ── get_unread_message_counts() ─────────────────────────────────────────────
create or replace function public.get_unread_message_counts()
returns table (submission_id uuid, unread_count bigint)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
  select sm.submission_id, count(*) as unread_count
    from public.submission_messages sm
   where sm.sender_type = 'client' and sm.is_read = false
   group by sm.submission_id;
end;
$$;
