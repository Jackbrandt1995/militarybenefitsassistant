-- Add agent filing columns to form_submissions
alter table public.form_submissions
  add column if not exists submission_status text default 'downloaded',
  add column if not exists agent_filing_requested boolean default false,
  add column if not exists agent_auth_signature text,
  add column if not exists pdf_storage_path text;

-- submission_status values:
--   'downloaded'    – user downloaded the PDF, no further action logged
--   'agent_pending' – user authorized MBA to file; awaiting print/mail
--   'agent_mailed'  – MBA staff confirmed the form was mailed

-- Allow users to update their own submission record (needed for agent filing update)
-- (insert/select policies already exist from migration 001)
create policy if not exists "Users can update own form_submissions"
  on public.form_submissions for update
  using (auth.uid() = user_id);
