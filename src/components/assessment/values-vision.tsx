'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ValuesVisionData } from '@/types/assessment';
import { Compass, Heart, Target, AlertTriangle, ArrowRight } from 'lucide-react';

interface ValuesVisionStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const CORE_VALUES = [
  { value: 'honesty', label: 'Honesty & Authenticity', icon: '💎', description: 'Being genuine and truthful' },
  { value: 'loyalty', label: 'Loyalty & Commitment', icon: '🤝', description: 'Staying dedicated through challenges' },
  { value: 'respect', label: 'Mutual Respect', icon: '🙏', description: 'Valuing each other\'s boundaries' },
  { value: 'communication', label: 'Open Communication', icon: '💬', description: 'Sharing thoughts and feelings freely' },
  { value: 'trust', label: 'Trust & Reliability', icon: '🔒', description: 'Being dependable and trustworthy' },
  { value: 'independence', label: 'Independence', icon: '🦋', description: 'Maintaining individual identity' },
  { value: 'family', label: 'Family & Togetherness', icon: '👨‍👩‍👧‍👦', description: 'Prioritizing family bonds' },
  { value: 'adventure', label: 'Adventure & Growth', icon: '🌟', description: 'Exploring life together' },
  { value: 'stability', label: 'Stability & Security', icon: '🏠', description: 'Creating a safe foundation' },
  { value: 'passion', label: 'Passion & Romance', icon: '🔥', description: 'Maintaining spark and intimacy' },
  { value: 'humor', label: 'Humor & Playfulness', icon: '😄', description: 'Laughing and enjoying life' },
  { value: 'spirituality', label: 'Spiritual Connection', icon: '🕯️', description: 'Sharing deeper meaning' },
  { value: 'equality', label: 'Equality & Partnership', icon: '⚖️', description: 'Being equal partners' },
  { value: 'ambition', label: 'Shared Ambition', icon: '🎯', description: 'Supporting each other\'s goals' },
  { value: 'kindness', label: 'Kindness & Compassion', icon: '💕', description: 'Treating each other with care' },
];

const LIFE_PRIORITIES = [
  { value: 'career-success', label: 'Career Success', icon: '💼' },
  { value: 'family-time', label: 'Quality Family Time', icon: '👨‍👩‍👧‍👦' },
  { value: 'personal-growth', label: 'Personal Development', icon: '🌱' },
  { value: 'health-fitness', label: 'Health & Fitness', icon: '💪' },
  { value: 'financial-security', label: 'Financial Security', icon: '💰' },
  { value: 'travel-adventure', label: 'Travel & Adventure', icon: '✈️' },
  { value: 'social-connections', label: 'Social Relationships', icon: '👥' },
  { value: 'creativity', label: 'Creative Expression', icon: '🎨' },
  { value: 'learning', label: 'Continuous Learning', icon: '📚' },
  { value: 'community-service', label: 'Community Service', icon: '🤲' },
  { value: 'spiritual-practice', label: 'Spiritual Practice', icon: '🧘' },
  { value: 'work-life-balance', label: 'Work-Life Balance', icon: '⚖️' },
];

const DEAL_BREAKERS = [
  { value: 'dishonesty', label: 'Dishonesty or lying', icon: '🚫' },
  { value: 'disrespect', label: 'Disrespectful behavior', icon: '❌' },
  { value: 'infidelity', label: 'Cheating or infidelity', icon: '💔' },
  { value: 'abuse', label: 'Any form of abuse', icon: '🛑' },
  { value: 'addiction', label: 'Substance abuse problems', icon: '🚫' },
  { value: 'different-values', label: 'Fundamentally different values', icon: '🔀' },
  { value: 'no-commitment', label: 'Fear of commitment', icon: '🏃‍♂️' },
  { value: 'poor-communication', label: 'Unwillingness to communicate', icon: '🤐' },
  { value: 'different-goals', label: 'Incompatible life goals', icon: '↔️' },
  { value: 'financial-irresponsibility', label: 'Financial irresponsibility', icon: '💸' },
  { value: 'no-growth', label: 'Unwillingness to grow', icon: '🚧' },
  { value: 'jealousy', label: 'Extreme jealousy or possessiveness', icon: '👁️' },
];

export function ValuesVisionStep({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading 
}: ValuesVisionStepProps) {
  const t = useTranslations('assessment.valuesVision');
  const [coreValues, setCoreValues] = useState<string[]>(data.coreValues || []);
  const [relationshipVision, setRelationshipVision] = useState(data.relationshipVision || '');
  const [lifePriorities, setLifePriorities] = useState<string[]>(data.lifePriorities || []);
  const [dealBreakers, setDealBreakers] = useState<string[]>(data.dealBreakers || []);

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, value: string, maxItems: number) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else if (array.length < maxItems) {
      setArray([...array, value]);
    }
  };

  const handleNext = () => {
    const valuesData: ValuesVisionData = {
      coreValues,
      relationshipVision: relationshipVision.trim(),
      lifePriorities,
      dealBreakers,
    };
    onNext(valuesData);
  };

  const isFormValid = coreValues.length >= 3 && 
    relationshipVision.trim().length >= 50 && 
    lifePriorities.length >= 2 && 
    dealBreakers.length >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Core Values */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Your Core Values (Select 3-5)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What values are absolutely essential in your relationships? These guide your decisions and define what matters most.
            </p>
          </CardHeader>
          <CardContent>
            {coreValues.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                  Your core values ({coreValues.length}/5):
                </p>
                <div className="flex flex-wrap gap-2">
                  {coreValues.map(value => {
                    const option = CORE_VALUES.find(opt => opt.value === value);
                    return (
                      <Badge key={value} variant="secondary" className="text-sm">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {CORE_VALUES.map((valueOption) => (
                <Card
                  key={valueOption.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    coreValues.includes(valueOption.value)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : coreValues.length >= 5
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (coreValues.length < 5 || coreValues.includes(valueOption.value)) && 
                    toggleSelection(coreValues, setCoreValues, valueOption.value, 5)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{valueOption.icon}</span>
                      <span className="font-medium text-sm">{valueOption.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {valueOption.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relationship Vision */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Your Ideal Relationship Vision
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Describe your ideal relationship in 3-5 sentences. What would it feel like? How would you and your partner interact? What would your daily life together look like?
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder="In my ideal relationship, we would... We'd spend our time... I'd feel... Together we would..."
                value={relationshipVision}
                onChange={(e) => setRelationshipVision(e.target.value)}
                className="min-h-32 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {relationshipVision.length}/1000 characters • Minimum 50 characters
                </p>
                {relationshipVision.length >= 50 && (
                  <Badge variant="secondary" className="text-green-600">
                    ✓ Great detail!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Life Priorities */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Life Priorities (Select 3-4)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What are the most important areas of life for you right now? This helps us understand your current focus.
            </p>
          </CardHeader>
          <CardContent>
            {lifePriorities.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Your priorities ({lifePriorities.length}/4):
                </p>
                <div className="flex flex-wrap gap-2">
                  {lifePriorities.map(priority => {
                    const option = LIFE_PRIORITIES.find(opt => opt.value === priority);
                    return (
                      <Badge key={priority} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {LIFE_PRIORITIES.map((priority) => (
                <Card
                  key={priority.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    lifePriorities.includes(priority.value)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : lifePriorities.length >= 4
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (lifePriorities.length < 4 || lifePriorities.includes(priority.value)) && 
                    toggleSelection(lifePriorities, setLifePriorities, priority.value, 4)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{priority.icon}</span>
                    <span className="font-medium text-sm">{priority.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal Breakers */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Relationship Deal-Breakers (Select 2-4)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What behaviors or qualities would be absolutely unacceptable in a relationship? Knowing your boundaries is crucial.
            </p>
          </CardHeader>
          <CardContent>
            {dealBreakers.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  Your deal-breakers ({dealBreakers.length}/4):
                </p>
                <div className="flex flex-wrap gap-2">
                  {dealBreakers.map(dealBreaker => {
                    const option = DEAL_BREAKERS.find(opt => opt.value === dealBreaker);
                    return (
                      <Badge key={dealBreaker} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {DEAL_BREAKERS.map((dealBreaker) => (
                <Card
                  key={dealBreaker.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    dealBreakers.includes(dealBreaker.value)
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : dealBreakers.length >= 4
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (dealBreakers.length < 4 || dealBreakers.includes(dealBreaker.value)) && 
                    toggleSelection(dealBreakers, setDealBreakers, dealBreaker.value, 4)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{dealBreaker.icon}</span>
                    <span className="font-medium text-sm">{dealBreaker.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
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
          className="px-8"
        >
          {isLoading ? t('buttons.saving') : t('buttons.continue')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}