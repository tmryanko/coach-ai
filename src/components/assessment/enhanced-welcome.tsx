'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Clock, Users, Shield, ArrowRight } from 'lucide-react';

interface EnhancedWelcomeProps {
  onNext: () => void;
}

export function EnhancedWelcome({ onNext }: EnhancedWelcomeProps) {
  const t = useTranslations('assessment.enhanced.welcome');
  const [showGetStarted, setShowGetStarted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </div>

      {/* What to Expect */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-center text-blue-900 dark:text-blue-100 flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            What to Expect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">15-20 Minutes</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Take your time - this isn&apos;t a race. You can save and return anytime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Deeply Personal</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    We&apos;ll explore your values, fears, dreams, and relationship patterns.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI-Powered Insights</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Get personalized coaching tailored to your unique personality and goals.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Completely Private</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your responses are confidential and used only to personalize your experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Our Approach */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Self-Discovery</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Understand your values, attachment style, and what makes you uniquely you.
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Relationship Readiness</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Assess where you are emotionally and what you need to build healthy connections.
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Personalized Growth</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get a coaching program designed specifically for your goals and learning style.
          </p>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ready to Begin?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            This journey is about you - your growth, your goals, and your path to meaningful connection. 
            Be honest, be curious, and trust the process.
          </p>
        </div>
        
        <Button 
          onClick={onNext} 
          size="lg" 
          className="px-8 py-4 text-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          Start My Assessment
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Takes 15-20 minutes • Save and resume anytime • Completely confidential
        </p>
      </div>
    </div>
  );
}

interface IdentityStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

export function IdentityStep({ data, onNext, onBack, canGoBack, isLoading }: IdentityStepProps) {
  const [name, setName] = useState(data.name || '');
  const [age, setAge] = useState(data.age?.toString() || '');
  const [location, setLocation] = useState(data.location || '');
  const [gender, setGender] = useState(data.gender || '');

  const handleNext = () => {
    const identityData = {
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
      location: location.trim(),
      gender,
    };
    onNext(identityData);
  };

  const isFormValid = name.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Let&apos;s Get to Know You
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help us personalize your experience by sharing a bit about yourself.
        </p>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              What should we call you? *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your first name or preferred name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This helps us make the coaching feel more personal and welcoming.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-base font-medium">
                Age (optional)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="100"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Helps us tailor advice for your life stage.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-medium">
                Location (optional)
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                For cultural context in coaching.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">
              Gender (optional)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['woman', 'man', 'non-binary', 'prefer-not-to-say'].map((option) => (
                <Card
                  key={option}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    gender === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setGender(option)}
                >
                  <div className="text-center">
                    <span className="text-sm font-medium capitalize">
                      {option.replace('-', ' ')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This helps us use appropriate language and examples in your coaching.
            </p>
          </div>
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