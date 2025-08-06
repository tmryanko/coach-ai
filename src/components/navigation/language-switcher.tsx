'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useState, useTransition } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', localName: 'english' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', localName: 'hebrew' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('navigation.languageSwitcher');

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={isPending}
          title={t('switchLanguage')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <span className="sm:hidden">
            {currentLanguage?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            asChild
            className={`cursor-pointer ${
              language.code === locale 
                ? 'bg-accent text-accent-foreground' 
                : ''
            }`}
          >
            <Link
              href={pathname}
              locale={language.code as 'en' | 'he'}
              className="flex items-center justify-between w-full"
              onClick={() => {
                startTransition(() => {
                  // The Link component with locale prop handles the navigation automatically
                });
              }}
            >
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </div>
              {language.code === locale && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}