'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { SimpleAppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AssessmentWelcome } from '@/components/assessment/welcome';
import { RelationshipStatusStep } from '@/components/assessment/relationship-status';
import { GoalsStep } from '@/components/assessment/goals';
import { ChallengesStep } from '@/components/assessment/challenges';
import { CommunicationStep } from '@/components/assessment/communication';
import { PersonalityStep } from '@/components/assessment/personality';
import { SummaryStep } from '@/components/assessment/summary';
import { AssessmentData } from '@/types/assessment';

const STEPS = [
  { id: 'welcome', title: 'Welcome', component: AssessmentWelcome },
  { id: 'relationship-status', title: 'Relationship Status', component: RelationshipStatusStep },
  { id: 'goals', title: 'Goals & Priorities', component: GoalsStep },
  { id: 'challenges', title: 'Current Challenges', component: ChallengesStep },
  { id: 'communication', title: 'Communication Style', component: CommunicationStep },
  { id: 'personality', title: 'Personality & Learning', component: PersonalityStep },
  { id: 'summary', title: 'Summary', component: SummaryStep },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({});
  
  const submitAssessment = api.assessment.submit.useMutation({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const updateStep = api.assessment.updateStep.useMutation();

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
      // Final submission - only send required fields
      const cleanData = {
        relationshipStatus: assessmentData.relationshipStatus!,
        relationshipGoals: assessmentData.relationshipGoals!,
        currentChallenges: assessmentData.currentChallenges!,
        preferredCommunicationStyle: assessmentData.preferredCommunicationStyle!,
        personalityTraits: assessmentData.personalityTraits!,
      };
      await submitAssessment.mutateAsync(cleanData);
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
                <CardTitle>Personal Coaching Profile</CardTitle>
                <CardDescription>
                  Help us understand you better to provide personalized coaching
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
                isLoading={submitAssessment.isPending || updateStep.isPending}
                isLastStep={isSummaryStep}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </SimpleAppLayout>
  );
}