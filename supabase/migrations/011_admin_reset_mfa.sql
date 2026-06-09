-- ============================================================================
-- 011 — admin_reset_mfa(email)
--
-- Lets an admin clear a user's enrolled MFA (TOTP) factors when they've lost
-- their authenticator device. The user will be forced to re-enroll on their next
-- login (the protected layout redirects them to /mfa/setup).
--
-- SECURITY DEFINER + an is_admin() guard, consistent with the other admin RPCs.
-- Deletes from auth.mfa_factors (the function owner can access the auth schema).
--
-- Apply by running this file in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

drop function if exists public.admin_reset_mfa(text);
create function public.admin_reset_mfa(p_email text)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_count   integer;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  select id into v_user_id
    from auth.users
   where lower(email) = lower(trim(p_email));

  if v_user_id is null then
    raise exception 'No user found with email %', p_email;
  end if;

  delete from auth.mfa_factors where user_id = v_user_id;
  get diagnostics v_count = row_count;
  return v_count;   -- number of factors removed
end;
$$;
