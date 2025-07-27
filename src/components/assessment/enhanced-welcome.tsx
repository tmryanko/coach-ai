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
            {t('whatToExpect.title')}
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
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">{t('whatToExpect.duration.title')}</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('whatToExpect.duration.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">{t('whatToExpect.personal.title')}</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('whatToExpect.personal.description')}
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
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">{t('whatToExpect.aiInsights.title')}</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('whatToExpect.aiInsights.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">{t('whatToExpect.private.title')}</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('whatToExpect.private.description')}
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
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('approach.selfDiscovery.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('approach.selfDiscovery.description')}
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('approach.relationshipReadiness.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('approach.relationshipReadiness.description')}
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('approach.personalizedGrowth.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('approach.personalizedGrowth.description')}
          </p>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('readyToBegin.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            {t('readyToBegin.description')}
          </p>
        </div>
        
        <Button 
          onClick={onNext} 
          size="lg" 
          className="px-8 py-4 text-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          {t('startAssessment')}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('disclaimer')}
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
  const t = useTranslations('assessment.enhanced.welcome');
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
          {t('identity.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('identity.description')}
        </p>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              {t('identity.nameLabel')}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t('identity.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('identity.nameDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-base font-medium">
                {t('identity.ageLabel')}
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
                {t('identity.ageDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-medium">
                {t('identity.locationLabel')}
              </Label>
              <Input
                id="location"
                type="text"
                placeholder={t('identity.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('identity.locationDescription')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t('identity.genderLabel')}
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
              {t('identity.genderDescription')}
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
          {t('identity.back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
          className="px-8"
        >
          {isLoading ? t('identity.saving') : t('identity.continue')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}