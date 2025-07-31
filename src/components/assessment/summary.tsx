import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';

interface SummaryStepProps {
  data: any;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
  isLastStep: boolean;
}


export function SummaryStep({ data, onNext, onBack, canGoBack, isLoading }: SummaryStepProps) {
  const t = useTranslations('assessment.summary');
  const tGoals = useTranslations('assessment.goals.goalOptions');
  const tChallenges = useTranslations('assessment.challenges.challengeOptions');
  const tComm = useTranslations('assessment.communication.communicationStyles');
  const tStatus = useTranslations('assessment.relationshipStatus.statusOptions');
  const tCommon = useTranslations('common');
  
  const getPersonalityDescription = () => {
    const traits = data.personalityTraits;
    if (!traits) return t('notSpecified');
    
    const socialStyle = traits.introversion <= 2 ? t('personalityValues.extroverted') : traits.introversion >= 4 ? t('personalityValues.introverted') : t('personalityValues.balanced');
    const empathyLevel = traits.empathy <= 2 ? t('personalityValues.logicFocused') : traits.empathy >= 4 ? t('personalityValues.highlyEmpathetic') : t('personalityValues.balancedEmpathy');
    
    return `${socialStyle}, ${empathyLevel}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Relationship Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('relationshipStatusLabel')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">
              {data.relationshipStatus ? tStatus(`${data.relationshipStatus}.label`) : t('notSpecified')}
            </Badge>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('goalsLabel')} ({data.relationshipGoals?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.relationshipGoals?.map((goal: string) => (
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
            <CardTitle className="text-lg">{t('challengesLabel')} ({data.currentChallenges?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.currentChallenges?.map((challenge: string) => (
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
            <CardTitle className="text-lg">{t('communicationStyleLabel')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">
              {data.preferredCommunicationStyle ? tComm(`${data.preferredCommunicationStyle}.label`) : t('notSpecified')}
            </Badge>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('personalityLabel')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">{t('personalityFields.personality')}</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                {getPersonalityDescription()}
              </span>
            </div>
            {data.personalityTraits?.conflictStyle && (
              <div>
                <span className="text-sm font-medium">{t('personalityFields.conflictStyle')}</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {data.personalityTraits.conflictStyle}
                </span>
              </div>
            )}
            {data.personalityTraits?.learningPreference && (
              <div>
                <span className="text-sm font-medium">{t('personalityFields.learningStyle')}</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {data.personalityTraits.learningPreference.replace('-', ' ')}
                </span>
              </div>
            )}
            {data.personalityTraits?.priorities && data.personalityTraits.priorities.length > 0 && (
              <div>
                <span className="text-sm font-medium">{t('personalityFields.lifePriorities')}</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {data.personalityTraits.priorities.map((priority: string) => (
                    <Badge key={priority} variant="outline" className="text-xs">
                      {priority.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          {t('nextSteps.title')}
        </h3>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          {t.raw('nextSteps.items').map((item: string, index: number) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => onBack()}
          disabled={!canGoBack || isLoading}
        >
          {tCommon('back')}
        </Button>
        <Button
          onClick={() => onNext()}
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? t('completingAssessment') : t('completeButton')}
        </Button>
      </div>
    </div>
  );
}