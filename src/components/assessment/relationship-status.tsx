import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssessmentData } from '@/types/assessment';

interface RelationshipStatusStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const RELATIONSHIP_OPTIONS = [
  'single',
  'dating',
  'committed',
  'engaged',
  'married',
  'separated',
  'divorced',
  'widowed',
  'complicated',
];

export function RelationshipStatusStep({ data, onNext, onBack, canGoBack, isLoading }: RelationshipStatusStepProps) {
  const t = useTranslations('assessment.relationshipStatus');
  const tCommon = useTranslations('common');
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
          {t('title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      <div className="grid gap-3">
        {RELATIONSHIP_OPTIONS.map((option) => (
          <Card
            key={option}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedStatus === option
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setSelectedStatus(option)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {t(`statusOptions.${option}.label`)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`statusOptions.${option}.description`)}
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedStatus === option
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
          {tCommon('back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedStatus || isLoading}
        >
          {isLoading ? tCommon('saving') : tCommon('continue')}
        </Button>
      </div>
    </div>
  );
}