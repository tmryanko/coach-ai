'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

const getPricingTiers = (t: any) => [
  {
    key: 'free',
    icon: Star,
    buttonVariant: 'outline' as const,
    popular: false
  },
  {
    key: 'monthly',
    icon: Zap,
    buttonVariant: 'default' as const,
    popular: true
  },
  {
    key: 'yearly',
    icon: Crown,
    buttonVariant: 'default' as const,
    popular: false
  }
];

export default function PricingPage() {
  const t = useTranslations('pricing');
  const tNav = useTranslations('navigation');
  const { user } = useAuth();
  
  const pricingTiers = getPricingTiers(t);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
              <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">{t('backToHome')}</Link>
              </Button>
              {!user && (
                <Button asChild>
                  <Link href="/login">{tNav('signIn')}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('mainTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('mainSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier) => {
            const IconComponent = tier.icon;
            const planData = t.raw(`plans.${tier.key}`);
            return (
              <Card 
                key={tier.key}
                className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      {t('mostPopular')}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      tier.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{planData.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {planData.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{planData.price}</span>
                    <span className="text-muted-foreground ml-1">/{planData.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {planData.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {planData.limitations.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">{t('limitations')}</p>
                      <div className="space-y-1">
                        {planData.limitations.map((limitation: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={tier.buttonVariant}
                    size="lg"
                    asChild
                  >
                    <a href={user ? "/dashboard" : "/login"}>
                      {planData.buttonText}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </div>

          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">{t('notSure.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('notSure.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <a href={user ? "/chat" : "/login"}>{t('notSure.tryFree')}</a>
              </Button>
              <Button asChild>
                <a href={user ? "/assessment" : "/login"}>{t('notSure.takeAssessment')}</a>
              </Button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-8">{t('faq.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-medium mb-2">{t('faq.canChange.question')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('faq.canChange.answer')}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">{t('faq.dataSecure.question')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('faq.dataSecure.answer')}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">{t('faq.notSatisfied.question')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('faq.notSatisfied.answer')}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">{t('faq.howWorks.question')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('faq.howWorks.answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}