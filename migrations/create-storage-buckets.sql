-- Create storage buckets for Haunt Junkies
-- Run this in the Supabase SQL Editor

-- Create review-images bucket (for review logos, social images, and gallery photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  true,
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create mccloud-photos bucket (for McCloud Manor gallery images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mccloud-photos',
  'mccloud-photos',
  true,
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for review-images bucket
-- Allow public read access
CREATE POLICY "Public can view review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

-- Allow authenticated users (admins) to upload
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to update
CREATE POLICY "Authenticated users can update review images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'review-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to delete
CREATE POLICY "Authenticated users can delete review images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'review-images'
  AND auth.role() = 'authenticated'
);

-- Storage policies for mccloud-photos bucket
-- Allow public read access
CREATE POLICY "Public can view mccloud photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'mccloud-photos');

-- Allow authenticated users (admins) to upload
CREATE POLICY "Authenticated users can upload mccloud photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'mccloud-photos'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to update
CREATE POLICY "Authenticated users can update mccloud photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'mccloud-photos'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to delete
CREATE POLICY "Authenticated users can delete mccloud photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'mccloud-photos'
  AND auth.role() = 'authenticated'
);
