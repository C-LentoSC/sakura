// Language configuration
// To add a new language:
// 1. Create a new JSON file in this folder (e.g., es.json for Spanish)
// 2. Add the language code to the Language type below
// 3. Import the JSON file
// 4. Add it to the translations object

import en from './en.json'; // Use static import
import ja from './ja.json'; // Use static import

export type Language = 'en' | 'ja';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' }
];

export const translations: Record<Language, Record<string, unknown>> = {
  en,
  ja
};

export const defaultLanguage: Language = 'en';
