-- ============================================================================
-- Grant / revoke admin.
--
-- Admin lives in auth.users.raw_app_meta_data->>'is_admin' (app_metadata), which
-- is writable ONLY by the service role. There is NO in-app way to make someone an
-- admin — a user cannot grant it to themselves or to anyone else through the app.
-- The only way is to run one of these statements in the Supabase SQL editor (which
-- runs with service-role privileges). So: only whoever has Supabase project access
-- can create admins.
--
-- The user must sign out and back in for their JWT to reflect the change.
-- ============================================================================

-- GRANT admin to a user (by email):
update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                           || jsonb_build_object('is_admin', true)
 where lower(email) = lower('person@example.com');

-- REVOKE admin from a user (by email):
-- update auth.users
--    set raw_app_meta_data = raw_app_meta_data - 'is_admin'
--  where lower(email) = lower('person@example.com');

-- LIST current admins:
-- select email from auth.users
--  where coalesce((raw_app_meta_data ->> 'is_admin')::boolean, false) = true;
