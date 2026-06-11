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
