'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { EmotionalProfileData } from '@/types/assessment';
import { Brain, Heart, Shield, ArrowRight, Star } from 'lucide-react';

interface EmotionalIntelligenceStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const ATTACHMENT_STYLES = [
  {
    value: 'secure',
    label: 'Secure',
    description: 'I find it easy to get close to others and am comfortable depending on them. I don&apos;t often worry about being abandoned.',
    traits: ['Comfortable with intimacy', 'Good communication', 'Trusting']
  },
  {
    value: 'anxious',
    label: 'Anxious',
    description: 'I want to be very close to partners, but worry they don&apos;t feel the same. I fear being abandoned or unloved.',
    traits: ['Seeks reassurance', 'Fears abandonment', 'Highly empathetic']
  },
  {
    value: 'avoidant',
    label: 'Avoidant',
    description: 'I prefer independence and self-sufficiency. I sometimes find it difficult to trust others completely.',
    traits: ['Values independence', 'Uncomfortable with emotions', 'Self-reliant']
  },
  {
    value: 'disorganized',
    label: 'Fearful-Avoidant',
    description: 'I want close relationships but worry about getting hurt. I have mixed feelings about depending on others.',
    traits: ['Wants closeness but fears it', 'Inconsistent emotions', 'Past relationship trauma']
  },
  {
    value: 'unsure',
    label: 'I\'m not sure',
    description: 'I need to learn more about my attachment patterns.',
    traits: ['Self-discovery needed']
  }
];

const FEAR_OPTIONS = [
  { value: 'rejection', label: 'Fear of rejection', icon: '💔' },
  { value: 'abandonment', label: 'Fear of abandonment', icon: '😰' },
  { value: 'intimacy', label: 'Fear of intimacy', icon: '🚧' },
  { value: 'vulnerability', label: 'Fear of being vulnerable', icon: '🛡️' },
  { value: 'not-good-enough', label: 'Fear of not being good enough', icon: '😔' },
  { value: 'losing-independence', label: 'Fear of losing independence', icon: '🔗' },
  { value: 'commitment', label: 'Fear of commitment', icon: '⚰️' },
  { value: 'repeating-mistakes', label: 'Fear of repeating past mistakes', icon: '🔄' },
  { value: 'being-hurt', label: 'Fear of being hurt again', icon: '💔' },
  { value: 'conflict', label: 'Fear of conflict', icon: '⚡' },
];

const STRENGTH_OPTIONS = [
  { value: 'empathy', label: 'High empathy', icon: '❤️' },
  { value: 'communication', label: 'Good communication', icon: '💬' },
  { value: 'loyalty', label: 'Deep loyalty', icon: '🤝' },
  { value: 'emotional-awareness', label: 'Emotional self-awareness', icon: '🧠' },
  { value: 'resilience', label: 'Emotional resilience', icon: '💪' },
  { value: 'compassion', label: 'Compassion for others', icon: '🤗' },
  { value: 'patience', label: 'Patience', icon: '⏳' },
  { value: 'authenticity', label: 'Authenticity', icon: '✨' },
  { value: 'supportiveness', label: 'Being supportive', icon: '🫂' },
  { value: 'forgiveness', label: 'Ability to forgive', icon: '🕊️' },
];

const CHALLENGE_OPTIONS = [
  { value: 'setting-boundaries', label: 'Setting healthy boundaries', icon: '🚧' },
  { value: 'expressing-emotions', label: 'Expressing emotions clearly', icon: '💭' },
  { value: 'managing-anxiety', label: 'Managing relationship anxiety', icon: '😰' },
  { value: 'trusting-others', label: 'Trusting new people', icon: '🤔' },
  { value: 'conflict-resolution', label: 'Handling conflict', icon: '⚡' },
  { value: 'self-confidence', label: 'Self-confidence in relationships', icon: '💪' },
  { value: 'emotional-regulation', label: 'Managing intense emotions', icon: '🌊' },
  { value: 'overthinking', label: 'Overthinking situations', icon: '🤯' },
  { value: 'past-trauma', label: 'Processing past relationship trauma', icon: '🩹' },
  { value: 'opening-up', label: 'Opening up to someone new', icon: '🔓' },
];

const READINESS_LEVELS = [
  { value: 1, label: 'Not ready', description: 'Still healing from past hurts' },
  { value: 2, label: 'Mostly not ready', description: 'Working through some issues' },
  { value: 3, label: 'Somewhat ready', description: 'Making progress but cautious' },
  { value: 4, label: 'Getting ready', description: 'Feeling more confident' },
  { value: 5, label: 'Ready', description: 'Open to finding the right person' },
  { value: 6, label: 'Very ready', description: 'Actively seeking connection' },
  { value: 7, label: 'Completely ready', description: 'Confident and optimistic' },
];

export function EmotionalIntelligenceStep({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading 
}: EmotionalIntelligenceStepProps) {
  const [attachmentStyle, setAttachmentStyle] = useState(data.attachmentStyle || '');
  const [primaryFears, setPrimaryFears] = useState<string[]>(data.primaryFears || []);
  const [topStrengths, setTopStrengths] = useState<string[]>(data.topStrengths || []);
  const [emotionalChallenges, setEmotionalChallenges] = useState<string[]>(data.emotionalChallenges || []);
  const [relationshipReadiness, setRelationshipReadiness] = useState(data.relationshipReadiness || 5);

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, value: string, maxItems: number) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else if (array.length < maxItems) {
      setArray([...array, value]);
    }
  };

  const handleNext = () => {
    const emotionalData: EmotionalProfileData = {
      attachmentStyle,
      primaryFears,
      topStrengths,
      emotionalChallenges,
      relationshipReadiness,
    };
    onNext(emotionalData);
  };

  const isFormValid = attachmentStyle && 
    primaryFears.length > 0 && 
    topStrengths.length > 0 && 
    emotionalChallenges.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Understanding Your Emotional Landscape
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Self-awareness is the foundation of healthy relationships. Let&apos;s explore your emotional patterns, 
          strengths, and areas for growth.
        </p>
      </div>

      <div className="space-y-8">
        {/* Attachment Style */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Attachment Style
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              How do you typically approach closeness and intimacy in relationships?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {ATTACHMENT_STYLES.map((style) => (
              <Card
                key={style.value}
                className={`p-4 cursor-pointer transition-colors border-2 ${
                  attachmentStyle === style.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setAttachmentStyle(style.value)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {style.label}
                    </h3>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      attachmentStyle === style.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {style.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {style.traits.map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Primary Fears */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              Relationship Fears (Select up to 3)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What fears or anxieties do you notice in relationships? It&apos;s normal to have these.
            </p>
          </CardHeader>
          <CardContent>
            {primaryFears.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Selected fears ({primaryFears.length}/3):
                </p>
                <div className="flex flex-wrap gap-2">
                  {primaryFears.map(fear => {
                    const option = FEAR_OPTIONS.find(opt => opt.value === fear);
                    return (
                      <Badge key={fear} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {FEAR_OPTIONS.map((fear) => (
                <Card
                  key={fear.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    primaryFears.includes(fear.value)
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : primaryFears.length >= 3
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (primaryFears.length < 3 || primaryFears.includes(fear.value)) && 
                    toggleSelection(primaryFears, setPrimaryFears, fear.value, 3)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{fear.icon}</span>
                    <span className="font-medium text-sm">{fear.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Strengths */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-green-500" />
              Your Emotional Strengths (Select up to 4)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What are your superpowers when it comes to relationships and emotions?
            </p>
          </CardHeader>
          <CardContent>
            {topStrengths.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                  Your strengths ({topStrengths.length}/4):
                </p>
                <div className="flex flex-wrap gap-2">
                  {topStrengths.map(strength => {
                    const option = STRENGTH_OPTIONS.find(opt => opt.value === strength);
                    return (
                      <Badge key={strength} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {STRENGTH_OPTIONS.map((strength) => (
                <Card
                  key={strength.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    topStrengths.includes(strength.value)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : topStrengths.length >= 4
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (topStrengths.length < 4 || topStrengths.includes(strength.value)) && 
                    toggleSelection(topStrengths, setTopStrengths, strength.value, 4)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{strength.icon}</span>
                    <span className="font-medium text-sm">{strength.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emotional Challenges */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Areas for Growth (Select up to 3)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What emotional skills would you like to develop or improve?
            </p>
          </CardHeader>
          <CardContent>
            {emotionalChallenges.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Growth areas ({emotionalChallenges.length}/3):
                </p>
                <div className="flex flex-wrap gap-2">
                  {emotionalChallenges.map(challenge => {
                    const option = CHALLENGE_OPTIONS.find(opt => opt.value === challenge);
                    return (
                      <Badge key={challenge} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {CHALLENGE_OPTIONS.map((challenge) => (
                <Card
                  key={challenge.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    emotionalChallenges.includes(challenge.value)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : emotionalChallenges.length >= 3
                      ? 'border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => (emotionalChallenges.length < 3 || emotionalChallenges.includes(challenge.value)) && 
                    toggleSelection(emotionalChallenges, setEmotionalChallenges, challenge.value, 3)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{challenge.icon}</span>
                    <span className="font-medium text-sm">{challenge.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relationship Readiness */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Relationship Readiness Scale
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              How ready do you feel to start or work on a romantic relationship right now?
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    {relationshipReadiness}/7
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {READINESS_LEVELS.find(level => level.value === relationshipReadiness)?.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {READINESS_LEVELS.find(level => level.value === relationshipReadiness)?.description}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {READINESS_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setRelationshipReadiness(level.value)}
                      className={`w-10 h-10 rounded-full border-2 text-sm font-semibold transition-colors ${
                        relationshipReadiness === level.value
                          ? 'border-pink-500 bg-pink-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {level.value}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>Not ready</span>
                <span>Completely ready</span>
              </div>
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
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
          className="px-8"
        >
          {isLoading ? 'Saving...' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}