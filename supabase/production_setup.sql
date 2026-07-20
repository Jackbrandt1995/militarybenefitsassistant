-- ============================================================================
-- PRODUCTION SETUP — one-paste runner for migrations 014 → 018.
--
-- Run ONCE in the Supabase SQL Editor (Dashboard → SQL Editor → New query →
-- paste → Run). Safe to RE-RUN: every statement is guarded (if-not-exists /
-- or-replace / drop-if-exists), so a partial earlier attempt is fine.
--
-- What this enables, in order:
--   014  removes the over-permissive owner UPDATE policy on form_submissions
--   015  password_verification_hook — server-side brute-force throttle
--        (after running, ALSO enable it: Dashboard → Authentication → Hooks →
--         "Password verification attempt" → public.password_verification_hook)
--   016  client_assignments — the admin pool / claim / release features
--   017  client_notes + case view RPCs — the per-client admin case view
--   018  representatives — the admin rep-profile page
--
-- NOT included: 019_appointments (the 21-22A signature flow — deferred; owner
-- is handling 21-22A separately). Run it later only if that flow ships.
-- ============================================================================


-- ────────────────────────────── 014_tighten_form_submissions_update ──────────────────────────────
-- ============================================================================
-- 014: Remove the over-permissive owner UPDATE policy on form_submissions.
--
-- The only legitimate write to a submission AFTER insert is record_agent_filing()
-- (migration 010) — a SECURITY DEFINER RPC that bypasses RLS and scopes to
-- auth.uid(). No client code path updates form_submissions directly. The broad
-- owner UPDATE policy (migration 004) has no WITH CHECK, so it let a user forge
-- their own workflow state on their own rows (e.g. set submission_status to
-- 'agent_mailed'). It is unused by the app, so drop it.
-- ============================================================================

drop policy if exists "Users can update own form_submissions" on public.form_submissions;

-- ────────────────────────────── 015_password_verification_hook ──────────────────────────────
-- ============================================================================
-- 015: Real brute-force protection via a Supabase Password Verification Auth Hook.
--
-- WHY: the previous app-route lockout (migration 013) was bypassable — a client
-- can call Supabase Auth directly with the public anon key, never touching our
-- route — and, being email-keyed with a 3-day hard lock, it was weaponizable as
-- a denial-of-service. This hook runs INSIDE GoTrue on every password attempt,
-- so it cannot be bypassed; it is keyed on user_id; the counter is atomic; and
-- the backoff AUTO-EXPIRES (no multi-day lockout to weaponize).
--
-- ENABLE AFTER APPLYING:
--   Supabase Dashboard → Authentication → Hooks (Beta) →
--     "Password verification attempt" → enable → select
--     public.password_verification_hook
--   Also enable CAPTCHA: Authentication → Settings → Bot & Abuse Protection →
--     enable, provider Cloudflare Turnstile, paste the Turnstile SECRET key.
-- ============================================================================

-- Per-user attempt tracking. Keyed by user_id (the hook receives it).
create table if not exists public.auth_login_throttle (
  user_id         uuid primary key,
  attempt_count   integer     not null default 0,
  last_attempt_at timestamptz not null default now(),
  locked_until    timestamptz
);

-- Only the auth hook (running as supabase_auth_admin) may touch this table.
alter table public.auth_login_throttle enable row level security;
revoke all on table public.auth_login_throttle from anon, authenticated;
grant  all on table public.auth_login_throttle to   supabase_auth_admin;
grant  usage on schema public to supabase_auth_admin;
drop policy if exists "auth admin manages throttle" on public.auth_login_throttle;
create policy "auth admin manages throttle"
  on public.auth_login_throttle
  to supabase_auth_admin
  using (true) with check (true);

-- The hook GoTrue calls after each password verification attempt.
-- event = { "user_id": "<uuid>", "valid": <bool> }
-- returns { "decision": "continue" } or { "decision": "reject", "message": "..." }
create or replace function public.password_verification_hook(event jsonb)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_user_id   uuid    := (event->>'user_id')::uuid;
  v_valid     boolean := coalesce((event->>'valid')::boolean, false);
  v_rec       public.auth_login_throttle;
  v_count     integer;
  v_threshold constant integer := 5;   -- free attempts before backoff kicks in
  v_backoff   interval;
  v_reject    jsonb := jsonb_build_object(
    'decision', 'reject',
    'message',  'Too many failed sign-in attempts. Please wait a moment and try again.'
  );
begin
  if v_user_id is null then
    return jsonb_build_object('decision', 'continue');
  end if;

  select * into v_rec from public.auth_login_throttle where user_id = v_user_id;

  -- Inside an active backoff window → reject regardless of the password.
  if v_rec.locked_until is not null and v_rec.locked_until > now() then
    return v_reject;
  end if;

  if v_valid then
    -- Correct password → clear throttle state and allow.
    delete from public.auth_login_throttle where user_id = v_user_id;
    return jsonb_build_object('decision', 'continue');
  end if;

  -- Wrong password. Self-heal: reset the counter if the last failure was old.
  if v_rec.user_id is null or v_rec.last_attempt_at < now() - interval '1 hour' then
    v_count := 1;
  else
    v_count := v_rec.attempt_count + 1;
  end if;

  -- Exponential backoff once over the threshold (1,2,4,8,16 min … capped 30 min).
  if v_count >= v_threshold then
    v_backoff := least(
      make_interval(mins => power(2, least(v_count - v_threshold, 13))::int),
      interval '30 minutes'
    );
  else
    v_backoff := null;
  end if;

  insert into public.auth_login_throttle (user_id, attempt_count, last_attempt_at, locked_until)
  values (v_user_id, v_count, now(), case when v_backoff is not null then now() + v_backoff end)
  on conflict (user_id) do update
    set attempt_count   = excluded.attempt_count,
        last_attempt_at = excluded.last_attempt_at,
        locked_until    = excluded.locked_until;

  if v_backoff is not null then
    return v_reject;
  end if;
  return jsonb_build_object('decision', 'continue');
end;
$$;

grant  execute on function public.password_verification_hook(jsonb) to   supabase_auth_admin;
revoke execute on function public.password_verification_hook(jsonb) from anon, authenticated, public;

-- ── Remove the superseded app-route lockout (migration 013) ─────────────────
drop function if exists public.admin_list_lockouts();
drop function if exists public.admin_approve_lockout_reset(text);
drop table     if exists public.account_lockouts;

-- ────────────────────────────── 016_client_assignments ──────────────────────────────
-- ============================================================================
-- 016: Client assignment pool — admins self-claim veterans for action.
--
-- All admins still see the shared agent-filing queue (is_admin), but each admin
-- can CLAIM a client ("I'm handling this person") and filter to "My clients" vs
-- the unassigned pool. Self-assign, not founder-assigned. Assignment is at the
-- CLIENT (veteran user_id) level, so claiming a client covers all their forms.
-- This is a deliberate stepping stone toward true per-organization siloing.
-- ============================================================================

create table if not exists public.client_assignments (
  user_id           uuid primary key references public.profiles(id) on delete cascade,
  assigned_admin_id uuid        not null,   -- auth.users id of the rep handling this client
  assigned_at       timestamptz not null default now(),
  assigned_by       uuid        not null    -- who performed the assignment (self for now)
);

-- Access only through the SECURITY DEFINER, is_admin()-gated RPCs below.
alter table public.client_assignments enable row level security;
revoke all on table public.client_assignments from anon, authenticated;

-- Claim a client for the calling admin. Succeeds if the client is unassigned or
-- already theirs; returns 'taken' (changing nothing) if another admin holds it.
drop function if exists public.claim_client(uuid);
create function public.claim_client(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare v_current uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select assigned_admin_id into v_current from public.client_assignments where user_id = p_user_id;
  if v_current is not null and v_current <> auth.uid() then
    return 'taken';
  end if;
  insert into public.client_assignments (user_id, assigned_admin_id, assigned_by)
  values (p_user_id, auth.uid(), auth.uid())
  on conflict (user_id) do update
    set assigned_admin_id = auth.uid(), assigned_at = now(), assigned_by = auth.uid();
  return 'claimed';
end;
$$;

-- Release the calling admin's OWN claim (no-op if it isn't theirs).
drop function if exists public.release_client(uuid);
create function public.release_client(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  delete from public.client_assignments where user_id = p_user_id and assigned_admin_id = auth.uid();
  return 'released';
end;
$$;

-- List current assignments (with the assignee's email) for the admin UI.
drop function if exists public.get_client_assignments();
create function public.get_client_assignments()
returns table (user_id uuid, assigned_admin_id uuid, assigned_admin_email text, assigned_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select ca.user_id, ca.assigned_admin_id, u.email::text, ca.assigned_at
      from public.client_assignments ca
      join auth.users u on u.id = ca.assigned_admin_id;
end;
$$;

grant execute on function public.claim_client(uuid)        to authenticated;
grant execute on function public.release_client(uuid)      to authenticated;
grant execute on function public.get_client_assignments()  to authenticated;

-- ────────────────────────────── 017_client_case_view ──────────────────────────────
-- ============================================================================
-- 017: Per-client CASE VIEW — consolidate one veteran into a single admin screen.
--
-- Backs the /admin/clients/[userId] drill-in from the agent-filing queue. Three
-- pieces, all is_admin()-gated + SECURITY DEFINER + set search_path = public,
-- following migration 016 exactly:
--   a. get_client_detail  — the veteran's PLAINTEXT contact block from profiles.
--   b. client_notes table — private rep-only notes about a client.
--   c. add_client_note / get_client_notes — write + read those notes.
--
-- SECURITY: ssn_encrypted and va_file_number are application-encrypted
-- (AES-256-GCM, key lives in the app, not Postgres). They are useless ciphertext
-- from SQL and extra PII exposure, so get_client_detail NEVER returns them. It
-- returns ONLY plaintext contact fields (name parts, dob, sex, phones, email,
-- mailing address parts).
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- a. get_client_detail(p_user_id) — plaintext contact block for one veteran.
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.get_client_detail(uuid);
create function public.get_client_detail(p_user_id uuid)
returns table (
  id              uuid,
  first_name      text,
  middle_name     text,
  last_name       text,
  suffix          text,
  dob             date,
  sex             text,
  email           text,
  phone_home      text,
  phone_mobile    text,
  address_street  text,
  address_apt     text,
  address_city    text,
  address_state   text,
  address_zip     text,
  address_country text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select
      p.id,
      p.first_name,
      p.middle_name,
      p.last_name,
      p.suffix,
      p.dob,
      p.sex,
      p.email,
      p.phone_home,
      p.phone_mobile,
      p.address_street,
      p.address_apt,
      p.address_city,
      p.address_state,
      p.address_zip,
      p.address_country
    from public.profiles p
    where p.id = p_user_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- b. client_notes — private, rep-only notes about a veteran client.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.client_notes (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  author_id  uuid        not null,   -- auth.users id of the rep who wrote the note
  body       text        not null,
  created_at timestamptz not null default now()
);

-- Access only through the SECURITY DEFINER, is_admin()-gated RPCs below.
alter table public.client_notes enable row level security;
revoke all on table public.client_notes from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- c. add_client_note(p_user_id, p_body) — insert a note authored by the caller.
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.add_client_note(uuid, text);
create function public.add_client_note(p_user_id uuid, p_body text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  insert into public.client_notes (user_id, author_id, body)
  values (p_user_id, auth.uid(), p_body);
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- d. get_client_notes(p_user_id) — notes for one client, with author email.
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.get_client_notes(uuid);
create function public.get_client_notes(p_user_id uuid)
returns table (
  id           uuid,
  body         text,
  created_at   timestamptz,
  author_email text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select cn.id, cn.body, cn.created_at, u.email::text
      from public.client_notes cn
      left join auth.users u on u.id = cn.author_id
     where cn.user_id = p_user_id
     order by cn.created_at desc;
end;
$$;

grant execute on function public.get_client_detail(uuid) to authenticated;
grant execute on function public.add_client_note(uuid, text) to authenticated;
grant execute on function public.get_client_notes(uuid) to authenticated;

-- ────────────────────────────── 018_representatives ──────────────────────────────
-- ============================================================================
-- 018: Representative profile — the rep's own details for autofilling 21-22A.
--
-- Part of moving the VA 21-22A (Appointment of Representative) FROM the veteran's
-- submission flow TO a rep-driven flow. Pass 1 builds the FOUNDATION: a per-rep
-- profile holding the REPRESENTATIVE fields of the 21-22A (name, address, phone,
-- email, appointment type, organization, accreditation number) so the rep's
-- details can be pre-filled on every client's form in Pass 2.
--
-- OWNER-SCOPED, not founder-scoped: every RPC here keys on auth.uid(), so a rep
-- can only ever read or write THEIR OWN profile. admin_id is ALWAYS taken from
-- auth.uid(), never from caller input. All access is via the SECURITY DEFINER,
-- is_admin()-gated RPCs below (is_admin() defined in migration 012, reading the
-- secure raw_app_meta_data flag). Follows 016/017 exactly.
-- ============================================================================

create table if not exists public.representatives (
  admin_id            uuid        primary key,   -- the rep's auth.users id (== auth.uid())
  rep_first_name      text,
  rep_middle_initial  text,
  rep_last_name       text,
  rep_street          text,
  rep_apt             text,
  rep_city            text,
  rep_state           text,
  rep_zip             text,
  rep_country         text,
  rep_phone           text,
  rep_email           text,
  appointment_type    text,
  org_name            text,
  accreditation_number text,
  updated_at          timestamptz not null default now()
);

-- Access only through the SECURITY DEFINER, is_admin()-gated RPCs below.
alter table public.representatives enable row level security;
revoke all on table public.representatives from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- get_my_rep_profile() — the calling rep's OWN profile (0 or 1 row).
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.get_my_rep_profile();
create function public.get_my_rep_profile()
returns table (
  admin_id             uuid,
  rep_first_name       text,
  rep_middle_initial   text,
  rep_last_name        text,
  rep_street           text,
  rep_apt              text,
  rep_city             text,
  rep_state            text,
  rep_zip              text,
  rep_country          text,
  rep_phone            text,
  rep_email            text,
  appointment_type     text,
  org_name             text,
  accreditation_number text,
  updated_at           timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select
      r.admin_id,
      r.rep_first_name,
      r.rep_middle_initial,
      r.rep_last_name,
      r.rep_street,
      r.rep_apt,
      r.rep_city,
      r.rep_state,
      r.rep_zip,
      r.rep_country,
      r.rep_phone,
      r.rep_email,
      r.appointment_type,
      r.org_name,
      r.accreditation_number,
      r.updated_at
    from public.representatives r
    where r.admin_id = auth.uid();
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- upsert_my_rep_profile(...) — create or update the calling rep's OWN profile.
-- admin_id is ALWAYS auth.uid() (never caller-supplied).
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.upsert_my_rep_profile(text, text, text, text, text, text, text, text, text, text, text, text, text, text);
create function public.upsert_my_rep_profile(
  p_rep_first_name       text,
  p_rep_middle_initial   text,
  p_rep_last_name        text,
  p_rep_street           text,
  p_rep_apt              text,
  p_rep_city             text,
  p_rep_state            text,
  p_rep_zip              text,
  p_rep_country          text,
  p_rep_phone            text,
  p_rep_email            text,
  p_appointment_type     text,
  p_org_name             text,
  p_accreditation_number text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  insert into public.representatives (
    admin_id,
    rep_first_name,
    rep_middle_initial,
    rep_last_name,
    rep_street,
    rep_apt,
    rep_city,
    rep_state,
    rep_zip,
    rep_country,
    rep_phone,
    rep_email,
    appointment_type,
    org_name,
    accreditation_number,
    updated_at
  )
  values (
    auth.uid(),
    p_rep_first_name,
    p_rep_middle_initial,
    p_rep_last_name,
    p_rep_street,
    p_rep_apt,
    p_rep_city,
    p_rep_state,
    p_rep_zip,
    p_rep_country,
    p_rep_phone,
    p_rep_email,
    p_appointment_type,
    p_org_name,
    p_accreditation_number,
    now()
  )
  on conflict (admin_id) do update set
    rep_first_name       = excluded.rep_first_name,
    rep_middle_initial   = excluded.rep_middle_initial,
    rep_last_name        = excluded.rep_last_name,
    rep_street           = excluded.rep_street,
    rep_apt              = excluded.rep_apt,
    rep_city             = excluded.rep_city,
    rep_state            = excluded.rep_state,
    rep_zip              = excluded.rep_zip,
    rep_country          = excluded.rep_country,
    rep_phone            = excluded.rep_phone,
    rep_email            = excluded.rep_email,
    appointment_type     = excluded.appointment_type,
    org_name             = excluded.org_name,
    accreditation_number = excluded.accreditation_number,
    updated_at           = now();
end;
$$;

grant execute on function public.get_my_rep_profile() to authenticated;
grant execute on function public.upsert_my_rep_profile(text, text, text, text, text, text, text, text, text, text, text, text, text, text) to authenticated;

-- ────────────────────────────── verification ──────────────────────────────
-- Everything below just REPORTS state; nothing is modified. Expect:
--   tables 4 | rpc functions 9 | owner-update policies 0
select 'tables' as check_name,
       count(*)::text as result
  from information_schema.tables
 where table_schema = 'public'
   and table_name in ('auth_login_throttle', 'client_assignments', 'client_notes', 'representatives');

select 'rpc functions' as check_name,
       count(*)::text as result
  from information_schema.routines
 where routine_schema = 'public'
   and routine_name in ('password_verification_hook', 'claim_client', 'release_client',
                        'get_client_assignments', 'get_client_detail', 'add_client_note',
                        'get_client_notes', 'get_my_rep_profile', 'upsert_my_rep_profile');

select 'form_submissions owner-update policies (want 0)' as check_name,
       count(*)::text as result
  from pg_policies
 where schemaname = 'public'
   and tablename  = 'form_submissions'
   and cmd = 'UPDATE'
   and policyname = 'Users can update own form_submissions';
