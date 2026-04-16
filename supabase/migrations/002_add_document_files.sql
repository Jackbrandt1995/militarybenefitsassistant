-- Add document_files column to form_submissions
alter table public.form_submissions
add column document_files text[] default '{}';

-- Create storage bucket for form submissions (execute this via Supabase dashboard if not via SQL)
-- insert into storage.buckets (id, name, public) values ('form_submissions', 'form_submissions', false);

-- Storage policy: users can only upload/read their own submission files
create policy "Users can upload documents to their submission"
  on storage.objects for insert with check (
    bucket_id = 'form_submissions'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read their submission documents"
  on storage.objects for select using (
    bucket_id = 'form_submissions'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their submission documents"
  on storage.objects for delete using (
    bucket_id = 'form_submissions'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
