import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/types/assessment';

interface PersonalityStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const getConflictStyles = (t: any) => [
  { value: 'collaborator', label: t('conflictStyles.collaborator.label'), description: t('conflictStyles.collaborator.description') },
  { value: 'competitor', label: t('conflictStyles.competitor.label'), description: t('conflictStyles.competitor.description') },
  { value: 'accommodator', label: t('conflictStyles.accommodator.label'), description: t('conflictStyles.accommodator.description') },
  { value: 'avoider', label: t('conflictStyles.avoider.label'), description: t('conflictStyles.avoider.description') },
  { value: 'compromiser', label: t('conflictStyles.compromiser.label'), description: t('conflictStyles.compromiser.description') },
];

const getLearningPreferences = (t: any) => [
  { value: 'visual', label: t('learningPreferences.visual.label'), description: t('learningPreferences.visual.description') },
  { value: 'auditory', label: t('learningPreferences.auditory.label'), description: t('learningPreferences.auditory.description') },
  { value: 'kinesthetic', label: t('learningPreferences.kinesthetic.label'), description: t('learningPreferences.kinesthetic.description') },
  { value: 'reading', label: t('learningPreferences.reading.label'), description: t('learningPreferences.reading.description') },
];

const getPriorityOptions = (t: any) => [
  { value: 'family-time', label: t('priorityOptions.family-time') },
  { value: 'career-growth', label: t('priorityOptions.career-growth') },
  { value: 'personal-health', label: t('priorityOptions.personal-health') },
  { value: 'financial-security', label: t('priorityOptions.financial-security') },
  { value: 'social-connections', label: t('priorityOptions.social-connections') },
  { value: 'personal-growth', label: t('priorityOptions.personal-growth') },
  { value: 'adventure', label: t('priorityOptions.adventure') },
  { value: 'stability', label: t('priorityOptions.stability') },
];

export function PersonalityStep({ data, onNext, onBack, canGoBack, isLoading }: PersonalityStepProps) {
  const t = useTranslations('assessment.personality');
  const [introversion, setIntroversion] = useState(data.personalityTraits?.introversion || 3);
  const [empathy, setEmpathy] = useState(data.personalityTraits?.empathy || 3);
  const [conflictStyle, setConflictStyle] = useState(data.personalityTraits?.conflictStyle || '');
  const [learningPreference, setLearningPreference] = useState(data.personalityTraits?.learningPreference || '');
  const [priorities, setPriorities] = useState<string[]>(data.personalityTraits?.priorities || []);

  const conflictStyles = getConflictStyles(t);
  const learningPreferences = getLearningPreferences(t);
  const priorityOptions = getPriorityOptions(t);

  const togglePriority = (priority: string) => {
    setPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : prev.length < 3 ? [...prev, priority] : prev
    );
  };

  const handleNext = () => {
    if (conflictStyle && learningPreference && priorities.length > 0) {
      onNext({
        personalityTraits: {
          introversion,
          empathy,
          conflictStyle,
          learningPreference,
          priorities,
        }
      });
    }
  };

  const isFormValid = conflictStyle && learningPreference && priorities.length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      {/* Personality Scales */}
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">
            {t('socialEnergyLabel')}
          </Label>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{t('socialEnergyLabels.extroverted')}</span>
              <span>{t('socialEnergyLabels.introverted')}</span>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setIntroversion(value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    introversion === value
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">
            {t('empathyLabel')}
          </Label>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{t('empathyLabels.logicFocused')}</span>
              <span>{t('empathyLabels.highlyEmpathetic')}</span>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setEmpathy(value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    empathy === value
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Style */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          {t('conflictStyleLabel')}
        </Label>
        <div className="grid gap-2 md:grid-cols-2">
          {conflictStyles.map((style) => (
            <Card
              key={style.value}
              className={`p-3 cursor-pointer transition-colors border-2 ${
                conflictStyle === style.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => setConflictStyle(style.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{style.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  conflictStyle === style.value ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Preference */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          {t('learningPreferenceLabel')}
        </Label>
        <div className="grid gap-2 md:grid-cols-2">
          {learningPreferences.map((pref) => (
            <Card
              key={pref.value}
              className={`p-3 cursor-pointer transition-colors border-2 ${
                learningPreference === pref.value
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => setLearningPreference(pref.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{pref.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{pref.description}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  learningPreference === pref.value ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Life Priorities */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          {t('prioritiesLabel')}
        </Label>
        {priorities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {priorities.map(priority => {
              const option = priorityOptions.find(opt => opt.value === priority);
              return (
                <Badge key={priority} variant="secondary">
                  {option?.label}
                </Badge>
              );
            })}
          </div>
        )}
        <div className="grid gap-2 md:grid-cols-2">
          {priorityOptions.map((priority) => (
            <Card
              key={priority.value}
              className={`p-3 cursor-pointer transition-colors border-2 ${
                priorities.includes(priority.value)
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : priorities.length >= 3
                  ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => priorities.length < 3 || priorities.includes(priority.value) ? togglePriority(priority.value) : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{priority.label}</span>
                <div className={`w-3 h-3 rounded ${
                  priorities.includes(priority.value) ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack || isLoading}
        >
          {t('buttons.back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? t('buttons.saving') : t('buttons.continue')}
        </Button>
      </div>
    </div>
  );
}