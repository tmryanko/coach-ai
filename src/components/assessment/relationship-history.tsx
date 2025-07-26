'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RelationshipHistoryData } from '@/types/assessment';
import { Heart, Clock, ArrowRight, Lightbulb } from 'lucide-react';

interface RelationshipHistoryStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const RELATIONSHIP_STATUS_OPTIONS = [
  { 
    value: 'single-never-married', 
    label: 'Single (never married)', 
    description: 'Ready to explore new connections',
    followUp: true
  },
  { 
    value: 'single-dating', 
    label: 'Single but dating', 
    description: 'Actively meeting people',
    followUp: true
  },
  { 
    value: 'recently-single', 
    label: 'Recently single', 
    description: 'Recently ended a relationship',
    followUp: true
  },
  { 
    value: 'divorced', 
    label: 'Divorced', 
    description: 'Learning from past marriage',
    followUp: true
  },
  { 
    value: 'widowed', 
    label: 'Widowed', 
    description: 'Navigating love after loss',
    followUp: true
  },
  { 
    value: 'its-complicated', 
    label: 'It&apos;s complicated', 
    description: 'Unclear or complex situation',
    followUp: true
  },
  { 
    value: 'in-relationship', 
    label: 'In a relationship', 
    description: 'Working on current partnership',
    followUp: false
  },
];

const DURATION_OPTIONS = [
  { value: 'few-months', label: '6 months or less' },
  { value: 'one-year', label: '6 months - 1 year' },
  { value: 'two-years', label: '1-2 years' },
  { value: 'long-term', label: '2-5 years' },
  { value: 'very-long-term', label: '5+ years' },
  { value: 'no-significant', label: 'No significant relationships' },
];

const TIME_SINCE_OPTIONS = [
  { value: 'very-recent', label: 'Less than 3 months' },
  { value: 'recent', label: '3-6 months' },
  { value: 'moderate', label: '6 months - 1 year' },
  { value: 'longer', label: '1-2 years' },
  { value: 'long-ago', label: '2+ years ago' },
];

export function RelationshipHistoryStep({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading 
}: RelationshipHistoryStepProps) {
  const [relationshipStatus, setRelationshipStatus] = useState(data.relationshipStatus || '');
  const [hasSignificantPast, setHasSignificantPast] = useState(data.hasSignificantPast ?? true);
  const [lastRelationshipDuration, setLastRelationshipDuration] = useState(data.lastRelationshipDuration || '');
  const [timeSinceLastRelationship, setTimeSinceLastRelationship] = useState(data.timeSinceLastRelationship || '');
  const [keyLessonsLearned, setKeyLessonsLearned] = useState(data.keyLessonsLearned || '');
  const [healingProgress, setHealingProgress] = useState(data.healingProgress || '');

  const selectedOption = RELATIONSHIP_STATUS_OPTIONS.find(opt => opt.value === relationshipStatus);
  const needsFollowUp = selectedOption?.followUp && relationshipStatus !== 'single-never-married';
  const showDurationQuestion = hasSignificantPast && needsFollowUp;
  const showTimeQuestion = showDurationQuestion && lastRelationshipDuration && lastRelationshipDuration !== 'no-significant';

  const handleNext = () => {
    const historyData: RelationshipHistoryData = {
      relationshipStatus,
      hasSignificantPast: relationshipStatus === 'single-never-married' ? false : hasSignificantPast,
      lastRelationshipDuration: hasSignificantPast ? lastRelationshipDuration : undefined,
      timeSinceLastRelationship: showTimeQuestion ? timeSinceLastRelationship : undefined,
      keyLessonsLearned: keyLessonsLearned.trim() || undefined,
      healingProgress: healingProgress.trim() || undefined,
    };
    onNext(historyData);
  };

  const isFormValid = relationshipStatus && 
    (!needsFollowUp || !hasSignificantPast || 
     (lastRelationshipDuration && (!showTimeQuestion || timeSinceLastRelationship)));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Your Relationship Story
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Understanding your relationship history helps us provide coaching that honors your journey 
          and builds on what you've learned.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-8">
          {/* Current Status */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What's your current relationship status?</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {RELATIONSHIP_STATUS_OPTIONS.map((option) => (
                <Card
                  key={option.value}
                  className={`p-4 cursor-pointer transition-colors border-2 ${
                    relationshipStatus === option.value
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setRelationshipStatus(option.value)}
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
                      relationshipStatus === option.value
                        ? 'border-pink-500 bg-pink-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`} />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Significant Past Relationships */}
          {needsFollowUp && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Have you had any significant romantic relationships in the past?
              </Label>
              <div className="flex gap-4">
                <Card
                  className={`p-4 cursor-pointer transition-colors border-2 flex-1 ${
                    hasSignificantPast
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setHasSignificantPast(true)}
                >
                  <div className="text-center">
                    <h3 className="font-medium">Yes</h3>
                    <p className="text-sm text-gray-500">I've had meaningful relationships</p>
                  </div>
                </Card>
                <Card
                  className={`p-4 cursor-pointer transition-colors border-2 flex-1 ${
                    !hasSignificantPast
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setHasSignificantPast(false)}
                >
                  <div className="text-center">
                    <h3 className="font-medium">No</h3>
                    <p className="text-sm text-gray-500">I&apos;m new to serious relationships</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Duration of Last Relationship */}
          {showDurationQuestion && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                How long was your most significant relationship?
              </Label>
              <div className="grid gap-3 md:grid-cols-3">
                {DURATION_OPTIONS.map((option) => (
                  <Card
                    key={option.value}
                    className={`p-3 cursor-pointer transition-colors border-2 ${
                      lastRelationshipDuration === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setLastRelationshipDuration(option.value)}
                  >
                    <div className="text-center">
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Time Since Last Relationship */}
          {showTimeQuestion && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                How long has it been since your last relationship ended?
              </Label>
              <div className="grid gap-3 md:grid-cols-3">
                {TIME_SINCE_OPTIONS.map((option) => (
                  <Card
                    key={option.value}
                    className={`p-3 cursor-pointer transition-colors border-2 ${
                      timeSinceLastRelationship === option.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setTimeSinceLastRelationship(option.value)}
                  >
                    <div className="text-center">
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Learned */}
          {hasSignificantPast && needsFollowUp && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <Label className="text-lg font-semibold">
                    What's one important lesson you've learned from your past relationships?
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    This could be about communication, boundaries, red flags, or what you need in a partner.
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="I learned that..."
                value={keyLessonsLearned}
                onChange={(e) => setKeyLessonsLearned(e.target.value)}
                className="min-h-24"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {keyLessonsLearned.length}/500 characters
              </p>
            </div>
          )}

          {/* Healing Progress */}
          {showTimeQuestion && timeSinceLastRelationship && 
           ['very-recent', 'recent', 'moderate'].includes(timeSinceLastRelationship) && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <Label className="text-lg font-semibold">
                    How are you feeling about this past relationship now?
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Are you still processing, feeling healed, or somewhere in between?
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="I&apos;m feeling..."
                value={healingProgress}
                onChange={(e) => setHealingProgress(e.target.value)}
                className="min-h-24"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {healingProgress.length}/500 characters
              </p>
            </div>
          )}
        </div>
      </Card>

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