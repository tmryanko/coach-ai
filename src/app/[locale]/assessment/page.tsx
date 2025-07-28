'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { api } from '@/utils/api';
import { SimpleAppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// Enhanced Assessment Components
import { EnhancedWelcome, IdentityStep } from '@/components/assessment/enhanced-welcome';
import { RelationshipHistoryStep } from '@/components/assessment/relationship-history';
import { EmotionalIntelligenceStep } from '@/components/assessment/emotional-intelligence';
import { ValuesVisionStep } from '@/components/assessment/values-vision';
import { LifestyleCompatibilityStep } from '@/components/assessment/lifestyle-compatibility';
import { SelfReflectionStep } from '@/components/assessment/self-reflection';
import { EnhancedSummary } from '@/components/assessment/enhanced-summary';
import { 
  EnhancedAssessmentData, 
  RelationshipHistoryData,
  EmotionalProfileData,
  LifestyleCompatibilityData,
  SelfReflectionData,
  ValuesVisionData,
  IdentityStepData
} from '@/types/assessment';

// Combined type for step component props
type StepComponentData = Partial<RelationshipHistoryData> & 
  Partial<EmotionalProfileData> & 
  Partial<LifestyleCompatibilityData> & 
  Partial<SelfReflectionData> & 
  Partial<ValuesVisionData> & 
  Partial<IdentityStepData> & 
  Partial<Omit<EnhancedAssessmentData, 'relationshipStatus' | 'relationshipGoals' | 'currentChallenges' | 'preferredCommunicationStyle'>> & {
    relationshipStatus?: string;
    relationshipGoals?: string[];
    currentChallenges?: string[];
    preferredCommunicationStyle?: string;
  };

const STEPS = [
  { id: 'welcome', title: 'Welcome', component: EnhancedWelcome },
  { id: 'identity', title: 'About You', component: IdentityStep },
  { id: 'relationship-history', title: 'Relationship History', component: RelationshipHistoryStep },
  { id: 'emotional-intelligence', title: 'Emotional Profile', component: EmotionalIntelligenceStep },
  { id: 'values-vision', title: 'Values & Vision', component: ValuesVisionStep },
  { id: 'lifestyle-compatibility', title: 'Lifestyle & Communication', component: LifestyleCompatibilityStep },
  { id: 'self-reflection', title: 'Self-Reflection', component: SelfReflectionStep },
  { id: 'summary', title: 'Summary', component: EnhancedSummary },
];

export default function AssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('assessment');
  const isEditMode = searchParams.get('edit') === 'true';
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<StepComponentData>({});
  
  const { data: assessmentStatus } = api.assessment.getStatus.useQuery();
  const { data: existingProfile, isLoading: profileLoading } = api.assessment.getProfile.useQuery();
  
  const submitAssessment = api.assessment.submit.useMutation({
    onSuccess: () => {
      if (isEditMode) {
        router.push(`/${locale}/profile`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    },
  });

  const submitEnhancedAssessment = api.assessment.submitEnhanced.useMutation({
    onSuccess: () => {
      if (isEditMode) {
        router.push(`/${locale}/profile`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    },
  });

  const updateStep = api.assessment.updateStep.useMutation();

  // If user has already completed assessment and not in edit mode, redirect to profile
  useEffect(() => {
    if (assessmentStatus?.isCompleted && !isEditMode) {
      router.push(`/${locale}/profile`);
    }
  }, [assessmentStatus?.isCompleted, isEditMode, router, locale]);

  // Pre-populate assessment data with existing profile when in edit mode
  useEffect(() => {
    console.log('🔍 Assessment Debug - isEditMode:', isEditMode);
    console.log('🔍 Assessment Debug - profileLoading:', profileLoading);
    console.log('🔍 Assessment Debug - existingProfile:', existingProfile);
    
    if (isEditMode && existingProfile && !profileLoading) {
      console.log('🔍 Assessment Debug - Loading existing profile data:', existingProfile);
      setAssessmentData({
        // Core identity
        name: existingProfile.name || undefined,
        age: existingProfile.age || undefined,
        location: existingProfile.location || undefined,
        gender: existingProfile.gender || undefined,
        
        // Relationship data
        relationshipStatus: existingProfile.relationshipStatus || undefined,
        // Relationship history - flatten for component compatibility
        hasSignificantPast: (existingProfile.relationshipHistory as any)?.hasSignificantPast,
        lastRelationshipDuration: (existingProfile.relationshipHistory as any)?.lastRelationshipDuration,
        timeSinceLastRelationship: (existingProfile.relationshipHistory as any)?.timeSinceLastRelationship,
        keyLessonsLearned: (existingProfile.relationshipHistory as any)?.keyLessonsLearned,
        healingProgress: (existingProfile.relationshipHistory as any)?.healingProgress,
        relationshipHistory: (existingProfile.relationshipHistory as any) || undefined,
        relationshipGoals: existingProfile.relationshipGoals?.length ? existingProfile.relationshipGoals : undefined,
        relationshipReadiness: existingProfile.relationshipReadiness || undefined,
        
        // Emotional profile - flatten for component compatibility
        attachmentStyle: (existingProfile.emotionalProfile as any)?.attachmentStyle,
        primaryFears: (existingProfile.emotionalProfile as any)?.primaryFears,
        topStrengths: (existingProfile.emotionalProfile as any)?.topStrengths,
        emotionalChallenges: (existingProfile.emotionalProfile as any)?.emotionalChallenges,
        emotionalProfile: (existingProfile.emotionalProfile as any) || undefined,
        
        // Values and vision
        coreValues: existingProfile.coreValues || undefined,
        relationshipVision: existingProfile.relationshipVision || undefined,
        dealBreakers: existingProfile.dealBreakers || undefined,
        
        // Communication
        preferredCommunicationStyle: existingProfile.preferredCommunicationStyle || undefined,
        // Add a default communication style if missing
        communicationStyle: existingProfile.preferredCommunicationStyle || undefined,
        
        // Lifestyle - flatten for component compatibility
        workLifeBalance: (existingProfile.lifestylePriorities as any)?.workLifeBalance,
        socialEnergyLevel: (existingProfile.lifestylePriorities as any)?.socialEnergyLevel,
        hobbiesAndInterests: (existingProfile.lifestylePriorities as any)?.hobbiesAndInterests,
        lifestylePriorities: (existingProfile.lifestylePriorities as any) || undefined,
        
        // Self-reflection - flatten for component compatibility
        friendsDescription: (existingProfile.selfReflection as any)?.friendsDescription,
        proudestMoment: (existingProfile.selfReflection as any)?.proudestMoment,
        biggestGrowthArea: (existingProfile.selfReflection as any)?.biggestGrowthArea,
        personalStrengths: (existingProfile.selfReflection as any)?.personalStrengths,
        areasForImprovement: (existingProfile.selfReflection as any)?.areasForImprovement,
        selfReflection: (existingProfile.selfReflection as any) || undefined,
        
        // Legacy compatibility
        currentChallenges: existingProfile.currentChallenges?.length ? existingProfile.currentChallenges : undefined,
        personalityTraits: (existingProfile.personalityTraits as any) || undefined,
      });
      
      console.log('🔍 Assessment Debug - Assessment data set successfully');
      
      // Log what data was actually set
      setTimeout(() => {
        console.log('🔍 Assessment Debug - Current assessmentData state after setting:', {
          name: existingProfile.name,
          relationshipStatus: existingProfile.relationshipStatus,
          relationshipGoals: existingProfile.relationshipGoals,
          attachmentStyle: (existingProfile.emotionalProfile as any)?.attachmentStyle,
          hasEmotionalProfile: !!(existingProfile.emotionalProfile),
          hasSelfReflection: !!(existingProfile.selfReflection),
        });
      }, 100);
    } else {
      console.log('🔍 Assessment Debug - Conditions not met for loading profile data');
      console.log('  - isEditMode:', isEditMode);
      console.log('  - existingProfile exists:', !!existingProfile);
      console.log('  - profileLoading:', profileLoading);
    }
  }, [isEditMode, existingProfile, profileLoading]);

  // Show loading while checking assessment status or redirecting
  if (assessmentStatus?.isCompleted && !isEditMode) {
    return null;
  }

  // Show loading while profile data is being loaded in edit mode
  if (isEditMode && profileLoading) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Loading your profile data...
              </p>
            </div>
          </div>
        </div>
      </SimpleAppLayout>
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep]?.component;

  const handleNext = async (stepData?: any) => {
    if (stepData) {
      const updatedData = { ...assessmentData, ...stepData };
      setAssessmentData(updatedData);
      
      // Save progress - only for steps that actually have data (skip welcome step)
      if (currentStep > 0) {
        await updateStep.mutateAsync({
          step: STEPS[currentStep]!.id,
          data: stepData,
        });
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission - check if we have enhanced data
      const hasEnhancedData = assessmentData.name || 
        assessmentData.emotionalProfile || 
        assessmentData.coreValues || 
        assessmentData.selfReflection;
        
      if (hasEnhancedData) {
        // Submit enhanced assessment
        const enhancedData = {
          // Core identity
          name: assessmentData.name,
          age: assessmentData.age,
          location: assessmentData.location,
          gender: assessmentData.gender,
          
          // Required fields
          relationshipStatus: assessmentData.relationshipStatus!,
          relationshipGoals: assessmentData.relationshipGoals!,
          currentChallenges: assessmentData.currentChallenges || [],
          preferredCommunicationStyle: assessmentData.preferredCommunicationStyle!,
          personalityTraits: assessmentData.personalityTraits || {
            introversion: 3,
            empathy: 3,
            conflictStyle: 'collaborative',
            learningPreference: 'mixed',
            priorities: [],
          },
          
          // Enhanced fields - create clean objects to avoid circular references
          relationshipHistory: assessmentData.hasSignificantPast !== undefined ? {
            hasSignificantPast: assessmentData.hasSignificantPast,
            lastRelationshipDuration: assessmentData.lastRelationshipDuration,
            timeSinceLastRelationship: assessmentData.timeSinceLastRelationship,
            keyLessonsLearned: assessmentData.keyLessonsLearned,
            healingProgress: assessmentData.healingProgress,
          } : undefined,
          relationshipReadiness: assessmentData.relationshipReadiness,
          emotionalProfile: assessmentData.attachmentStyle ? {
            attachmentStyle: assessmentData.attachmentStyle,
            primaryFears: assessmentData.primaryFears,
            topStrengths: assessmentData.topStrengths,
            emotionalChallenges: assessmentData.emotionalChallenges,
          } : undefined,
          coreValues: assessmentData.coreValues || [],
          relationshipVision: assessmentData.relationshipVision || '',
          dealBreakers: assessmentData.dealBreakers || [],
          lifestylePriorities: assessmentData.workLifeBalance ? {
            workLifeBalance: assessmentData.workLifeBalance,
            socialEnergyLevel: assessmentData.socialEnergyLevel,
            hobbiesAndInterests: assessmentData.hobbiesAndInterests,
          } : undefined,
          selfReflection: assessmentData.friendsDescription ? {
            friendsDescription: assessmentData.friendsDescription,
            proudestMoment: assessmentData.proudestMoment,
            biggestGrowthArea: assessmentData.biggestGrowthArea,
            personalStrengths: assessmentData.personalStrengths,
            areasForImprovement: assessmentData.areasForImprovement,
          } : undefined,
        };
        await submitEnhancedAssessment.mutateAsync(enhancedData);
      } else {
        // Fallback to legacy submission
        const cleanData = {
          relationshipStatus: assessmentData.relationshipStatus!,
          relationshipGoals: assessmentData.relationshipGoals!,
          currentChallenges: assessmentData.currentChallenges!,
          preferredCommunicationStyle: assessmentData.preferredCommunicationStyle!,
          personalityTraits: assessmentData.personalityTraits!,
        };
        await submitAssessment.mutateAsync(cleanData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isWelcomeStep = currentStep === 0;
  const isSummaryStep = currentStep === STEPS.length - 1;

  return (
    <SimpleAppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isEditMode ? t('editProfileTitle') : t('profileTitle')}</CardTitle>
                <CardDescription>
                  {isEditMode ? t('editProfileDescription') : t('profileDescription')}
                </CardDescription>
              </div>
              {!isWelcomeStep && (
                <div className="text-sm text-gray-500">
                  {t('step', { current: currentStep, total: STEPS.length - 1 })}
                </div>
              )}
            </div>
            {!isWelcomeStep && (
              <div className="mt-4">
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={assessmentData}
                onNext={handleNext}
                onBack={handleBack}
                canGoBack={currentStep > 1}
                isLoading={submitAssessment.isPending || submitEnhancedAssessment.isPending || updateStep.isPending}
                isLastStep={isSummaryStep}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </SimpleAppLayout>
  );
}
