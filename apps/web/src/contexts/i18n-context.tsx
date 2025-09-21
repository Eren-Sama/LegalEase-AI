'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// Language configurations
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  da: { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  no: { name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
} as const;

export type SupportedLanguage = keyof typeof languages;

// Basic translations for common UI elements
const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      upload: 'Upload',
      download: 'Download',
      share: 'Share',
      copy: 'Copy',
      copied: 'Copied!',
    },
    navigation: {
      dashboard: 'Dashboard',
      documents: 'Documents',
      analysis: 'Analysis',
      settings: 'Settings',
      help: 'Help',
      signOut: 'Sign Out',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
    },
  },
  // Add more languages as needed
} as const;

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
  isRTL: boolean;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date) => string;
  formatRelativeTime: (date: Date) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  locale: string;
}

export function I18nProvider({ children, locale = 'en' }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    (locale as SupportedLanguage) || 'en'
  );

  const isRTL = currentLanguage === 'ar';

  const setLanguage = useCallback((language: SupportedLanguage) => {
    setCurrentLanguage(language);
    
    // Update document direction for RTL languages
    if (typeof document !== 'undefined') {
      document.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, []);

  // Simple translation function
  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = (translations as any)[currentLanguage] || translations.en;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }, [currentLanguage]);

  const formatNumber = useCallback((number: number): string => {
    return new Intl.NumberFormat(currentLanguage).format(number);
  }, [currentLanguage]);

  const formatCurrency = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency,
    }).format(amount);
  }, [currentLanguage]);

  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }, [currentLanguage]);

  const formatRelativeTime = useCallback((date: Date): string => {
    const rtf = new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' });
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (Math.abs(diffInDays) < 1) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (Math.abs(diffInHours) < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return rtf.format(diffInMinutes, 'minute');
      }
      return rtf.format(diffInHours, 'hour');
    }

    if (Math.abs(diffInDays) < 7) {
      return rtf.format(diffInDays, 'day');
    }

    if (Math.abs(diffInDays) < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return rtf.format(diffInWeeks, 'week');
    }

    if (Math.abs(diffInDays) < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return rtf.format(diffInMonths, 'month');
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return rtf.format(diffInYears, 'year');
  }, [currentLanguage]);

  const value: I18nContextType = {
    currentLanguage,
    setLanguage,
    t,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}