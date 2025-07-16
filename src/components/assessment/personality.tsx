import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/app/assessment/page';

interface PersonalityStepProps {
  data: Partial<AssessmentData>;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const CONFLICT_STYLES = [
  { value: 'collaborator', label: 'Collaborator', description: 'Work together to find win-win solutions' },
  { value: 'competitor', label: 'Competitor', description: 'Stand firm on important issues' },
  { value: 'accommodator', label: 'Accommodator', description: 'Prefer to keep peace and compromise' },
  { value: 'avoider', label: 'Avoider', description: 'Prefer to cool down before addressing conflicts' },
  { value: 'compromiser', label: 'Compromiser', description: 'Find middle ground solutions' },
];

const LEARNING_PREFERENCES = [
  { value: 'visual', label: 'Visual Learning', description: 'Charts, diagrams, and written materials' },
  { value: 'auditory', label: 'Auditory Learning', description: 'Discussions, podcasts, and verbal instruction' },
  { value: 'kinesthetic', label: 'Hands-on Learning', description: 'Activities, exercises, and practical application' },
  { value: 'reading', label: 'Reading & Writing', description: 'Articles, journaling, and written exercises' },
];

const PRIORITY_OPTIONS = [
  { value: 'family-time', label: 'Quality Family Time' },
  { value: 'career-growth', label: 'Career Growth' },
  { value: 'personal-health', label: 'Personal Health & Fitness' },
  { value: 'financial-security', label: 'Financial Security' },
  { value: 'social-connections', label: 'Social Connections' },
  { value: 'personal-growth', label: 'Personal Development' },
  { value: 'adventure', label: 'Adventure & Travel' },
  { value: 'stability', label: 'Stability & Routine' },
];

export function PersonalityStep({ data, onNext, onBack, canGoBack, isLoading }: PersonalityStepProps) {
  const [introversion, setIntroversion] = useState(data.personalityTraits?.introversion || 3);
  const [empathy, setEmpathy] = useState(data.personalityTraits?.empathy || 3);
  const [conflictStyle, setConflictStyle] = useState(data.personalityTraits?.conflictStyle || '');
  const [learningPreference, setLearningPreference] = useState(data.personalityTraits?.learningPreference || '');
  const [priorities, setPriorities] = useState<string[]>(data.personalityTraits?.priorities || []);

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
          Tell us about your personality & preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This helps us personalize your coaching style and recommendations.
        </p>
      </div>

      {/* Personality Scales */}
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">
            Social Energy: How do you recharge?
          </Label>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Around people (Extroverted)</span>
              <span>Alone time (Introverted)</span>
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
            Empathy Level: How easily do you understand others&apos; emotions?
          </Label>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Logic-focused</span>
              <span>Highly empathetic</span>
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
          How do you typically handle conflicts?
        </Label>
        <div className="grid gap-2 md:grid-cols-2">
          {CONFLICT_STYLES.map((style) => (
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
          How do you prefer to learn new things?
        </Label>
        <div className="grid gap-2 md:grid-cols-2">
          {LEARNING_PREFERENCES.map((pref) => (
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
          What are your top life priorities? (Select up to 3)
        </Label>
        {priorities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {priorities.map(priority => {
              const option = PRIORITY_OPTIONS.find(opt => opt.value === priority);
              return (
                <Badge key={priority} variant="secondary">
                  {option?.label}
                </Badge>
              );
            })}
          </div>
        )}
        <div className="grid gap-2 md:grid-cols-2">
          {PRIORITY_OPTIONS.map((priority) => (
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
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}