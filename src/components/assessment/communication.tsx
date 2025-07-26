import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssessmentData } from '@/types/assessment';

interface CommunicationStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const COMMUNICATION_STYLES = [
  'direct-honest',
  'gentle-supportive',
  'analytical-logical',
  'emotional-expressive',
  'collaborative-democratic',
  'patient-thoughtful'
];

export function CommunicationStep({ data, onNext, onBack, canGoBack, isLoading }: CommunicationStepProps) {
  const t = useTranslations('assessment.communication');
  const tCommon = useTranslations('common');
  const [selectedStyle, setSelectedStyle] = useState(data.preferredCommunicationStyle || '');

  const handleNext = () => {
    if (selectedStyle) {
      onNext({ preferredCommunicationStyle: selectedStyle });
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

      <div className="space-y-4">
        {COMMUNICATION_STYLES.map((style) => (
          <Card
            key={style}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedStyle === style
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setSelectedStyle(style)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                selectedStyle === style
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedStyle === style && (
                  <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {t(`communicationStyles.${style}.label`)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {t(`communicationStyles.${style}.description`)}
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('exampleApproach')}</p>
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    &ldquo;{t(`communicationStyles.${style}.example`)}&rdquo;
                  </p>
                </div>
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
          disabled={!selectedStyle || isLoading}
        >
          {isLoading ? tCommon('saving') : tCommon('continue')}
        </Button>
      </div>
    </div>
  );
}