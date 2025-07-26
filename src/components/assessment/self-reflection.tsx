'use client';

import { useState } from 'react';
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

const PERSONAL_STRENGTHS = [
  { value: 'empathy', label: 'Empathy & Understanding', icon: '💝' },
  { value: 'loyalty', label: 'Loyalty & Dedication', icon: '🤝' },
  { value: 'humor', label: 'Sense of Humor', icon: '😄' },
  { value: 'intelligence', label: 'Intelligence & Wisdom', icon: '🧠' },
  { value: 'creativity', label: 'Creativity & Imagination', icon: '🎨' },
  { value: 'resilience', label: 'Resilience & Strength', icon: '💪' },
  { value: 'kindness', label: 'Kindness & Compassion', icon: '❤️' },
  { value: 'authenticity', label: 'Authenticity & Honesty', icon: '✨' },
  { value: 'patience', label: 'Patience & Understanding', icon: '⏳' },
  { value: 'adventure', label: 'Adventurous Spirit', icon: '🌟' },
  { value: 'reliability', label: 'Reliability & Trustworthiness', icon: '🛡️' },
  { value: 'communication', label: 'Good Communication', icon: '💬' },
  { value: 'independence', label: 'Independence & Self-Reliance', icon: '🦋' },
  { value: 'ambition', label: 'Ambition & Drive', icon: '🎯' },
  { value: 'emotional-intelligence', label: 'Emotional Intelligence', icon: '🧘‍♀️' },
];

const FUTURE_RELATIONSHIP_GOALS = [
  { value: 'deep-connection', label: 'Build deep emotional connection', icon: '💞' },
  { value: 'effective-communication', label: 'Communicate more effectively', icon: '💬' },
  { value: 'healthy-boundaries', label: 'Set healthy boundaries', icon: '🚧' },
  { value: 'conflict-resolution', label: 'Handle conflicts better', icon: '🤝' },
  { value: 'trust-building', label: 'Build and maintain trust', icon: '🔒' },
  { value: 'intimacy', label: 'Create deeper intimacy', icon: '🌹' },
  { value: 'support-partnership', label: 'Be a supportive partner', icon: '🫂' },
  { value: 'personal-growth', label: 'Continue growing together', icon: '🌱' },
  { value: 'life-balance', label: 'Balance relationship and independence', icon: '⚖️' },
  { value: 'shared-goals', label: 'Work toward shared goals', icon: '🎯' },
  { value: 'emotional-security', label: 'Create emotional security', icon: '🛡️' },
  { value: 'fun-connection', label: 'Keep things fun and playful', icon: '🎪' },
];

export function SelfReflectionStep({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading 
}: SelfReflectionStepProps) {
  const [friendsDescription, setFriendsDescription] = useState(data.friendsDescription || '');
  const [proudestMoment, setProudestMoment] = useState(data.proudestMoment || '');
  const [biggestGrowthArea, setBiggestGrowthArea] = useState(data.biggestGrowthArea || '');
  const [personalStrengths, setPersonalStrengths] = useState<string[]>(data.personalStrengths || []);
  const [futureRelationshipGoals, setFutureRelationshipGoals] = useState<string[]>(data.futureRelationshipGoals || []);

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
          Self-Reflection & Growth
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          The final step in your journey of self-discovery. These insights help us understand 
          how you see yourself and what you're working toward in relationships.
        </p>
      </div>

      <div className="space-y-8">
        {/* How Friends Describe You */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              How Your Friends Would Describe You
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If your closest friends were describing you to someone new, what would they say? 
              Think about the qualities they admire and the way you show up in their lives.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder="My friends would probably say I'm... They'd mention that I... When they think of me, they think of someone who..."
                value={friendsDescription}
                onChange={(e) => setFriendsDescription(e.target.value)}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {friendsDescription.length}/500 characters • Minimum 20 characters
                </p>
                {friendsDescription.length >= 20 && (
                  <Badge variant="secondary" className="text-green-600">
                    ✓ Great insight!
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
              Your Proudest Personal Moment
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Think of a time when you felt really proud of yourself - not necessarily a big achievement, 
              but a moment that showed your character, values, or growth.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder="I&apos;m most proud of the time when I... This showed me that I... It made me realize..."
                value={proudestMoment}
                onChange={(e) => setProudestMoment(e.target.value)}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {proudestMoment.length}/500 characters • Minimum 20 characters
                </p>
                {proudestMoment.length >= 20 && (
                  <Badge variant="secondary" className="text-green-600">
                    ✓ Inspiring!
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
              Your Biggest Area for Growth
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What's one area where you'd most like to grow or improve as a person? 
              This could be a skill, habit, mindset, or way of being in relationships.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder="I&apos;d most like to grow in... This would help me because... I&apos;m working on this by..."
                value={biggestGrowthArea}
                onChange={(e) => setBiggestGrowthArea(e.target.value)}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {biggestGrowthArea.length}/500 characters • Minimum 20 characters
                </p>
                {biggestGrowthArea.length >= 20 && (
                  <Badge variant="secondary" className="text-green-600">
                    ✓ Self-aware!
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
              Your Personal Strengths (Select 3-5)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What are your superpowers as a person? Choose the qualities that you feel represent you best.
            </p>
          </CardHeader>
          <CardContent>
            {personalStrengths.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Your strengths ({personalStrengths.length}/5):
                </p>
                <div className="flex flex-wrap gap-2">
                  {personalStrengths.map(strength => {
                    const option = PERSONAL_STRENGTHS.find(opt => opt.value === strength);
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
              {PERSONAL_STRENGTHS.map((strength) => (
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
              Your Relationship Goals (Select 2-4)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              What do you most want to achieve or improve in your future relationships?
            </p>
          </CardHeader>
          <CardContent>
            {futureRelationshipGoals.length > 0 && (
              <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <p className="text-sm font-medium text-pink-900 dark:text-pink-100 mb-2">
                  Your relationship goals ({futureRelationshipGoals.length}/4):
                </p>
                <div className="flex flex-wrap gap-2">
                  {futureRelationshipGoals.map(goal => {
                    const option = FUTURE_RELATIONSHIP_GOALS.find(opt => opt.value === goal);
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
              {FUTURE_RELATIONSHIP_GOALS.map((goal) => (
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
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
          className="px-8"
        >
          {isLoading ? 'Saving...' : 'Complete Assessment'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}