import { Phrase, Category } from '@/types/phrase';

export const categories: Category[] = [
  { id: 'pain', name: 'Pain Assessment', icon: '🩹', phraseCount: 12 },
  { id: 'allergies', name: 'Allergies', icon: '⚠️', phraseCount: 8 },
  { id: 'consent', name: 'Consent', icon: '📋', phraseCount: 10 },
  { id: 'vitals', name: 'Vital Signs', icon: '💓', phraseCount: 15 },
  { id: 'medication', name: 'Medications', icon: '💊', phraseCount: 14 },
  { id: 'emergency', name: 'Emergency', icon: '🚑', phraseCount: 20 },
];

export const samplePhrases: Phrase[] = [
  {
    id: 'pain-001',
    category: 'pain',
    sourceText: 'Where does it hurt?',
    verified: true,
    translations: [
      { language: 'Spanish', languageCode: 'es', text: '¿Dónde le duele?' },
      { language: 'French', languageCode: 'fr', text: 'Où avez-vous mal?' },
      { language: 'Mandarin', languageCode: 'zh', text: '哪里疼?' },
      { language: 'Arabic', languageCode: 'ar', text: 'أين يؤلمك؟' },
      { language: 'German', languageCode: 'de', text: 'Wo tut es weh?' },
    ],
    tags: ['assessment', 'common'],
  },
  {
    id: 'pain-002',
    category: 'pain',
    sourceText: 'On a scale of 1-10, how severe is your pain?',
    verified: true,
    translations: [
      { language: 'Spanish', languageCode: 'es', text: 'En una escala del 1 al 10, ¿qué tan severo es su dolor?' },
      { language: 'French', languageCode: 'fr', text: 'Sur une échelle de 1 à 10, quelle est l\'intensité de votre douleur?' },
      { language: 'Mandarin', languageCode: 'zh', text: '在1到10的范围内，您的疼痛有多严重?' },
      { language: 'Arabic', languageCode: 'ar', text: 'على مقياس من 1 إلى 10، ما مدى شدة ألمك؟' },
      { language: 'German', languageCode: 'de', text: 'Auf einer Skala von 1-10, wie stark sind Ihre Schmerzen?' },
    ],
    tags: ['assessment', 'severity'],
  },
  {
    id: 'allergy-001',
    category: 'allergies',
    sourceText: 'Do you have any allergies?',
    verified: true,
    translations: [
      { language: 'Spanish', languageCode: 'es', text: '¿Tiene alguna alergia?' },
      { language: 'French', languageCode: 'fr', text: 'Avez-vous des allergies?' },
      { language: 'Mandarin', languageCode: 'zh', text: '您有过敏史吗?' },
      { language: 'Arabic', languageCode: 'ar', text: 'هل لديك أي حساسية؟' },
      { language: 'German', languageCode: 'de', text: 'Haben Sie irgendwelche Allergien?' },
    ],
    tags: ['screening', 'critical'],
  },
  {
    id: 'consent-001',
    category: 'consent',
    sourceText: 'I need your consent to proceed with this treatment.',
    verified: true,
    translations: [
      { language: 'Spanish', languageCode: 'es', text: 'Necesito su consentimiento para proceder con este tratamiento.', formalVariant: 'Necesito su consentimiento para proceder con este tratamiento.', informalVariant: 'Necesito tu consentimiento para seguir con este tratamiento.' },
      { language: 'French', languageCode: 'fr', text: 'J\'ai besoin de votre consentement pour procéder à ce traitement.', formalVariant: 'J\'ai besoin de votre consentement pour procéder à ce traitement.', informalVariant: 'J\'ai besoin de ton consentement pour ce traitement.' },
      { language: 'Mandarin', languageCode: 'zh', text: '我需要您的同意才能进行此治疗。' },
      { language: 'Arabic', languageCode: 'ar', text: 'أحتاج إلى موافقتك للمضي قدمًا في هذا العلاج.' },
      { language: 'German', languageCode: 'de', text: 'Ich benötige Ihre Zustimmung, um mit dieser Behandlung fortzufahren.' },
    ],
    tags: ['legal', 'critical'],
  },
  {
    id: 'emergency-001',
    category: 'emergency',
    sourceText: 'This is an emergency. Stay calm.',
    verified: true,
    translations: [
      { language: 'Spanish', languageCode: 'es', text: 'Esto es una emergencia. Mantenga la calma.' },
      { language: 'French', languageCode: 'fr', text: 'C\'est une urgence. Restez calme.' },
      { language: 'Mandarin', languageCode: 'zh', text: '这是紧急情况。请保持冷静。' },
      { language: 'Arabic', languageCode: 'ar', text: 'هذه حالة طارئة. ابق هادئًا.' },
      { language: 'German', languageCode: 'de', text: 'Dies ist ein Notfall. Bleiben Sie ruhig.' },
    ],
    tags: ['urgent', 'reassurance'],
  },
  {
    id: 'vitals-001',
    category: 'vitals',
    sourceText: 'I need to check your blood pressure.',
    verified: true,
    translations: [
      { language: 'Spanish', languageCode: 'es', text: 'Necesito revisar su presión arterial.' },
      { language: 'French', languageCode: 'fr', text: 'Je dois vérifier votre tension artérielle.' },
      { language: 'Mandarin', languageCode: 'zh', text: '我需要检查您的血压。' },
      { language: 'Arabic', languageCode: 'ar', text: 'أحتاج إلى فحص ضغط دمك.' },
      { language: 'German', languageCode: 'de', text: 'Ich muss Ihren Blutdruck messen.' },
    ],
    tags: ['procedure', 'routine'],
  },
];
