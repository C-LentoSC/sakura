'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, translations, defaultLanguage, languages } from '../locales/config';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: typeof languages;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage (client only)
  useEffect(() => {
    setIsHydrated(true);
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('sakura-lang') : null;
      if (stored && (['en', 'ja'] as Language[]).includes(stored as Language)) {
        setLanguage(stored as Language);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Setter that also persists to localStorage
  const setLang = (lang: Language) => {
    setLanguage(lang);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('sakura-lang', lang);
      }
    } catch {
      // ignore storage errors
    }
  };

  // Helper function to get nested translation value
  const getNestedTranslation = (obj: Record<string, unknown>, path: string): string => {
    const keys = path.split('.');
    let result: unknown = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key];
      } else {
        return path; // Return the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : path;
  };

  const t = (key: string): string => {
    // Always use default language during SSR and initial render to prevent hydration mismatch
    // The UI will update after hydration with the correct language
    const currentLanguage = !isHydrated ? defaultLanguage : language;
    const result = getNestedTranslation(translations[currentLanguage], key);
    
    // Debug logging (remove in production)
    if (typeof window !== 'undefined' && result === key) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, t, languages, isHydrated }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
