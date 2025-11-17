export interface Translation {
  language: string;
  languageCode: string;
  text: string;
  audioUrl?: string;
  formalVariant?: string;
  informalVariant?: string;
}

export interface Phrase {
  id: string;
  category: string;
  sourceText: string;
  translations: Translation[];
  illustrationUrl?: string;
  verified: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  phraseCount: number;
  color?: string;
}

export interface PatientResponse {
  type: 'yes' | 'no' | 'unknown' | 'pain-scale';
  value?: number;
  timestamp: Date;
}
