-- Add return columns to form_submissions
ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS return_reason  text,
  ADD COLUMN IF NOT EXISTS returned_at    timestamptz;

-- RPC: admin returns a submission to the client for edits
CREATE OR REPLACE FUNCTION public.return_submission_for_edits(
  p_submission_id uuid,
  p_return_reason  text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.form_submissions
  SET
    submission_status = 'agent_returned',
    return_reason     = p_return_reason,
    returned_at       = now()
  WHERE id = p_submission_id;
END;
$$;

-- Rebuild get_agent_submissions to include return fields
DROP FUNCTION IF EXISTS public.get_agent_submissions();

CREATE FUNCTION public.get_agent_submissions()
RETURNS TABLE (
  id                   uuid,
  user_id              uuid,
  form_id              text,
  form_name            text,
  submission_status    text,
  agent_auth_signature text,
  pdf_storage_path     text,
  created_at           timestamptz,
  first_name           text,
  last_name            text,
  email                text,
  tracking_number      text,
  return_reason        text,
  returned_at          timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fs.id,
    fs.user_id,
    fs.form_id,
    fs.form_name,
    fs.submission_status,
    fs.agent_auth_signature,
    fs.pdf_storage_path,
    fs.generated_at     AS created_at,
    p.first_name,
    p.last_name,
    u.email::text,
    fs.tracking_number,
    fs.return_reason,
    fs.returned_at
  FROM public.form_submissions fs
  LEFT JOIN public.profiles    p ON p.id = fs.user_id
  LEFT JOIN auth.users         u ON u.id = fs.user_id
  WHERE fs.agent_filing_requested = true
  ORDER BY fs.generated_at DESC;
END;
$$;
