-- Add document_files column to form_submissions
alter table public.form_submissions
add column document_files text[] default '{}';

-- Create storage bucket for form submissions (execute this via Supabase dashboard if not via SQL)
-- insert into storage.buckets (id, name, public) values ('form_submissions', 'form_submissions', false);

-- Storage policy: path is userId/submissionId/filename, users can only access their own
-- Note: storage.foldername returns array; index 1 = first path segment (userId)
create policy "Users can upload documents to their submission"
  on storage.objects for insert with check (
    bucket_id = 'form_submissions'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Users can read their submission documents"
  on storage.objects for select using (
    bucket_id = 'form_submissions'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Users can delete their submission documents"
  on storage.objects for delete using (
    bucket_id = 'form_submissions'
    and auth.uid()::text = split_part(name, '/', 1)
  );
