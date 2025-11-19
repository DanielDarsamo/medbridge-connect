import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping for different languages
const VOICE_MAPPING: Record<string, string> = {
  'es': 'FGY2WhTYpPnrIDTdsKH5', // Laura - Spanish
  'fr': 'XB0fDUnXU5powFXDhCwa', // Charlotte - French
  'de': 'onwK4e9ZLuTAKqWW03F9', // Daniel - German
  'zh': '9BWtsMINqrJLrRacOk9x', // Aria - Mandarin
  'ar': '9BWtsMINqrJLrRacOk9x', // Aria - Arabic
  'default': '9BWtsMINqrJLrRacOk9x', // Aria - Default
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, languageCode, phraseId } = await req.json();

    if (!text || !languageCode || !phraseId) {
      throw new Error('Missing required parameters: text, languageCode, phraseId');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check if TTS already exists in cache
    const { data: existingCache } = await supabase
      .from('tts_audio_cache')
      .select('storage_path')
      .eq('phrase_id', phraseId)
      .eq('language_code', languageCode)
      .single();

    if (existingCache) {
      console.log('TTS cache hit:', existingCache.storage_path);
      return new Response(
        JSON.stringify({ 
          success: true, 
          storagePath: existingCache.storage_path,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select appropriate voice
    const voiceId = VOICE_MAPPING[languageCode] || VOICE_MAPPING['default'];

    console.log('Generating TTS for:', { text, languageCode, phraseId, voiceId });

    // Generate TTS using ElevenLabs
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${elevenLabsResponse.status}`);
    }

    // Get audio as array buffer
    const audioBuffer = await elevenLabsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // Upload to Supabase Storage
    const storagePath = `${languageCode}/${phraseId}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('medical-audio-tts')
      .upload(storagePath, audioBytes, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Save to cache table
    const { error: cacheError } = await supabase
      .from('tts_audio_cache')
      .insert({
        phrase_id: phraseId,
        language_code: languageCode,
        storage_path: storagePath,
        voice_id: voiceId,
        file_size_bytes: audioBytes.length,
      });

    if (cacheError) {
      console.error('Cache insert error:', cacheError);
      throw cacheError;
    }

    console.log('TTS generated and cached successfully:', storagePath);

    return new Response(
      JSON.stringify({ 
        success: true, 
        storagePath,
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-tts function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
