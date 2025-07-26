'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LifestyleCompatibilityData } from '@/types/assessment';
import { Home, Users, MessageCircle, Zap, ArrowRight } from 'lucide-react';

interface LifestyleCompatibilityStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const getWorkLifeBalanceOptions = (t: any) => [
  { 
    value: 'work-focused', 
    label: t('workLifeBalanceOptions.work-focused.label'), 
    description: t('workLifeBalanceOptions.work-focused.description'),
    icon: '💼'
  },
  { 
    value: 'balanced', 
    label: t('workLifeBalanceOptions.balanced.label'), 
    description: t('workLifeBalanceOptions.balanced.description'),
    icon: '⚖️'
  },
  { 
    value: 'life-focused', 
    label: t('workLifeBalanceOptions.life-focused.label'), 
    description: t('workLifeBalanceOptions.life-focused.description'),
    icon: '🏡'
  },
  { 
    value: 'flexible', 
    label: t('workLifeBalanceOptions.flexible.label'), 
    description: t('workLifeBalanceOptions.flexible.description'),
    icon: '🔄'
  },
];

const getHobbiesInterests = (t: any) => [
  { value: 'fitness-sports', label: t('hobbiesOptions.fitness-sports'), icon: '🏃‍♀️' },
  { value: 'outdoor-adventure', label: t('hobbiesOptions.outdoor-adventure'), icon: '🏔️' },
  { value: 'arts-culture', label: t('hobbiesOptions.arts-culture'), icon: '🎭' },
  { value: 'cooking-food', label: t('hobbiesOptions.cooking-food'), icon: '👨‍🍳' },
  { value: 'travel', label: t('hobbiesOptions.travel'), icon: '✈️' },
  { value: 'music-concerts', label: t('hobbiesOptions.music-concerts'), icon: '🎵' },
  { value: 'reading-learning', label: t('hobbiesOptions.reading-learning'), icon: '📚' },
  { value: 'gaming-tech', label: t('hobbiesOptions.gaming-tech'), icon: '🎮' },
  { value: 'social-events', label: t('hobbiesOptions.social-events'), icon: '🎉' },
  { value: 'crafts-diy', label: t('hobbiesOptions.crafts-diy'), icon: '🛠️' },
  { value: 'meditation-wellness', label: t('hobbiesOptions.meditation-wellness'), icon: '🧘‍♀️' },
  { value: 'volunteering', label: t('hobbiesOptions.volunteering'), icon: '🤝' },
  { value: 'photography', label: t('hobbiesOptions.photography'), icon: '📸' },
  { value: 'gardening-nature', label: t('hobbiesOptions.gardening-nature'), icon: '🌱' },
  { value: 'movies-tv', label: t('hobbiesOptions.movies-tv'), icon: '🎬' },
];

const COMMUNICATION_STYLES = [
  {
    value: 'direct-straightforward',
    label: 'Direct & Straightforward',
    description: 'I say what I mean clearly and appreciate the same',
    icon: '🎯'
  },
  {
    value: 'gentle-diplomatic',
    label: 'Gentle & Diplomatic',
    description: 'I choose words carefully to maintain harmony',
    icon: '🕊️'
  },
  {
    value: 'expressive-emotional',
    label: 'Expressive & Emotional',
    description: 'I share feelings openly and connect emotionally',
    icon: '💭'
  },
  {
    value: 'analytical-logical',
    label: 'Analytical & Logical',
    description: 'I prefer facts, reasoning, and structured discussions',
    icon: '🧠'
  },
  {
    value: 'playful-humorous',
    label: 'Playful & Humorous',
    description: 'I use humor and lightness to connect and communicate',
    icon: '😄'
  },
];

const CONFLICT_STYLES = [
  {
    value: 'address-immediately',
    label: 'Address Immediately',
    description: 'I prefer to talk through issues right away',
    icon: '⚡'
  },
  {
    value: 'cool-down-first',
    label: 'Cool Down First',
    description: 'I need space to process before discussing conflicts',
    icon: '❄️'
  },
  {
    value: 'collaborative-problem-solving',
    label: 'Collaborative Problem-Solving',
    description: 'I focus on finding solutions together',
    icon: '🤝'
  },
  {
    value: 'avoid-if-possible',
    label: 'Avoid If Possible',
    description: 'I prefer to let minor issues resolve naturally',
    icon: '🌊'
  },
  {
    value: 'seek-compromise',
    label: 'Seek Compromise',
    description: 'I look for middle ground where both can be happy',
    icon: '⚖️'
  },
];

export function LifestyleCompatibilityStep({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading 
}: LifestyleCompatibilityStepProps) {
  const t = useTranslations('assessment.lifestyleCompatibility');
  const [workLifeBalance, setWorkLifeBalance] = useState(data.workLifeBalance || '');
  const [socialEnergyLevel, setSocialEnergyLevel] = useState(data.socialEnergyLevel || 5);
  const [hobbiesAndInterests, setHobbiesAndInterests] = useState<string[]>(data.hobbiesAndInterests || []);
  const [communicationStyle, setCommunicationStyle] = useState(data.communicationStyle || '');
  const [conflictStyle, setConflictStyle] = useState(data.conflictStyle || '');

  const workLifeBalanceOptions = getWorkLifeBalanceOptions(t);
  const hobbiesInterests = getHobbiesInterests(t);

  const toggleHobby = (hobby: string) => {
    if (hobbiesAndInterests.includes(hobby)) {
      setHobbiesAndInterests(hobbiesAndInterests.filter(h => h !== hobby));
    } else if (hobbiesAndInterests.length < 6) {
      setHobbiesAndInterests([...hobbiesAndInterests, hobby]);
    }
  };

  const handleNext = () => {
    const lifestyleData: LifestyleCompatibilityData = {
      workLifeBalance,
      socialEnergyLevel,
      hobbiesAndInterests,
      communicationStyle,
      conflictStyle,
    };
    onNext(lifestyleData);
  };

  const isFormValid = workLifeBalance && 
    hobbiesAndInterests.length >= 3 && 
    communicationStyle && 
    conflictStyle;

  const getSocialEnergyDescription = (level: number) => {
    if (level <= 2) return 'Prefer quiet, intimate settings';
    if (level <= 4) return 'Enjoy small groups and close friends';
    if (level <= 6) return 'Comfortable in various social situations';
    return 'Love large groups and social events';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Work-Life Balance */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-500" />
              {t('workLifeBalanceTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('workLifeBalanceDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {workLifeBalanceOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`p-4 cursor-pointer transition-colors border-2 ${
                    workLifeBalance === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setWorkLifeBalance(option.value)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.icon}</span>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {option.label}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {option.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Energy Level */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              {t('socialEnergyTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('socialEnergyDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {socialEnergyLevel}/7
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getSocialEnergyDescription(socialEnergyLevel)}
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSocialEnergyLevel(level)}
                      className={`w-10 h-10 rounded-full border-2 text-sm font-semibold transition-colors ${
                        socialEnergyLevel === level
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-300 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>{t('socialEnergyLabels.preferSolitude')}</span>
                <span>{t('socialEnergyLabels.loveBeingSocial')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hobbies and Interests */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              {t('hobbiesTitle')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('hobbiesDescription')}
            </p>
          </CardHeader>
          <CardContent>
            {hobbiesAndInterests.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  {t('hobbiesSelected', { count: hobbiesAndInterests.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hobbiesAndInterests.map(hobby => {
                    const option = hobbiesInterests.find(opt => opt.value === hobby);
                    return (
                      <Badge key={hobby} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-3">
              {hobbiesInterests.map((hobby) => (
                <Card
                  key={hobby.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    hobbiesAndInterests.includes(hobby.value)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : hobbiesAndInterests.length >= 6
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (hobbiesAndInterests.length < 6 || hobbiesAndInterests.includes(hobby.value)) && 
                    toggleHobby(hobby.value)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{hobby.icon}</span>
                    <span className="font-medium text-sm">{hobby.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Communication Style */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Communication Style
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              How do you typically communicate in relationships?
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {COMMUNICATION_STYLES.map((style) => (
                <Card
                  key={style.value}
                  className={`p-4 cursor-pointer transition-colors border-2 ${
                    communicationStyle === style.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setCommunicationStyle(style.value)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">{style.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {style.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {style.description}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      communicationStyle === style.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`} />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conflict Resolution Style */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Conflict Resolution Style
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              How do you prefer to handle disagreements or conflicts?
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CONFLICT_STYLES.map((style) => (
                <Card
                  key={style.value}
                  className={`p-4 cursor-pointer transition-colors border-2 ${
                    conflictStyle === style.value
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setConflictStyle(style.value)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">{style.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {style.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {style.description}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      conflictStyle === style.value
                        ? 'border-yellow-500 bg-yellow-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`} />
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