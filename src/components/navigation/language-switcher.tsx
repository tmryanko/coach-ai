'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('navigation.languageSwitcher');

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Replace the current locale in the pathname with the new one
      const segments = pathname.split('/');
      segments[1] = newLocale; // Replace locale segment
      const newPath = segments.join('/');
      
      router.push(newPath);
    });
  };

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
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer flex items-center justify-between ${
              language.code === locale 
                ? 'bg-accent text-accent-foreground' 
                : ''
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </div>
            {language.code === locale && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}