-- ============================================================================
-- Demo accounts for letting prospective users try the app WITHOUT a password.
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → Run).
--
-- It creates two confirmed accounts with pre-filled profiles and terms already
-- accepted, so the "Demo as User" / "Demo as Admin" buttons on /login sign in
-- with a single click:
--
--   Demo user :  demo.user@militarybenefitsassistant.com   /  DemoUser2026!
--   Demo admin:  demo.admin@militarybenefitsassistant.com  /  DemoAdmin2026!
--
-- The login buttons only appear when NEXT_PUBLIC_ENABLE_DEMO=true (see
-- .env.local.example). If you change the emails/passwords below, set the
-- matching NEXT_PUBLIC_DEMO_* env vars.
--
-- ⚠ SECURITY: The Admin demo opens the admin panel, which lists REAL agent-
--   filing submissions. Only enable demo mode (and seed the admin account) on a
--   demo/staging project that has NO real customer data — never on production.
--
-- Safe to re-run: uses fixed UUIDs and ON CONFLICT guards (idempotent).
-- ============================================================================

-- pgcrypto provides crypt()/gen_salt() for the password hash.
create extension if not exists pgcrypto with schema extensions;

do $$
declare
  demo_user_id  uuid := '00000000-0000-0000-0000-0000000d0001';
  demo_admin_id uuid := '00000000-0000-0000-0000-0000000d0002';
  user_email    text := 'demo.user@militarybenefitsassistant.com';
  admin_email   text := 'demo.admin@militarybenefitsassistant.com';
  user_pw       text := 'DemoUser2026!';
  admin_pw      text := 'DemoAdmin2026!';
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
  ),
  (
    '00000000-0000-0000-0000-000000000000', demo_admin_id, 'authenticated', 'authenticated',
    admin_email, extensions.crypt(admin_pw, extensions.gen_salt('bf')),
    now(),
    -- is_admin lives in app_metadata (service-role-only; NOT user-writable)
    '{"provider":"email","providers":["email"],"is_admin":true}'::jsonb,
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
  ),
  (
    extensions.gen_random_uuid(), demo_admin_id::text, demo_admin_id,
    jsonb_build_object('sub', demo_admin_id::text, 'email', admin_email, 'email_verified', true),
    'email', now(), now(), now()
  )
  on conflict (provider_id, provider) do nothing;

  -- ── profiles (the on_auth_user_created trigger inserts id+email; fill demo) ─
  insert into public.profiles (id, email) values
    (demo_user_id, user_email), (demo_admin_id, admin_email)
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

  update public.profiles set
    first_name = 'Demo', middle_name = 'B', last_name = 'Admin', suffix = '',
    ssn_encrypted = '444-55-6666',           -- fake test SSN
    dob = '1980-01-15', sex = 'Female',
    phone_home = '5125550200', phone_mobile = '5125550201',
    address_street = '500 Mission Blvd', address_apt = '',
    address_city = 'San Antonio', address_state = 'TX', address_zip = '78205',
    address_country = 'US', va_file_number = '444556666',
    terms_accepted_at = now()
  where id = demo_admin_id;

  -- ── one service period each so military fields pre-fill in the wizard ──────
  -- (delete-then-insert keeps this idempotent — service_periods has no natural key)
  delete from public.service_periods where user_id in (demo_user_id, demo_admin_id);
  insert into public.service_periods (user_id, branch, date_entered, date_separated, character_of_discharge, sort_order)
  values
    (demo_user_id,  'Army', '2004-06-01', '2010-06-01', 'Honorable', 0),
    (demo_admin_id, 'Navy', '1999-09-01', '2007-09-01', 'Honorable', 0);
end $$;
