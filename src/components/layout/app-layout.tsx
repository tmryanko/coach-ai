'use client';

import { useAuth } from '@/contexts/auth-context';
import { MainNavigation } from '@/components/navigation/main-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export function AppLayout({ 
  children, 
  title, 
  description, 
  showBackButton = false,
  backButtonText,
  backButtonHref = '/dashboard'
}: AppLayoutProps) {
  const t = useTranslations('appLayout');
  const { user, loading } = useAuth();
  const defaultBackButtonText = t('backToDashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('welcome')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/login">{t('signInWithGoogle')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <main className="flex-1">
        {(title || description || showBackButton) && (
          <div className="border-b">
            <div className="container py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {title && (
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
                {showBackButton && (
                  <Button variant="outline" asChild>
                    <Link href={backButtonHref}>{backButtonText || defaultBackButtonText}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Wrapper for pages that need a simpler layout (like assessment)
export function SimpleAppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('appLayout');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('welcome')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/login">{t('signInWithGoogle')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
