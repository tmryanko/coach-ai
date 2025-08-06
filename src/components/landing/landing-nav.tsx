import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export function LandingNav() {
  const t = useTranslations('navigation');
  
  return (
    <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Coach AI
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('howItWorks')}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('pricing')}
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('faq')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">{t('signIn')}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">{t('getStarted')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}