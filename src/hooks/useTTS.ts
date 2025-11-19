import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTTS = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateTTS = async (
    text: string, 
    languageCode: string, 
    phraseId: string
  ): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: { text, languageCode, phraseId }
      });

      if (error) throw error;

      if (data?.success) {
        const { storagePath, cached } = data;
        
        // Get public URL for the TTS audio
        const { data: { publicUrl } } = supabase.storage
          .from('medical-audio-tts')
          .getPublicUrl(storagePath);

        if (!cached) {
          toast({
            title: "Audio Generated",
            description: "TTS audio has been created and cached.",
          });
        }

        return publicUrl;
      }

      throw new Error('Failed to generate TTS');
    } catch (error) {
      console.error('TTS generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate audio. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateTTS, isGenerating };
};
