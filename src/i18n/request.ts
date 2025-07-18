import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Handle undefined locale case
  const validLocales = ['en', 'he'];
  const finalLocale = locale || 'en'; // Default to 'en' if undefined
  
  if (!validLocales.includes(finalLocale)) {
    notFound();
  }

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  } as any;
});
