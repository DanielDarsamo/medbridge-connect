-- Create storage bucket for verified medical phrase audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-audio',
  'medical-audio',
  true,
  5242880, -- 5MB limit per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/m4a']
);

-- Enable public access for audio files (read-only)
CREATE POLICY "Public audio files are accessible to everyone"
ON storage.objects
FOR SELECT
USING (bucket_id = 'medical-audio');

-- Only authenticated admins can upload audio (for future admin portal)
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'medical-audio');

-- Only authenticated admins can update audio
CREATE POLICY "Authenticated users can update audio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'medical-audio');

-- Only authenticated admins can delete audio
CREATE POLICY "Authenticated users can delete audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'medical-audio');