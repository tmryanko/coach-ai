import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('cta');
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            {t('subtitle')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 w-full sm:w-auto">
              <a href="/login" className="flex items-center justify-center gap-2">
                {t('getStarted')}
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto border-blue-200 text-blue-100 hover:bg-blue-50 hover:text-blue-600">
              <Link href="/pricing">{t('viewAllPlans')}</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}