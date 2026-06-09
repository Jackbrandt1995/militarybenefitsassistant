-- ============================================================================
-- 013: Account lockout after repeated failed logins.
--
-- Policy: 8 failed password attempts locks the account. A locked user cannot
-- sign in even with the correct password. To regain access they request an
-- unlock; an admin may approve it ONLY after a 3-day cooling-off period, which
-- clears the lockout so the user can reset their password (Forgot Password).
--
-- The failed-attempt counter lives in Postgres (NOT app memory) so it holds
-- across every serverless instance — this is the real defense against
-- distributed credential-stuffing, which a per-instance limiter cannot stop.
-- ============================================================================

create table if not exists public.account_lockouts (
  email              text primary key,          -- always stored lowercased
  failed_count       integer     not null default 0,
  locked_at          timestamptz,               -- non-null = currently locked
  reset_requested_at timestamptz,               -- user asked for an unlock
  approved_at        timestamptz,               -- admin approved (audit)
  approved_by        uuid,                       -- admin who approved (audit)
  updated_at         timestamptz not null default now()
);

-- Lock the table down: only the service role (server login route) and the
-- SECURITY DEFINER admin RPCs below may touch it. With RLS enabled and NO
-- policies, anon/authenticated callers are denied by default.
alter table public.account_lockouts enable row level security;

-- ── Admin: list locked / pending-unlock accounts ────────────────────────────
drop function if exists public.admin_list_lockouts();
create function public.admin_list_lockouts()
returns table (
  email              text,
  failed_count       integer,
  locked_at          timestamptz,
  reset_requested_at timestamptz,
  eligible_at        timestamptz,
  eligible_now       boolean,
  approved_at        timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  return query
    select l.email,
           l.failed_count,
           l.locked_at,
           l.reset_requested_at,
           l.locked_at + interval '3 days'            as eligible_at,
           (now() >= l.locked_at + interval '3 days') as eligible_now,
           l.approved_at
      from public.account_lockouts l
     where l.locked_at is not null
     order by l.locked_at desc;
end;
$$;

-- ── Admin: approve an unlock (allowed only after the 3-day hold) ─────────────
drop function if exists public.admin_approve_lockout_reset(text);
create function public.admin_approve_lockout_reset(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_row   public.account_lockouts;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_row from public.account_lockouts where email = v_email;
  if not found or v_row.locked_at is null then
    return 'not_locked';
  end if;
  if now() < v_row.locked_at + interval '3 days' then
    return 'too_early';
  end if;

  -- Clear the lockout entirely: the user may now sign in and/or reset their
  -- password via the normal Forgot Password flow.
  delete from public.account_lockouts where email = v_email;
  return 'approved';
end;
$$;

grant execute on function public.admin_list_lockouts()              to authenticated;
grant execute on function public.admin_approve_lockout_reset(text)  to authenticated;
