// Language utilities
export type SupportedLanguage = 
  | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ru' | 'ar' | 'zh' | 'ja'
  | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  ru: 'Русский',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  mr: 'मराठी',
  ta: 'தமிழ்',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  or: 'ଓଡ଼ିଆ'
};

export function getLanguageName(code: SupportedLanguage): string {
  return LANGUAGE_NAMES[code] || code;
}

export function isRTLLanguage(code: SupportedLanguage): boolean {
  return ['ar'].indexOf(code) !== -1;
}

export function detectLanguage(text: string): SupportedLanguage {
  // Simple language detection based on character patterns
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  
  // Default to English for other cases
  return 'en';
}