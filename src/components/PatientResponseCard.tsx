import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, HelpCircle } from 'lucide-react';

interface PatientResponseCardProps {
  onResponse: (type: 'yes' | 'no' | 'unknown') => void;
  languageCode: string;
}

const RESPONSES = {
  yes: {
    icon: Check,
    color: 'bg-success hover:bg-success/90',
    translations: {
      es: 'Sí',
      fr: 'Oui',
      zh: '是',
      ar: 'نعم',
      de: 'Ja',
      en: 'Yes',
    },
  },
  no: {
    icon: X,
    color: 'bg-destructive hover:bg-destructive/90',
    translations: {
      es: 'No',
      fr: 'Non',
      zh: '不',
      ar: 'لا',
      de: 'Nein',
      en: 'No',
    },
  },
  unknown: {
    icon: HelpCircle,
    color: 'bg-muted hover:bg-muted/90',
    translations: {
      es: 'No sé',
      fr: 'Je ne sais pas',
      zh: '不知道',
      ar: 'لا أعرف',
      de: 'Ich weiß nicht',
      en: 'I don\'t know',
    },
  },
};

export const PatientResponseCard = ({ onResponse, languageCode }: PatientResponseCardProps) => {
  return (
    <Card className="p-6 bg-card border-2 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
        Patient Response
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(RESPONSES).map(([key, config]) => {
          const Icon = config.icon;
          const text = config.translations[languageCode as keyof typeof config.translations] || config.translations.en;
          
          return (
            <Button
              key={key}
              onClick={() => onResponse(key as 'yes' | 'no' | 'unknown')}
              className={`h-24 flex flex-col gap-2 ${config.color} text-white`}
              size="lg"
            >
              <Icon className="h-8 w-8" />
              <span className="text-base font-bold">{text}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
