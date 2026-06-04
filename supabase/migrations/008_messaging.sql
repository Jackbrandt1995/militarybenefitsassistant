-- Messaging table for submission threads
CREATE TABLE IF NOT EXISTS public.submission_messages (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  sender_type   text NOT NULL CHECK (sender_type IN ('admin', 'client')),
  message       text NOT NULL,
  created_at    timestamptz DEFAULT now(),
  is_read       boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_sub_messages_sub_id ON public.submission_messages(submission_id);
CREATE INDEX IF NOT EXISTS idx_sub_messages_unread ON public.submission_messages(submission_id, sender_type, is_read);

ALTER TABLE public.submission_messages ENABLE ROW LEVEL SECURITY;

-- Clients can read messages for their own submissions
DROP POLICY IF EXISTS "clients_read_own_messages" ON public.submission_messages;
CREATE POLICY "clients_read_own_messages" ON public.submission_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.form_submissions fs
      WHERE fs.id = submission_messages.submission_id
        AND fs.user_id = auth.uid()
    )
  );

-- Clients can insert messages (as 'client' only) for their own submissions
DROP POLICY IF EXISTS "clients_insert_messages" ON public.submission_messages;
CREATE POLICY "clients_insert_messages" ON public.submission_messages
  FOR INSERT WITH CHECK (
    sender_type = 'client' AND
    EXISTS (
      SELECT 1 FROM public.form_submissions fs
      WHERE fs.id = submission_messages.submission_id
        AND fs.user_id = auth.uid()
    )
  );

-- Admin: get messages and mark client messages as read
CREATE OR REPLACE FUNCTION public.admin_get_messages(p_submission_id uuid)
RETURNS TABLE (
  id            uuid,
  submission_id uuid,
  sender_type   text,
  message       text,
  created_at    timestamptz,
  is_read       boolean
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.submission_messages
     SET is_read = true
   WHERE submission_id = p_submission_id AND sender_type = 'client';

  RETURN QUERY
  SELECT sm.id, sm.submission_id, sm.sender_type, sm.message, sm.created_at, sm.is_read
    FROM public.submission_messages sm
   WHERE sm.submission_id = p_submission_id
   ORDER BY sm.created_at ASC;
END;
$$;

-- Admin: send a message
CREATE OR REPLACE FUNCTION public.admin_send_message(
  p_submission_id uuid,
  p_message       text
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.submission_messages (submission_id, sender_type, message)
  VALUES (p_submission_id, 'admin', p_message)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Unread client-message counts per submission (for admin badge)
CREATE OR REPLACE FUNCTION public.get_unread_message_counts()
RETURNS TABLE (submission_id uuid, unread_count bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
  SELECT sm.submission_id, COUNT(*) AS unread_count
    FROM public.submission_messages sm
   WHERE sm.sender_type = 'client' AND sm.is_read = false
   GROUP BY sm.submission_id;
END;
$$;
