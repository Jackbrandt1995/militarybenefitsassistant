-- ============================================================================
-- 014: Remove the over-permissive owner UPDATE policy on form_submissions.
--
-- The only legitimate write to a submission AFTER insert is record_agent_filing()
-- (migration 010) — a SECURITY DEFINER RPC that bypasses RLS and scopes to
-- auth.uid(). No client code path updates form_submissions directly. The broad
-- owner UPDATE policy (migration 004) has no WITH CHECK, so it let a user forge
-- their own workflow state on their own rows (e.g. set submission_status to
-- 'agent_mailed'). It is unused by the app, so drop it.
-- ============================================================================

drop policy if exists "Users can update own form_submissions" on public.form_submissions;
