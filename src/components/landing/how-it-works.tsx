import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MessageCircle, Target, TrendingUp, Heart } from "lucide-react";
import { useTranslations } from 'next-intl';

const stepIcons = [User, MessageCircle, Target, TrendingUp, Heart];

export function HowItWorks() {
  const t = useTranslations('howItWorks');
  
  return (
    <div id="how-it-works" className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-gray-950">
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
            {[1, 2, 3, 4, 5].map((stepNum, index) => {
              const Icon = stepIcons[index];
              const stepKey = `step${stepNum}`;
              return (
                <Card key={stepNum} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Step {stepNum}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{t(`${stepKey}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7">
                      {t(`${stepKey}.description`)}
                    </CardDescription>
                  </CardContent>
                  {index < 4 && (
                    <div className="absolute -right-4 top-1/2 hidden transform -translate-y-1/2 lg:block">
                      <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}