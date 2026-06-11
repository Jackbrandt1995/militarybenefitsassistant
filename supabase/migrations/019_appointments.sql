-- ============================================================================
-- 019: Appointments — the rep-driven 21-22A data model.
--
-- Each row is one veteran-client's appointment of a rep as their representative,
-- driven by the rep (not the veteran). Pass 1 builds the data model + the rep-side
-- RPCs to draft, send, and list appointments. Pass 2 adds the client-owner
-- SELECT/sign path, the prepare/sign/countersign UI, and PDF generation.
--
-- SECURITY: details_json holds ONLY non-sensitive 21-22A choices (e.g. appointment
-- type, optional authorization opt-ins, limitations). It NEVER holds ssn, bank, or
-- va_file_number — those are pulled from the application-encrypted profile at PDF
-- time in Pass 2. For now all access is via the SECURITY DEFINER, is_admin()-gated
-- RPCs below; rep_admin_id is ALWAYS auth.uid() (never caller-supplied), so a rep
-- only ever touches their own appointments. Follows 016/017 exactly.
-- ============================================================================

create table if not exists public.appointments (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,  -- the veteran client
  rep_admin_id      uuid        not null,   -- the rep's auth.users id (== auth.uid())
  status            text        not null default 'draft'
                      check (status in ('draft', 'sent', 'client_signed', 'completed')),
  details_json      jsonb       not null default '{}'::jsonb,  -- non-sensitive 21-22A choices only
  client_signature  text,
  rep_signature     text,
  client_signed_at  timestamptz,
  countersigned_at  timestamptz,
  submission_id     uuid,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Access only through the SECURITY DEFINER, is_admin()-gated RPCs below.
-- (Pass 2 will add a client-owner SELECT/sign path.)
alter table public.appointments enable row level security;
revoke all on table public.appointments from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- upsert_appointment_draft(p_user_id, p_details) — create or update the calling
-- rep's OPEN DRAFT for a client. One draft per (client, rep): if a draft already
-- exists it is updated; otherwise a new draft is created. Returns the draft id.
-- rep_admin_id is ALWAYS auth.uid().
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.upsert_appointment_draft(uuid, jsonb);
create function public.upsert_appointment_draft(p_user_id uuid, p_details jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  select a.id into v_id
    from public.appointments a
   where a.user_id = p_user_id
     and a.rep_admin_id = auth.uid()
     and a.status = 'draft'
   limit 1;

  if v_id is not null then
    update public.appointments
       set details_json = coalesce(p_details, '{}'::jsonb),
           updated_at   = now()
     where id = v_id;
    return v_id;
  end if;

  insert into public.appointments (user_id, rep_admin_id, status, details_json)
  values (p_user_id, auth.uid(), 'draft', coalesce(p_details, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- send_appointment_for_signature(p_appointment_id) — mark the rep's OWN
-- appointment 'sent' (ready for the client to sign). A rep can only send theirs.
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.send_appointment_for_signature(uuid);
create function public.send_appointment_for_signature(p_appointment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  update public.appointments
     set status     = 'sent',
         updated_at = now()
   where id = p_appointment_id
     and rep_admin_id = auth.uid();
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- get_appointments_for_client(p_user_id) — list appointments for one client,
-- newest first. Does NOT return signatures.
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.get_appointments_for_client(uuid);
create function public.get_appointments_for_client(p_user_id uuid)
returns table (
  id               uuid,
  rep_admin_id     uuid,
  status           text,
  created_at       timestamptz,
  updated_at       timestamptz,
  client_signed_at timestamptz,
  countersigned_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select
      a.id,
      a.rep_admin_id,
      a.status,
      a.created_at,
      a.updated_at,
      a.client_signed_at,
      a.countersigned_at
    from public.appointments a
    where a.user_id = p_user_id
    order by a.created_at desc;
end;
$$;

grant execute on function public.upsert_appointment_draft(uuid, jsonb) to authenticated;
grant execute on function public.send_appointment_for_signature(uuid) to authenticated;
grant execute on function public.get_appointments_for_client(uuid) to authenticated;
