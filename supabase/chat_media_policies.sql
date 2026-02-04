-- ====================================
-- CHAT MEDIA STORAGE POLICIES
-- ====================================
-- RLS policies for the 'chat-media' storage bucket
-- Bucket must be created manually in Supabase Dashboard

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named 'chat-media'
-- 3. Set bucket to PUBLIC (for read access)
-- 4. Run this script to add policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload to Chat Media" ON storage.objects;
DROP POLICY IF EXISTS "Users Delete Own Chat Media" ON storage.objects;

-- 1. Allow Public Read Access to 'chat-media' bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-media');

-- 2. Allow Authenticated Users to Upload to 'chat-media' bucket
CREATE POLICY "Authenticated Upload to Chat Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-media' AND
  (storage.foldername(name))[1] = auth.uid()::text -- Files organized by user ID
);

-- 3. Allow Users to Delete their own files
CREATE POLICY "Users Delete Own Chat Media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow Users to Update their own files (for overwrites)
CREATE POLICY "Users Update Own Chat Media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
