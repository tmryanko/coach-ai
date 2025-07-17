export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeConfig = {
  en: {
    label: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
  },
  he: {
    label: 'עברית',
    dir: 'rtl',
    flag: '🇮🇱',
  },
} as const;