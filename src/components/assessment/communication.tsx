import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssessmentData } from '@/app/assessment/page';

interface CommunicationStepProps {
  data: Partial<AssessmentData>;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const COMMUNICATION_STYLES = [
  {
    value: 'direct-honest',
    label: 'Direct & Honest',
    description: 'I prefer straightforward, honest communication even if it might be uncomfortable',
    example: 'Let\'s talk about this issue directly and work through it together'
  },
  {
    value: 'gentle-supportive',
    label: 'Gentle & Supportive',
    description: 'I like warm, encouraging communication that focuses on positive solutions',
    example: 'I understand how you feel, and I\'m here to support you through this'
  },
  {
    value: 'analytical-logical',
    label: 'Analytical & Logical',
    description: 'I prefer fact-based discussions with clear reasoning and practical solutions',
    example: 'Let\'s look at the facts and figure out the most logical approach to solve this'
  },
  {
    value: 'emotional-expressive',
    label: 'Emotional & Expressive',
    description: 'I communicate best when we can share feelings openly and emotionally',
    example: 'I need us to really share how we\'re feeling about this situation'
  },
  {
    value: 'collaborative-democratic',
    label: 'Collaborative & Democratic',
    description: 'I like when we make decisions together and everyone has equal input',
    example: 'What do you think? Let\'s brainstorm solutions together and decide as a team'
  },
  {
    value: 'patient-thoughtful',
    label: 'Patient & Thoughtful',
    description: 'I prefer taking time to think things through before discussing important topics',
    example: 'Can we take some time to think about this and discuss it when we\'re both ready?'
  }
];

export function CommunicationStep({ data, onNext, onBack, canGoBack, isLoading }: CommunicationStepProps) {
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
          How do you prefer to communicate?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Understanding your communication style helps us tailor coaching strategies that work best for you.
        </p>
      </div>

      <div className="space-y-4">
        {COMMUNICATION_STYLES.map((style) => (
          <Card
            key={style.value}
            className={`p-4 cursor-pointer transition-colors border-2 ${
              selectedStyle === style.value
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setSelectedStyle(style.value)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                selectedStyle === style.value
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedStyle === style.value && (
                  <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {style.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {style.description}
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Example approach:</p>
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    &ldquo;{style.example}&rdquo;
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
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedStyle || isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}