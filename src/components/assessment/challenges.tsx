import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';

interface ChallengesStepProps {
  data: Partial<AssessmentData>;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const CHALLENGE_OPTIONS = [
  { value: 'poor-communication', label: 'Poor Communication', description: 'We don\'t communicate well' },
  { value: 'frequent-arguments', label: 'Frequent Arguments', description: 'We argue too often' },
  { value: 'trust-issues', label: 'Trust Issues', description: 'Lack of trust between us' },
  { value: 'lack-intimacy', label: 'Lack of Intimacy', description: 'Physical or emotional distance' },
  { value: 'different-values', label: 'Different Values', description: 'We have conflicting values' },
  { value: 'time-management', label: 'Time Management', description: 'Struggling to spend quality time together' },
  { value: 'financial-stress', label: 'Financial Stress', description: 'Money causes tension' },
  { value: 'family-pressure', label: 'Family Pressure', description: 'External family influences' },
  { value: 'jealousy', label: 'Jealousy Issues', description: 'Jealousy is affecting our relationship' },
  { value: 'future-uncertainty', label: 'Future Uncertainty', description: 'Unclear about our future together' },
  { value: 'social-differences', label: 'Social Differences', description: 'Different social needs and preferences' },
  { value: 'personal-growth', label: 'Personal Growth Gaps', description: 'Growing at different rates' },
  { value: 'past-baggage', label: 'Past Relationship Baggage', description: 'Previous experiences affecting us' },
  { value: 'long-distance', label: 'Long Distance', description: 'Physical distance challenges' },
  { value: 'work-stress', label: 'Work-Related Stress', description: 'Career pressures affecting relationship' },
  { value: 'commitment-fears', label: 'Commitment Fears', description: 'Anxiety about commitment level' },
];

export function ChallengesStep({ data, onNext, onBack, canGoBack, isLoading }: ChallengesStepProps) {
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
          What challenges are you currently facing?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select the areas where you&apos;d like support. Being honest helps us provide better guidance.
        </p>
      </div>

      {selectedChallenges.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">
            Selected challenges ({selectedChallenges.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedChallenges.map(challenge => {
              const option = CHALLENGE_OPTIONS.find(opt => opt.value === challenge);
              return (
                <Badge key={challenge} variant="secondary">
                  {option?.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {CHALLENGE_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedChallenges.includes(option.value)
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => toggleChallenge(option.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedChallenges.includes(option.value)
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedChallenges.includes(option.value) && (
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
          disabled={selectedChallenges.length === 0 || isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}