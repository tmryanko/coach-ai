'use client';

import { useTranslations } from 'next-intl';
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const { user } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = api.assessment.getProfile.useQuery();
  const { data: userProfile } = api.user.getProfile.useQuery();
  const { data: progress } = api.user.getProgress.useQuery();

  // Check if user has completed assessment
  useEffect(() => {
    if (!profileLoading && !profile && user) {
      router.push('/assessment');
    }
  }, [profile, profileLoading, user, router]);

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">{t('loading')}</div>
        </div>
      </AppLayout>
    );
  }

  const getWelcomeMessage = () => {
    if (profile?.relationshipStatus === 'single') {
      return t('welcomeMessages.single');
    } else if (profile?.relationshipStatus === 'dating') {
      return t('welcomeMessages.dating');
    } else if (['committed', 'engaged', 'married'].includes(profile?.relationshipStatus || '')) {
      return t('welcomeMessages.committed');
    }
    return t('welcomeMessages.default');
  };

  const getPrimaryGoal = () => {
    if (profile?.relationshipGoals && profile.relationshipGoals.length > 0) {
      const goalKey = profile.relationshipGoals[0] as keyof typeof t.raw('goalLabels');
      return t(`goalLabels.${goalKey}`) || t('goalLabels.default');
    }
    return t('goalLabels.default');
  };

  return (
    <AppLayout 
      title={t('welcomeBack', { name: userProfile?.name || user?.user_metadata?.name || 'there' })}
      description={getWelcomeMessage()}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('sections.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('progressLabels.programsStarted')}</span>
                  <span className="font-medium">{progress?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('progressLabels.primaryGoal')}</span>
                  <span className="font-medium text-sm capitalize">{getPrimaryGoal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('progressLabels.challenges')}</span>
                  <span className="font-medium">{profile?.currentChallenges?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('sections.style')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('progressLabels.communication')}</span>
                  <p className="text-sm font-medium capitalize">
                    {profile?.preferredCommunicationStyle?.replace('-', ' ') || t('progressLabels.notSet')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('progressLabels.learning')}</span>
                  <p className="text-sm font-medium capitalize">
                    {(profile?.personalityTraits as any)?.learningPreference?.replace('-', ' ') || t('progressLabels.notSet')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('sections.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full" size="sm">
                  <Link href="/chat">{t('buttons.startCoaching')}</Link>
                </Button>
                <Button asChild className="w-full" variant="outline" size="sm">
                  <Link href="/assessment">{t('buttons.updateProfile')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.recommendedPrograms')}</CardTitle>
              <CardDescription>
                {t('programs.basedOnGoals', { goal: getPrimaryGoal() })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile?.relationshipGoals?.includes('improve-communication') && (
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">{t('programs.communicationMastery.title')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('programs.communicationMastery.description')}</p>
                    <Button size="sm" className="mt-2">{t('buttons.startProgram')}</Button>
                  </div>
                )}
                {profile?.relationshipGoals?.includes('build-trust') && (
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">{t('programs.trustBuilding.title')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('programs.trustBuilding.description')}</p>
                    <Button size="sm" className="mt-2">{t('buttons.startProgram')}</Button>
                  </div>
                )}
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">{t('programs.relationshipFoundations.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('programs.relationshipFoundations.description')}</p>
                  <Button size="sm" className="mt-2">{t('buttons.startProgram')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.yourAiCoach')}</CardTitle>
              <CardDescription>
                {t('coachingStyles.personalizedGuidance')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {t('coachingStyles.title')}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {profile?.preferredCommunicationStyle === 'direct-honest' && 
                      t('coachingStyles.direct-honest')}
                    {profile?.preferredCommunicationStyle === 'gentle-supportive' && 
                      t('coachingStyles.gentle-supportive')}
                    {profile?.preferredCommunicationStyle === 'analytical-logical' && 
                      t('coachingStyles.analytical-logical')}
                    {profile?.preferredCommunicationStyle === 'emotional-expressive' && 
                      t('coachingStyles.emotional-expressive')}
                    {!profile?.preferredCommunicationStyle && 
                      t('coachingStyles.notComplete')}
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/chat">{t('buttons.startCoachingChat')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}