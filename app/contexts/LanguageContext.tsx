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

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage || defaultLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage (client only)
  useEffect(() => {
    setIsHydrated(true);
    try {
      // If server provided an initialLanguage (via cookie), do NOT override it
      if (initialLanguage) return;
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('sakura-lang') : null;
      if (stored && (['en', 'ja'] as Language[]).includes(stored as Language)) {
        setLanguage(stored as Language);
      }
    } catch {
      // ignore storage errors
    }
  }, [initialLanguage]);

  // Setter that also persists to localStorage
  const setLang = (lang: Language) => {
    setLanguage(lang);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('sakura-lang', lang);
        // Also persist to cookie so the server can SSR the same language
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `sakura-lang=${lang}; path=/; expires=${expires.toUTCString()}`;
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
      if (result && typeof result === 'object' && result !== null && key in result) {
        result = (result as Record<string, unknown>)[key];
      } else {
        return path; // Return the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : path;
  };

  const t = (key: string): string => {
    if (typeof key !== 'string') {
      console.warn(`Invalid translation key: ${key}`);
      return String(key); // Return the key itself or an empty string
    }
    const result = getNestedTranslation(translations[language], key || '');
    
    // Debug logging (remove in production)
    if (typeof window !== 'undefined' && result === key) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
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
