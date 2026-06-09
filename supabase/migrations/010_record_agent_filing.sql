-- ============================================================================
-- 010 — record_agent_filing()  (fix #4: missing RPC that broke agent filing)
--
-- The complete page calls supabase.rpc('record_agent_filing', …) when a veteran
-- authorizes MBA to file on their behalf, but the function was never defined, so
-- the authorize step errored out and agent filing did not work.
--
-- This records the authorization on the user's OWN submission. The caller's
-- identity is taken from auth.uid() (the p_user_id argument is accepted for the
-- existing client call signature but is NOT trusted), so a user can never record
-- a filing against someone else's submission.
--
-- Apply with `supabase db push` or by running this file in the SQL editor.
-- ============================================================================

create or replace function public.record_agent_filing(
  p_submission_id        uuid,
  p_user_id              uuid,   -- accepted for call-signature compatibility; NOT trusted
  p_agent_auth_signature text,
  p_pdf_storage_path     text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.form_submissions
  set agent_filing_requested = true,
      agent_auth_signature   = p_agent_auth_signature,
      pdf_storage_path       = p_pdf_storage_path,
      submission_status      = 'agent_pending'
  where id = p_submission_id
    and user_id = auth.uid();   -- only the owner can record their own filing

  if not found then
    raise exception 'Submission not found or not owned by caller'
      using errcode = '42501';
  end if;
end;
$$;
