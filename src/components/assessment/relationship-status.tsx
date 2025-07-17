import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssessmentData } from '@/types/assessment';

interface RelationshipStatusStepProps {
  data: Partial<AssessmentData>;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const RELATIONSHIP_OPTIONS = [
  { value: 'single', label: 'Single', description: 'Not currently in a relationship' },
  { value: 'dating', label: 'Dating', description: 'In the early stages of dating' },
  { value: 'committed', label: 'In a committed relationship', description: 'Exclusive but not married/partnered' },
  { value: 'engaged', label: 'Engaged', description: 'Engaged to be married' },
  { value: 'married', label: 'Married', description: 'Married or in a civil partnership' },
  { value: 'separated', label: 'Separated', description: 'Taking time apart from partner' },
  { value: 'divorced', label: 'Divorced', description: 'Divorced and looking to improve future relationships' },
  { value: 'widowed', label: 'Widowed', description: 'Lost a partner and ready to move forward' },
  { value: 'complicated', label: 'It&apos;s complicated', description: 'Relationship status is complex' },
];

export function RelationshipStatusStep({ data, onNext, onBack, canGoBack, isLoading }: RelationshipStatusStepProps) {
  const [selectedStatus, setSelectedStatus] = useState(data.relationshipStatus || '');

  const handleNext = () => {
    if (selectedStatus) {
      onNext({ relationshipStatus: selectedStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          What&apos;s your current relationship status?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This helps us provide the most relevant coaching guidance for your situation.
        </p>
      </div>

      <div className="grid gap-3">
        {RELATIONSHIP_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedStatus === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setSelectedStatus(option.value)}
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
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedStatus === option.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`} />
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
          disabled={!selectedStatus || isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}