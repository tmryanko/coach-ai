'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from 'next-intl';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const t = useTranslations('faq');

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div id="faq" className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-3xl sm:mt-20 lg:mt-24">
          <div className="space-y-4">
            {faqKeys.map((key, index) => (
              <Card key={key} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t(`${key}.question`)}</CardTitle>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {openItems.includes(index) && (
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-7">
                      {t(`${key}.answer`)}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}