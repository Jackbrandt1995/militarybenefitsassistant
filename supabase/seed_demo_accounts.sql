-- ============================================================================
-- Demo account for letting prospective users try the app WITHOUT a password.
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → Run).
--
-- It creates ONE confirmed account with a pre-filled profile and terms already
-- accepted, so the "Try the Demo" button on /login signs in with a single click:
--
--   Demo user:  demo.user@militarybenefitsassistant.com  /  DemoUser2026!
--
-- The login button only appears when NEXT_PUBLIC_ENABLE_DEMO=true (see
-- .env.local.example). If you change the email/password below, set the
-- matching NEXT_PUBLIC_DEMO_USER_* env vars.
--
-- ⚠ There is INTENTIONALLY NO DEMO ADMIN (removed Sept 2026, before real beta
--   testers arrived). A demo admin would be a full admin over ALL real client
--   PII — admin RPCs and storage policies gate on is_admin alone, with no
--   demo-data partition. If a demo admin account still exists from an earlier
--   seed, delete it:
--     delete from auth.users
--      where email = 'demo.admin@militarybenefitsassistant.com';
--   (profiles/submissions cascade via FK.)
--
-- Safe to re-run: uses a fixed UUID and ON CONFLICT guards (idempotent).
-- ============================================================================

-- pgcrypto provides crypt()/gen_salt() for the password hash.
create extension if not exists pgcrypto with schema extensions;

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-0000000d0001';
  user_email   text := 'demo.user@militarybenefitsassistant.com';
  user_pw      text := 'DemoUser2026!';
begin
  -- ── auth.users ────────────────────────────────────────────────────────────
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values
  (
    '00000000-0000-0000-0000-000000000000', demo_user_id, 'authenticated', 'authenticated',
    user_email, extensions.crypt(user_pw, extensions.gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('terms_accepted_at', now()::text),
    now(), now(), '', '', '', ''
  )
  on conflict (id) do update
    set encrypted_password = excluded.encrypted_password,
        email_confirmed_at = excluded.email_confirmed_at,
        raw_user_meta_data = excluded.raw_user_meta_data,
        raw_app_meta_data  = excluded.raw_app_meta_data;

  -- ── auth.identities (required for email/password sign-in) ─────────────────
  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values
  (
    extensions.gen_random_uuid(), demo_user_id::text, demo_user_id,
    jsonb_build_object('sub', demo_user_id::text, 'email', user_email, 'email_verified', true),
    'email', now(), now(), now()
  )
  on conflict (provider_id, provider) do nothing;

  -- ── profiles (the on_auth_user_created trigger inserts id+email; fill demo) ─
  insert into public.profiles (id, email) values
    (demo_user_id, user_email)
  on conflict (id) do nothing;

  update public.profiles set
    first_name = 'Demo', middle_name = 'A', last_name = 'Veteran', suffix = '',
    ssn_encrypted = '111-22-3333',           -- fake test SSN (stored as entered)
    dob = '1985-07-04', sex = 'Male',
    phone_home = '5125550100', phone_mobile = '5125550101',
    address_street = '123 Liberty Ave', address_apt = 'Apt 2B',
    address_city = 'Austin', address_state = 'TX', address_zip = '78701',
    address_country = 'US', va_file_number = '111223333',
    terms_accepted_at = now()
  where id = demo_user_id;

  -- ── one service period so military fields pre-fill in the wizard ───────────
  -- (delete-then-insert keeps this idempotent — service_periods has no natural key)
  delete from public.service_periods where user_id = demo_user_id;
  insert into public.service_periods (user_id, branch, date_entered, date_separated, character_of_discharge, sort_order)
  values
    (demo_user_id, 'Army', '2004-06-01', '2010-06-01', 'Honorable', 0);
end $$;
