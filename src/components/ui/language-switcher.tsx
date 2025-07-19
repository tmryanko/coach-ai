"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeConfig } from "@/i18n/config";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);

    // Remove current locale if it exists
    if (segments[0] && locales.includes(segments[0] as any)) {
      segments.shift();
    }

    // Add new locale (unless it's your default locale, if you have one)
    const path = segments.length ? `/${segments.join("/")}` : "/";
    return `/${newLocale}${path === "/" ? "" : path}`;
  };

  const currentLocaleConfig = localeConfig[locale as keyof typeof localeConfig];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLocaleConfig?.flag}</span>
          <span className="hidden sm:inline">{currentLocaleConfig?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => {
          const config = localeConfig[loc];

          return (
            <DropdownMenuItem key={loc} asChild>
              <Link
                href={getLocalizedPath(loc)}
                className={`flex items-center gap-2 w-full ${
                  loc === locale ? "bg-muted" : ""
                }`}
              >
                <span>{config.flag}</span>
                <span>{config.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
