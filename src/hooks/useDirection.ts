import { useLocale } from 'next-intl';
import { localeConfig } from '@/i18n/config';

export function useDirection() {
  const locale = useLocale();
  const direction = localeConfig[locale as keyof typeof localeConfig]?.dir || 'ltr';
  
  return {
    direction,
    isRTL: direction === 'rtl',
    isLTR: direction === 'ltr',
  };
}