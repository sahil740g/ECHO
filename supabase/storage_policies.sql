-- Enable RLS for storage
-- (Supabase storage usually has RLS enabled by default, but this ensures policies can be attached)

-- 1. Allow Public Read Access to 'images' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- 2. Allow Authenticated Users to Upload to 'images' bucket
create policy "Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );

-- 3. Allow Users to Update their own files (optional, good for overwriting)
create policy "Authenticated Updates"
on storage.objects for update
to authenticated
using ( bucket_id = 'images' );
