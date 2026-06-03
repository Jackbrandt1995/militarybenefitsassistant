-- Add tracking_number column to form_submissions
ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS tracking_number text;

-- RPC: admin sets tracking number on a submission
CREATE OR REPLACE FUNCTION public.set_tracking_number(
  p_submission_id uuid,
  p_tracking_number text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.form_submissions
  SET tracking_number = p_tracking_number
  WHERE id = p_submission_id;
END;
$$;

-- Rebuild get_agent_submissions to include tracking_number
CREATE OR REPLACE FUNCTION public.get_agent_submissions()
RETURNS TABLE (
  id                  uuid,
  user_id             uuid,
  form_id             text,
  form_name           text,
  submission_status   text,
  agent_auth_signature text,
  pdf_storage_path    text,
  created_at          timestamptz,
  first_name          text,
  last_name           text,
  email               text,
  tracking_number     text
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
    fs.generated_at   AS created_at,
    p.first_name,
    p.last_name,
    u.email::text,
    fs.tracking_number
  FROM public.form_submissions fs
  LEFT JOIN public.profiles    p ON p.id      = fs.user_id
  LEFT JOIN auth.users         u ON u.id      = fs.user_id
  WHERE fs.agent_filing_requested = true
  ORDER BY fs.generated_at DESC;
END;
$$;
