import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onSelectLanguage: (langCode: string, langName: string) => void;
  selectedLanguage?: string;
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
];

export const LanguageSelector = ({ onSelectLanguage, selectedLanguage }: LanguageSelectorProps) => {
  const [search, setSearch] = useState('');

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search languages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredLanguages.map((lang) => (
          <Card
            key={lang.code}
            onClick={() => onSelectLanguage(lang.code, lang.name)}
            className={`p-4 cursor-pointer hover:shadow-md transition-all border-2 ${
              selectedLanguage === lang.code
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">{lang.flag}</span>
              <span className="font-medium text-sm">{lang.name}</span>
            </div>
          </Card>
        ))}
      </div>

      {selectedLanguage && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <Globe className="h-4 w-4" />
          <span>Selected: {LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
        </div>
      )}
    </div>
  );
};
