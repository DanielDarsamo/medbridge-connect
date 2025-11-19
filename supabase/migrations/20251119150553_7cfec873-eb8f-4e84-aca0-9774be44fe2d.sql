-- Create TTS cache table
CREATE TABLE tts_audio_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase_id TEXT NOT NULL,
  language_code TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  file_size_bytes INTEGER,
  UNIQUE(phrase_id, language_code)
);

-- Enable RLS
ALTER TABLE tts_audio_cache ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (TTS cache is public data)
CREATE POLICY "Public read access for TTS cache"
  ON tts_audio_cache
  FOR SELECT
  USING (true);

-- Create storage bucket for TTS audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-audio-tts', 'medical-audio-tts', true);

-- Allow public read access to TTS audio files
CREATE POLICY "Public read access for TTS audio"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'medical-audio-tts');

-- Create index for faster lookups
CREATE INDEX idx_tts_cache_phrase_language ON tts_audio_cache(phrase_id, language_code);