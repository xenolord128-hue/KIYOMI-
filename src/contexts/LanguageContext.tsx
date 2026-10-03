import React, { createContext, useContext, useState } from 'react';

export type Locale = 'en';

interface LanguageContextType {
  locale: Locale;
  toggleLanguage: () => void;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale] = useState<Locale>('en');

  const toggleLanguage = () => {};
  const setLocale = () => {};

  const t = (key: string, fallback?: string): string => {
    if (!key) return "";
    const cleanKey = key.trim();
    // If slash-separated dual labels, return the English part before the slash
    if (cleanKey.includes(" / ")) {
      const parts = cleanKey.split(" / ");
      return parts[0].trim();
    }
    return cleanKey;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
