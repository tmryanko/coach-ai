'use client';

import { useAuth } from '@/contexts/auth-context';
import { MainNavigation } from '@/components/navigation/main-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  backButtonText = 'Back to Dashboard',
  backButtonHref = '/dashboard'
}: AppLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Coach AI</CardTitle>
            <CardDescription>
              Your personal AI relationship coach. Sign in to get started with personalized coaching programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <a href="/login">Sign In with Google</a>
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
                    <a href={backButtonHref}>{backButtonText}</a>
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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Coach AI</CardTitle>
            <CardDescription>
              Your personal AI relationship coach. Sign in to get started with personalized coaching programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <a href="/login">Sign In with Google</a>
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