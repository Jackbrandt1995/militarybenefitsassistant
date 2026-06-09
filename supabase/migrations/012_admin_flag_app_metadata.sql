-- ============================================================================
-- 012 — Move the admin flag to app_metadata + add admin storage read policy
--
-- CRITICAL FIX: is_admin was read from raw_user_meta_data (user_metadata), which
-- an authenticated user can write to themselves via auth.updateUser({data:{...}}).
-- That let any user grant themselves admin. The admin flag must live in
-- raw_app_meta_data (app_metadata), which is writable ONLY by the service role,
-- never by the user.
--
-- Also: the form_submissions storage bucket only allowed users to read their OWN
-- folder, so admins couldn't download the agent-filing PDFs. Add an admin read
-- policy gated by is_admin().
--
-- Apply by running this file in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

-- 1. is_admin() now reads app_metadata (NOT user-writable).
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select (au.raw_app_meta_data ->> 'is_admin')::boolean
       from auth.users au
      where au.id = auth.uid()),
    false
  );
$$;

-- 2. Migrate any existing admins: copy the flag from user_metadata to app_metadata.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('is_admin', true)
where coalesce((raw_user_meta_data ->> 'is_admin')::boolean, false) = true;

-- 3. Remove the now-ignored (and user-writable) flag from user_metadata.
update auth.users
set raw_user_meta_data = raw_user_meta_data - 'is_admin'
where raw_user_meta_data ? 'is_admin';

-- 4. Let admins read every submission PDF (needed for the agent-filing download).
drop policy if exists "Admins can read all submission PDFs" on storage.objects;
create policy "Admins can read all submission PDFs"
  on storage.objects for select
  using (bucket_id = 'form_submissions' and public.is_admin());
