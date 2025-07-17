import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('hero');
  
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
            <br />
            {t('description')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
              <Link href="/login">{t('startFreeCoaching')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
              <Link href="/pricing">{t('viewPricing')}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
              <a href="#how-it-works">{t('learnMore')}</a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}