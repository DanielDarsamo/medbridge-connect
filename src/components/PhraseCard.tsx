import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, AlertCircle, Loader2, Pause } from 'lucide-react';
import { Phrase } from '@/types/phrase';

interface PhraseCardProps {
  phrase: Phrase;
  selectedLanguage: string;
  onClick: () => void;
  onPlayAudio?: (audioUrl: string) => void;
  isPlayingAudio?: boolean;
  isLoadingAudio?: boolean;
}

export const PhraseCard = ({ 
  phrase, 
  selectedLanguage, 
  onClick,
  onPlayAudio,
  isPlayingAudio,
  isLoadingAudio
}: PhraseCardProps) => {
  const translation = phrase.translations.find(t => t.languageCode === selectedLanguage);

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (translation?.audioUrl && onPlayAudio) {
      onPlayAudio(translation.audioUrl);
    }
  };

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
          {translation?.audioUrl && (
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
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
