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
