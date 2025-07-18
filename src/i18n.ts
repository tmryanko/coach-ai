import { getRequestConfig } from 'next-intl/server';
import { locales } from './i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    return {
      locale: 'en' as const,
      messages: {}
    };
  }

  try {
    return {
      locale: locale as string,
      messages: (await import(`../messages/${locale}.json`)).default
    };
  } catch (error) {
    return {
      locale: 'en' as const,
      messages: {}
    };
  }
});