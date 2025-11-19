import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, AlertCircle, Loader2, Pause, Sparkles } from 'lucide-react';
import { Phrase } from '@/types/phrase';
import { useTTS } from '@/hooks/useTTS';

interface PhraseCardProps {
  phrase: Phrase;
  selectedLanguage: string;
  onClick: () => void;
  onPlayAudio?: (audioUrl: string) => void;
  isPlayingAudio?: boolean;
  isLoadingAudio?: boolean;
  onTTSGenerated?: (languageCode: string, ttsUrl: string) => void;
}

export const PhraseCard = ({ 
  phrase, 
  selectedLanguage, 
  onClick,
  onPlayAudio,
  isPlayingAudio,
  isLoadingAudio,
  onTTSGenerated
}: PhraseCardProps) => {
  const translation = phrase.translations.find(t => t.languageCode === selectedLanguage);
  const { generateTTS, isGenerating } = useTTS();

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioUrl = translation?.audioUrl || translation?.ttsAudioUrl;
    if (audioUrl && onPlayAudio) {
      onPlayAudio(audioUrl);
    }
  };

  const handleGenerateTTS = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!translation) return;
    
    const ttsUrl = await generateTTS(translation.text, translation.languageCode, phrase.id);
    if (ttsUrl && onTTSGenerated) {
      onTTSGenerated(translation.languageCode, ttsUrl);
    }
  };

  const hasVerifiedAudio = !!translation?.audioUrl;
  const hasTTSAudio = !!translation?.ttsAudioUrl;
  const hasAnyAudio = hasVerifiedAudio || hasTTSAudio;

  return (
    <Card
      onClick={onClick}
      className="p-5 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-base font-medium text-foreground mb-2">
              {phrase.sourceText}
            </p>
            {translation && (
              <p className="text-lg font-semibold text-primary">
                {translation.text}
              </p>
          )}
        </div>
        {hasAnyAudio ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0"
            onClick={handleAudioClick}
            disabled={isLoadingAudio}
          >
            {isLoadingAudio ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlayingAudio ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0"
            onClick={handleGenerateTTS}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {hasVerifiedAudio ? (
          <Badge variant="secondary" className="bg-verified text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified Audio
          </Badge>
        ) : hasTTSAudio ? (
          <Badge variant="secondary" className="bg-warning text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Generated Audio
          </Badge>
        ) : null}
        {phrase.verified ? (
          <Badge variant="secondary" className="bg-verified text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-unverified text-white">
            <AlertCircle className="h-3 w-3 mr-1" />
            AI Translation
          </Badge>
        )}
          {phrase.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
