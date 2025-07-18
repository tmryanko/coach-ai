import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Handle undefined locale case
  const validLocales = ['en', 'he'];
  const finalLocale = locale || 'en'; // Default to 'en' if undefined
  
  console.log("Received locale:", locale, "Final locale:", finalLocale);
  
  if (!validLocales.includes(finalLocale)) {
    console.log("Invalid locale detected, calling notFound()");
    notFound();
  }

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  } as any;
});
