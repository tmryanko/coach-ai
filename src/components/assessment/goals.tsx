import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';

interface GoalsStepProps {
  data: Partial<AssessmentData>;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const GOAL_OPTIONS = [
  { value: 'improve-communication', label: 'Improve Communication', category: 'communication' },
  { value: 'build-trust', label: 'Build Trust', category: 'trust' },
  { value: 'resolve-conflicts', label: 'Resolve Conflicts Better', category: 'conflict' },
  { value: 'increase-intimacy', label: 'Increase Intimacy', category: 'intimacy' },
  { value: 'work-life-balance', label: 'Better Work-Life Balance', category: 'balance' },
  { value: 'future-planning', label: 'Plan Our Future Together', category: 'planning' },
  { value: 'family-planning', label: 'Navigate Family Planning', category: 'family' },
  { value: 'financial-harmony', label: 'Financial Harmony', category: 'finances' },
  { value: 'social-life', label: 'Improve Social Life Together', category: 'social' },
  { value: 'personal-growth', label: 'Support Each Other&apos;s Growth', category: 'growth' },
  { value: 'physical-health', label: 'Health & Fitness Goals', category: 'health' },
  { value: 'spiritual-connection', label: 'Spiritual Connection', category: 'spiritual' },
  { value: 'dating-skills', label: 'Improve Dating Skills', category: 'dating' },
  { value: 'self-confidence', label: 'Build Self-Confidence', category: 'confidence' },
  { value: 'emotional-intelligence', label: 'Emotional Intelligence', category: 'emotional' },
];

export function GoalsStep({ data, onNext, onBack, canGoBack, isLoading }: GoalsStepProps) {
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
          What are your relationship goals?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select all the areas you&apos;d like to work on. We&apos;ll personalize your coaching accordingly.
        </p>
      </div>

      {selectedGoals.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Selected goals ({selectedGoals.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map(goal => {
              const option = GOAL_OPTIONS.find(opt => opt.value === goal);
              return (
                <Badge key={goal} variant="secondary">
                  {option?.label}
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
                {option.label}
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
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedGoals.length === 0 || isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}