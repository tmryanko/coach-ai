import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';

interface ChallengesStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const CHALLENGE_OPTIONS = [
  'poor-communication',
  'frequent-arguments',
  'trust-issues',
  'lack-intimacy',
  'different-values',
  'time-management',
  'financial-stress',
  'family-pressure',
  'jealousy',
  'future-uncertainty',
  'social-differences',
  'personal-growth',
  'past-baggage',
  'long-distance',
  'work-stress',
  'commitment-fears',
];

export function ChallengesStep({ data, onNext, onBack, canGoBack, isLoading }: ChallengesStepProps) {
  const t = useTranslations('assessment.challenges');
  const tCommon = useTranslations('common');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(data.currentChallenges || []);

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleNext = () => {
    if (selectedChallenges.length > 0) {
      onNext({ currentChallenges: selectedChallenges });
    }
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

      {selectedChallenges.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">
            {t('selectedChallengesText')} ({selectedChallenges.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedChallenges.map(challenge => (
              <Badge key={challenge} variant="secondary">
                {t(`challengeOptions.${challenge}.label`)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {CHALLENGE_OPTIONS.map((option) => (
          <Card
            key={option}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedChallenges.includes(option)
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => toggleChallenge(option)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {t(`challengeOptions.${option}.label`)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`challengeOptions.${option}.description`)}
                </p>
              </div>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedChallenges.includes(option)
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedChallenges.includes(option) && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack || isLoading}
        >
          {tCommon('back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedChallenges.length === 0 || isLoading}
        >
          {isLoading ? tCommon('saving') : tCommon('continue')}
        </Button>
      </div>
    </div>
  );
}