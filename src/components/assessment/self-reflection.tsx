'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SelfReflectionData } from '@/types/assessment';
import { Sparkles, Trophy, TrendingUp, Target, ArrowRight } from 'lucide-react';

interface SelfReflectionStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const getPersonalStrengths = (t: any) => [
  { value: 'empathy', label: t('personalStrengths.empathy'), icon: '💝' },
  { value: 'loyalty', label: t('personalStrengths.loyalty'), icon: '🤝' },
  { value: 'humor', label: t('personalStrengths.humor'), icon: '😄' },
  { value: 'intelligence', label: t('personalStrengths.intelligence'), icon: '🧠' },
  { value: 'creativity', label: t('personalStrengths.creativity'), icon: '🎨' },
  { value: 'resilience', label: t('personalStrengths.resilience'), icon: '💪' },
  { value: 'kindness', label: t('personalStrengths.kindness'), icon: '❤️' },
  { value: 'authenticity', label: t('personalStrengths.authenticity'), icon: '✨' },
  { value: 'patience', label: t('personalStrengths.patience'), icon: '⏳' },
  { value: 'adventure', label: t('personalStrengths.adventure'), icon: '🌟' },
  { value: 'reliability', label: t('personalStrengths.reliability'), icon: '🛡️' },
  { value: 'communication', label: t('personalStrengths.communication'), icon: '💬' },
  { value: 'independence', label: t('personalStrengths.independence'), icon: '🦋' },
  { value: 'ambition', label: t('personalStrengths.ambition'), icon: '🎯' },
  { value: 'emotional-intelligence', label: t('personalStrengths.emotional-intelligence'), icon: '🧘‍♀️' },
];

const getFutureRelationshipGoals = (t: any) => [
  { value: 'deep-connection', label: t('relationshipGoals.deep-connection'), icon: '💞' },
  { value: 'effective-communication', label: t('relationshipGoals.effective-communication'), icon: '💬' },
  { value: 'healthy-boundaries', label: t('relationshipGoals.healthy-boundaries'), icon: '🚧' },
  { value: 'conflict-resolution', label: t('relationshipGoals.conflict-resolution'), icon: '🤝' },
  { value: 'trust-building', label: t('relationshipGoals.trust-building'), icon: '🔒' },
  { value: 'intimacy', label: t('relationshipGoals.intimacy'), icon: '🌹' },
  { value: 'support-partnership', label: t('relationshipGoals.support-partnership'), icon: '🫂' },
  { value: 'personal-growth', label: t('relationshipGoals.personal-growth'), icon: '🌱' },
  { value: 'life-balance', label: t('relationshipGoals.life-balance'), icon: '⚖️' },
  { value: 'shared-goals', label: t('relationshipGoals.shared-goals'), icon: '🎯' },
  { value: 'emotional-security', label: t('relationshipGoals.emotional-security'), icon: '🛡️' },
  { value: 'fun-connection', label: t('relationshipGoals.fun-connection'), icon: '🎪' },
];

export function SelfReflectionStep({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading 
}: SelfReflectionStepProps) {
  const t = useTranslations('assessment.selfReflection');
  const [friendsDescription, setFriendsDescription] = useState(data.friendsDescription || '');
  const [proudestMoment, setProudestMoment] = useState(data.proudestMoment || '');
  const [biggestGrowthArea, setBiggestGrowthArea] = useState(data.biggestGrowthArea || '');
  const [personalStrengths, setPersonalStrengths] = useState<string[]>(data.personalStrengths || []);
  const [futureRelationshipGoals, setFutureRelationshipGoals] = useState<string[]>(data.futureRelationshipGoals || []);

  const personalStrengthOptions = getPersonalStrengths(t);
  const relationshipGoalOptions = getFutureRelationshipGoals(t);

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, value: string, maxItems: number) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else if (array.length < maxItems) {
      setArray([...array, value]);
    }
  };

  const handleNext = () => {
    const reflectionData: SelfReflectionData = {
      friendsDescription: friendsDescription.trim(),
      proudestMoment: proudestMoment.trim(),
      biggestGrowthArea: biggestGrowthArea.trim(),
      personalStrengths,
      futureRelationshipGoals,
    };
    onNext(reflectionData);
  };

  const isFormValid = friendsDescription.trim().length >= 20 && 
    proudestMoment.trim().length >= 20 && 
    biggestGrowthArea.trim().length >= 20 &&
    personalStrengths.length >= 3 && 
    futureRelationshipGoals.length >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="space-y-8">
        {/* How Friends Describe You */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              {t('friendsDescriptionTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('friendsDescriptionDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder={t('friendsDescriptionPlaceholder')}
                value={friendsDescription}
                onChange={(e) => setFriendsDescription(e.target.value)}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('characterCount', { current: friendsDescription.length, max: 500, min: 20 })}
                </p>
                {friendsDescription.length >= 20 && (
                  <Badge variant="secondary" className="text-green-600">
                    {t('validationMessage.greatInsight')}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proudest Moment */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {t('proudestMomentTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('proudestMomentDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder={t('proudestMomentPlaceholder')}
                value={proudestMoment}
                onChange={(e) => setProudestMoment(e.target.value)}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('characterCount', { current: proudestMoment.length, max: 500, min: 20 })}
                </p>
                {proudestMoment.length >= 20 && (
                  <Badge variant="secondary" className="text-green-600">
                    {t('validationMessage.inspiring')}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biggest Growth Area */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              {t('growthAreaTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('growthAreaDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder={t('growthAreaPlaceholder')}
                value={biggestGrowthArea}
                onChange={(e) => setBiggestGrowthArea(e.target.value)}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('characterCount', { current: biggestGrowthArea.length, max: 500, min: 20 })}
                </p>
                {biggestGrowthArea.length >= 20 && (
                  <Badge variant="secondary" className="text-green-600">
                    {t('validationMessage.selfAware')}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Strengths */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              {t('personalStrengthsTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('personalStrengthsDescription')}
            </p>
          </CardHeader>
          <CardContent>
            {personalStrengths.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  {t('strengthsSelected', { count: personalStrengths.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {personalStrengths.map(strength => {
                    const option = personalStrengthOptions.find(opt => opt.value === strength);
                    return (
                      <Badge key={strength} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {personalStrengthOptions.map((strength) => (
                <Card
                  key={strength.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    personalStrengths.includes(strength.value)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : personalStrengths.length >= 5
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (personalStrengths.length < 5 || personalStrengths.includes(strength.value)) && 
                    toggleSelection(personalStrengths, setPersonalStrengths, strength.value, 5)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{strength.icon}</span>
                    <span className="font-medium text-sm">{strength.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Future Relationship Goals */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-500" />
              {t('relationshipGoalsTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('relationshipGoalsDescription')}
            </p>
          </CardHeader>
          <CardContent>
            {futureRelationshipGoals.length > 0 && (
              <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <p className="text-sm font-medium text-pink-900 dark:text-pink-100 mb-2">
                  {t('goalsSelected', { count: futureRelationshipGoals.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {futureRelationshipGoals.map(goal => {
                    const option = relationshipGoalOptions.find(opt => opt.value === goal);
                    return (
                      <Badge key={goal} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {relationshipGoalOptions.map((goal) => (
                <Card
                  key={goal.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    futureRelationshipGoals.includes(goal.value)
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : futureRelationshipGoals.length >= 4
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (futureRelationshipGoals.length < 4 || futureRelationshipGoals.includes(goal.value)) && 
                    toggleSelection(futureRelationshipGoals, setFutureRelationshipGoals, goal.value, 4)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{goal.icon}</span>
                    <span className="font-medium text-sm">{goal.label}</span>
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