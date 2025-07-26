import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, localeConfig } from "@/i18n/config";
import { Providers } from "@/components/providers";
import { DirectionProvider } from "@/components/ui/direction-provider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages({ locale });
  
  // Get direction and RTL status from locale config
  const direction = localeConfig[locale as keyof typeof localeConfig]?.dir || 'ltr';
  const isRTL = direction === 'rtl';

  return (
    <html lang={locale} dir={direction} className={isRTL ? 'rtl' : ''}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <DirectionProvider>{children}</DirectionProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
