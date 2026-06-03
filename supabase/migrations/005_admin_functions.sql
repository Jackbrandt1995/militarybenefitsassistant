-- ─────────────────────────────────────────────────────────────────────────────
-- get_agent_submissions()
-- Returns all agent-filing submissions joined with profile + auth email.
-- security definer so it can read auth.users and bypass RLS.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.get_agent_submissions()
returns table(
  id                   uuid,
  form_id              text,
  form_name            text,
  submission_status    text,
  agent_auth_signature text,
  pdf_storage_path     text,
  created_at           timestamptz,
  user_id              uuid,
  first_name           text,
  last_name            text,
  email                text
)
language plpgsql
security definer
as $$
begin
  return query
  select
    fs.id,
    fs.form_id,
    fs.form_name,
    fs.submission_status,
    fs.agent_auth_signature,
    fs.pdf_storage_path,
    fs.created_at,
    fs.user_id,
    p.first_name,
    p.last_name,
    au.email::text
  from public.form_submissions fs
  left join public.profiles    p  on p.id  = fs.user_id
  left join auth.users         au on au.id = fs.user_id
  where fs.agent_filing_requested = true
  order by fs.created_at desc;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- mark_submission_mailed(p_submission_id uuid)
-- Marks a submission as agent_mailed.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.mark_submission_mailed(p_submission_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.form_submissions
  set submission_status = 'agent_mailed'
  where id = p_submission_id;
end;
$$;
