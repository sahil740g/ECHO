-- ====================================
-- POST IMAGES STORAGE POLICIES
-- ====================================
-- RLS policies for the 'post-images' storage bucket
-- Bucket must be created manually in Supabase Dashboard

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named 'post-images'
-- 3. Set bucket to PUBLIC (for read access)
-- 4. Run this script to add policies

-- 1. Allow Public Read Access to 'post-images' bucket
CREATE POLICY "Public Read Access Post Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- 2. Allow Authenticated Users to Upload to 'post-images' bucket
CREATE POLICY "Authenticated Upload to Post Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images' AND
  (storage.foldername(name))[1] = auth.uid()::text -- Files organized by user ID
);

-- 3. Allow Users to Delete their own files
CREATE POLICY "Users Delete Own Post Images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
