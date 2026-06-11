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
