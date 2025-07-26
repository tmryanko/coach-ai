'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const isEditMode = searchParams.get('edit') === 'true';
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<StepComponentData>({});
  
  const { data: assessmentStatus } = api.assessment.getStatus.useQuery();
  const { data: existingProfile } = api.assessment.getProfile.useQuery(undefined, {
    enabled: isEditMode
  });
  
  const submitAssessment = api.assessment.submit.useMutation({
    onSuccess: () => {
      if (isEditMode) {
        router.push('/profile');
      } else {
        router.push('/dashboard');
      }
    },
  });

  const submitEnhancedAssessment = api.assessment.submitEnhanced.useMutation({
    onSuccess: () => {
      if (isEditMode) {
        router.push('/profile');
      } else {
        router.push('/dashboard');
      }
    },
  });

  const updateStep = api.assessment.updateStep.useMutation();

  // If user has already completed assessment and not in edit mode, redirect to profile
  useEffect(() => {
    if (assessmentStatus?.isCompleted && !isEditMode) {
      router.push('/profile');
    }
  }, [assessmentStatus?.isCompleted, isEditMode, router]);

  // Pre-populate assessment data with existing profile when in edit mode
  useEffect(() => {
    if (isEditMode && existingProfile) {
      setAssessmentData({
        // Core identity
        name: existingProfile.name || undefined,
        age: existingProfile.age || undefined,
        location: existingProfile.location || undefined,
        gender: existingProfile.gender || undefined,
        
        // Relationship data
        relationshipStatus: existingProfile.relationshipStatus || undefined,
        relationshipHistory: (existingProfile.relationshipHistory as any) || undefined,
        relationshipGoals: existingProfile.relationshipGoals || undefined,
        relationshipReadiness: existingProfile.relationshipReadiness || undefined,
        
        // Emotional profile
        emotionalProfile: (existingProfile.emotionalProfile as any) || undefined,
        
        // Values and vision
        coreValues: existingProfile.coreValues || undefined,
        relationshipVision: existingProfile.relationshipVision || undefined,
        dealBreakers: existingProfile.dealBreakers || undefined,
        
        // Communication
        preferredCommunicationStyle: existingProfile.preferredCommunicationStyle || undefined,
        
        // Lifestyle
        lifestylePriorities: (existingProfile.lifestylePriorities as any) || undefined,
        
        // Self-reflection
        selfReflection: (existingProfile.selfReflection as any) || undefined,
        
        // Legacy compatibility
        currentChallenges: existingProfile.currentChallenges || undefined,
        personalityTraits: (existingProfile.personalityTraits as any) || undefined,
      });
    }
  }, [isEditMode, existingProfile]);

  // Show loading while checking assessment status or redirecting
  if (assessmentStatus?.isCompleted && !isEditMode) {
    return null;
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
          
          // Enhanced fields
          relationshipHistory: assessmentData.relationshipHistory,
          relationshipReadiness: assessmentData.relationshipReadiness,
          emotionalProfile: assessmentData.emotionalProfile,
          coreValues: assessmentData.coreValues || [],
          relationshipVision: assessmentData.relationshipVision || '',
          dealBreakers: assessmentData.dealBreakers || [],
          lifestylePriorities: assessmentData.lifestylePriorities,
          selfReflection: assessmentData.selfReflection,
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
                <CardTitle>{isEditMode ? 'Edit Your Profile' : 'Personal Coaching Profile'}</CardTitle>
                <CardDescription>
                  {isEditMode ? 'Update your information to keep your coaching personalized' : 'Help us understand you better to provide personalized coaching'}
                </CardDescription>
              </div>
              {!isWelcomeStep && (
                <div className="text-sm text-gray-500">
                  Step {currentStep} of {STEPS.length - 1}
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