import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';

interface GoalsStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const GOAL_OPTIONS = [
  { value: 'improve-communication', category: 'communication' },
  { value: 'build-trust', category: 'trust' },
  { value: 'resolve-conflicts', category: 'conflict' },
  { value: 'increase-intimacy', category: 'intimacy' },
  { value: 'work-life-balance', category: 'balance' },
  { value: 'future-planning', category: 'planning' },
  { value: 'family-planning', category: 'family' },
  { value: 'financial-harmony', category: 'finances' },
  { value: 'social-life', category: 'social' },
  { value: 'personal-growth', category: 'growth' },
  { value: 'physical-health', category: 'health' },
  { value: 'spiritual-connection', category: 'spiritual' },
  { value: 'dating-skills', category: 'dating' },
  { value: 'self-confidence', category: 'confidence' },
  { value: 'emotional-intelligence', category: 'emotional' },
];

// Map actual goal IDs to translation keys (removing hyphens)
const getTranslationKey = (goalId: string): string => {
  return goalId.replace(/-/g, '');
};

export function GoalsStep({ data, onNext, onBack, canGoBack, isLoading }: GoalsStepProps) {
  const t = useTranslations('assessment.goals');
  const tCommon = useTranslations('common');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.relationshipGoals || []);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      onNext({ relationshipGoals: selectedGoals });
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

      {selectedGoals.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            {t('selectedGoalsText')} ({selectedGoals.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map(goal => {
              return (
                <Badge key={goal} variant="secondary">
                  {t(`goalOptions.${getTranslationKey(goal)}`)}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {GOAL_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedGoals.includes(option.value)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => toggleGoal(option.value)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {t(`goalOptions.${getTranslationKey(option.value)}`)}
              </span>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedGoals.includes(option.value)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedGoals.includes(option.value) && (
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
          disabled={selectedGoals.length === 0 || isLoading}
        >
          {isLoading ? tCommon('saving') : tCommon('continue')}
        </Button>
      </div>
    </div>
  );
}