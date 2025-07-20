'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { api } from '@/utils/api';
import { SimpleAppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations('profile');
  const tGoals = useTranslations('assessment.goals.goalOptions');
  const tChallenges = useTranslations('assessment.challenges.challengeOptions');
  const tComm = useTranslations('assessment.communication.communicationStyles');
  const tStatus = useTranslations('assessment.relationshipStatus.statusOptions');
  const tCommon = useTranslations('common');
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = api.assessment.getProfile.useQuery();
  const { data: assessmentStatus } = api.assessment.getStatus.useQuery();

  // If user hasn't completed assessment, redirect to assessment
  if (assessmentStatus && !assessmentStatus.isCompleted) {
    router.push('/assessment');
    return null;
  }

  if (isLoading) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </SimpleAppLayout>
    );
  }

  if (!profile) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">{t('noProfileFound')}</p>
              <Button onClick={() => router.push('/assessment')}>
                {t('completeAssessment')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </SimpleAppLayout>
    );
  }

  const getPersonalityDescription = () => {
    const traits = profile.personalityTraits;
    if (!traits) return t('notSpecified');
    
    const socialStyle = traits.introversion <= 2 ? t('personalityValues.extroverted') : traits.introversion >= 4 ? t('personalityValues.introverted') : t('personalityValues.balanced');
    const empathyLevel = traits.empathy <= 2 ? t('personalityValues.logicFocused') : traits.empathy >= 4 ? t('personalityValues.highlyEmpathetic') : t('personalityValues.balancedEmpathy');
    
    return `${socialStyle}, ${empathyLevel}`;
  };

  return (
    <SimpleAppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>
                  {t('description')}
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push('/assessment?edit=true')}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('editProfile')}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {/* Relationship Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('relationshipStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-sm">
                {profile.relationshipStatus ? tStatus(`${profile.relationshipStatus}.label`) : t('notSpecified')}
              </Badge>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('goals')} ({profile.relationshipGoals?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.relationshipGoals?.map(goal => (
                  <Badge key={goal} variant="secondary">
                    {tGoals(goal)}
                  </Badge>
                )) || <span className="text-gray-500">{t('noGoalsSpecified')}</span>}
              </div>
            </CardContent>
          </Card>

          {/* Challenges */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('challenges')} ({profile.currentChallenges?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.currentChallenges?.map(challenge => (
                  <Badge key={challenge} variant="destructive">
                    {tChallenges(`${challenge}.label`)}
                  </Badge>
                )) || <span className="text-gray-500">{t('noChallengesSpecified')}</span>}
              </div>
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('communicationStyle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">
                {profile.preferredCommunicationStyle ? tComm(`${profile.preferredCommunicationStyle}.label`) : t('notSpecified')}
              </Badge>
            </CardContent>
          </Card>

          {/* Personality */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('personality')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">{t('personalityFields.personality')}</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {getPersonalityDescription()}
                </span>
              </div>
              {profile.personalityTraits?.conflictStyle && (
                <div>
                  <span className="text-sm font-medium">{t('personalityFields.conflictStyle')}</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {profile.personalityTraits.conflictStyle}
                  </span>
                </div>
              )}
              {profile.personalityTraits?.learningPreference && (
                <div>
                  <span className="text-sm font-medium">{t('personalityFields.learningStyle')}</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {profile.personalityTraits.learningPreference.replace('-', ' ')}
                  </span>
                </div>
              )}
              {profile.personalityTraits?.priorities && profile.personalityTraits.priorities.length > 0 && (
                <div>
                  <span className="text-sm font-medium">{t('personalityFields.lifePriorities')}</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {profile.personalityTraits.priorities.map(priority => (
                      <Badge key={priority} variant="outline" className="text-xs">
                        {priority.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Completion Date */}
          {profile.assessmentCompletedAt && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('completedAt')}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(profile.assessmentCompletedAt).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToDashboard')}
          </Button>
        </div>
      </div>
    </SimpleAppLayout>
  );
}