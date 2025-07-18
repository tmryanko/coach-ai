import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain, Shield, Users, Target } from "lucide-react";
import { useTranslations } from 'next-intl';

const differentiatorIcons = [Target, Brain, Users, Zap, Shield];
const differentiatorKeys = ['notGeneric', 'remembers', 'expertBuilt', 'longTerm', 'private'];

export function Differentiators() {
  const t = useTranslations('differentiators');
  
  return (
    <div className="py-20 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {differentiatorKeys.map((key, index) => {
              const Icon = differentiatorIcons[index];
              return (
                <Card key={key} className="relative">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl mt-4">{t(`${key}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7">
                      {t(`${key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}