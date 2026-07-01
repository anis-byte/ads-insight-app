insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'csv-uploads',
  'csv-uploads',
  false,
  5242880,
  array['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "csv_uploads_v1_read" on storage.objects;
create policy "csv_uploads_v1_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'csv-uploads');

drop policy if exists "csv_uploads_v1_insert" on storage.objects;
create policy "csv_uploads_v1_insert"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'csv-uploads');

drop policy if exists "csv_uploads_v1_update" on storage.objects;
create policy "csv_uploads_v1_update"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'csv-uploads')
with check (bucket_id = 'csv-uploads');

drop policy if exists "csv_uploads_v1_delete" on storage.objects;
create policy "csv_uploads_v1_delete"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'csv-uploads');
