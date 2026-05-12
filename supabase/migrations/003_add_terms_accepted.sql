-- Add terms acceptance timestamp to profiles
-- Null means the user has not yet accepted the current Terms of Service.
alter table public.profiles
  add column if not exists terms_accepted_at timestamptz;
