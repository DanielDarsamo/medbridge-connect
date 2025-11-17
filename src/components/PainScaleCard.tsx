import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PainScaleCardProps {
  onSelect: (level: number) => void;
  languageCode: string;
}

const PAIN_LEVELS = [
  { level: 0, label: 'No Pain', color: 'bg-success', emoji: '😊' },
  { level: 2, label: 'Mild', color: 'bg-success/80', emoji: '🙂' },
  { level: 4, label: 'Moderate', color: 'bg-yellow-500', emoji: '😐' },
  { level: 6, label: 'Severe', color: 'bg-orange-500', emoji: '😣' },
  { level: 8, label: 'Very Severe', color: 'bg-destructive/80', emoji: '😖' },
  { level: 10, label: 'Worst Pain', color: 'bg-destructive', emoji: '😭' },
];

const TRANSLATIONS = {
  title: {
    es: 'Escala de Dolor',
    fr: 'Échelle de Douleur',
    zh: '疼痛等级',
    ar: 'مقياس الألم',
    de: 'Schmerzskala',
    en: 'Pain Scale',
  },
};

export const PainScaleCard = ({ onSelect, languageCode }: PainScaleCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const title = TRANSLATIONS.title[languageCode as keyof typeof TRANSLATIONS.title] || TRANSLATIONS.title.en;

  const handleSelect = (level: number) => {
    setSelected(level);
    onSelect(level);
  };

  return (
    <Card className="p-6 bg-card border-2 border-primary/20">
      <h3 className="text-lg font-semibold mb-6 text-center text-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {PAIN_LEVELS.map((pain) => (
          <Button
            key={pain.level}
            onClick={() => handleSelect(pain.level)}
            className={`h-20 flex flex-col gap-1 ${pain.color} hover:opacity-90 text-white ${
              selected === pain.level ? 'ring-4 ring-primary ring-offset-2' : ''
            }`}
            variant="secondary"
          >
            <span className="text-2xl">{pain.emoji}</span>
            <span className="font-bold text-lg">{pain.level}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
