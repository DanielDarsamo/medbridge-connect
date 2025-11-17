import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryCard } from '@/components/CategoryCard';
import { LanguageSelector } from '@/components/LanguageSelector';
import { PhraseCard } from '@/components/PhraseCard';
import { PatientResponseCard } from '@/components/PatientResponseCard';
import { PainScaleCard } from '@/components/PainScaleCard';
import { categories, samplePhrases } from '@/data/samplePhrases';
import { ArrowLeft, Search, Globe, AlertCircle, Volume2, Loader2, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Progress } from '@/components/ui/progress';

type View = 'home' | 'language' | 'category' | 'phrase';

const Index = () => {
  const [view, setView] = useState<View>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLanguageName, setSelectedLanguageName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPhrase, setSelectedPhrase] = useState<string>('');
  const [search, setSearch] = useState('');
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState<string | null>(null);
  const { toast } = useToast();

  const audioPlayer = useAudioPlayer({
    onPlaybackEnd: () => {
      setCurrentPlayingAudio(null);
    },
    onError: (error) => {
      console.error('Audio error:', error);
      setCurrentPlayingAudio(null);
    },
  });

  const handleAudioPlay = (audioUrl: string) => {
    if (currentPlayingAudio === audioUrl) {
      if (audioPlayer.isPlaying) {
        audioPlayer.pause();
      } else if (audioPlayer.isPaused) {
        audioPlayer.resume();
      }
    } else {
      setCurrentPlayingAudio(audioUrl);
      audioPlayer.play(audioUrl);
    }
  };

  const handleLanguageSelect = (code: string, name: string) => {
    setSelectedLanguage(code);
    setSelectedLanguageName(name);
    setView('category');
    toast({
      title: 'Language Selected',
      description: `Now showing verified medical phrases in ${name}`,
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('category');
  };

  const handlePhraseSelect = (phraseId: string) => {
    setSelectedPhrase(phraseId);
    setView('phrase');
  };

  const handleBack = () => {
    if (view === 'phrase') setView('category');
    else if (view === 'category') setView('language');
    else if (view === 'language') setView('home');
  };

  const handlePatientResponse = (type: string) => {
    toast({
      title: 'Response Recorded',
      description: `Patient responded: ${type}`,
    });
  };

  const currentPhrase = samplePhrases.find(p => p.id === selectedPhrase);
  const filteredPhrases = selectedCategory
    ? samplePhrases.filter(p => p.category === selectedCategory)
    : samplePhrases;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {view !== 'home' && (
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MedBridge Translate</h1>
            </div>
            {selectedLanguage && (
              <Badge variant="secondary" className="bg-primary text-white px-4 py-2">
                {selectedLanguageName}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Medical Communication, Simplified
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access verified medical translations in 60+ languages. Offline-ready, HIPAA-compliant, 
                and trusted by healthcare professionals worldwide.
              </p>
            </div>

            <div className="bg-card border-2 border-primary/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Privacy First
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Zero data persistence. No audio or text is stored after your session ends. 
                    All verified phrases are pre-loaded and work completely offline.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setView('language')}
              className="w-full h-16 text-lg font-semibold"
              size="lg"
            >
              Select Language & Start
            </Button>
          </div>
        )}

        {view === 'language' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Select Patient Language
              </h2>
              <p className="text-muted-foreground">
                Choose the language your patient speaks
              </p>
            </div>
            <LanguageSelector
              onSelectLanguage={handleLanguageSelect}
              selectedLanguage={selectedLanguage}
            />
          </div>
        )}

        {view === 'category' && !selectedCategory && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Select Category
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search categories or phrases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          </div>
        )}

        {view === 'category' && selectedCategory && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
            </div>
            <div className="space-y-4">
              {filteredPhrases.map((phrase) => {
                const translation = phrase.translations.find(t => t.languageCode === selectedLanguage);
                const isPlayingThis = currentPlayingAudio === translation?.audioUrl;
                
                return (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    selectedLanguage={selectedLanguage}
                    onClick={() => handlePhraseSelect(phrase.id)}
                    onPlayAudio={handleAudioPlay}
                    isPlayingAudio={isPlayingThis && audioPlayer.isPlaying}
                    isLoadingAudio={isPlayingThis && audioPlayer.isLoading}
                  />
                );
              })}
            </div>
          </div>
        )}

        {view === 'phrase' && currentPhrase && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card border-2 border-primary rounded-lg p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">
                    Provider View (English)
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {currentPhrase.sourceText}
                  </p>
                </div>
                
                <div className="border-t border-border pt-6 space-y-2">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">
                    Patient View ({selectedLanguageName})
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {currentPhrase.translations.find(t => t.languageCode === selectedLanguage)?.text}
                  </p>
                </div>

                {(() => {
                  const translation = currentPhrase.translations.find(t => t.languageCode === selectedLanguage);
                  const isPlayingThis = currentPlayingAudio === translation?.audioUrl;
                  
                  return translation?.audioUrl ? (
                    <div className="space-y-4">
                      <Button 
                        size="lg" 
                        className="w-full md:w-auto gap-2" 
                        variant="secondary"
                        onClick={() => handleAudioPlay(translation.audioUrl!)}
                        disabled={audioPlayer.isLoading && isPlayingThis}
                      >
                        {audioPlayer.isLoading && isPlayingThis ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isPlayingThis && audioPlayer.isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                        {isPlayingThis && audioPlayer.isPlaying ? 'Pause Audio' : 'Play Audio'}
                      </Button>
                      
                      {isPlayingThis && audioPlayer.isPlaying && (
                        <div className="w-full max-w-md mx-auto space-y-2">
                          <Progress value={audioPlayer.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            Playing native speaker audio
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>

            <PatientResponseCard
              onResponse={handlePatientResponse}
              languageCode={selectedLanguage}
            />

            {currentPhrase.category === 'pain' && (
              <PainScaleCard
                onSelect={(level) => handlePatientResponse(`pain level ${level}`)}
                languageCode={selectedLanguage}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
