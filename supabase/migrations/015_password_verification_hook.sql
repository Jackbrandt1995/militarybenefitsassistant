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
