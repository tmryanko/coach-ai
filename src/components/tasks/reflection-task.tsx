'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/utils/api';
import { TaskStatus } from '@prisma/client';
import { CheckCircle, Clock, Lightbulb, Send } from 'lucide-react';

interface ReflectionTaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    content: {
      goal?: string;
      focus?: string;
      prompts?: string[];
    };
  };
  taskProgress: {
    status: TaskStatus;
    response?: string | null;
  };
  onComplete: () => void;
}

export function ReflectionTask({ task, taskProgress, onComplete }: ReflectionTaskProps) {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const submitResponseMutation = api.tasks.submitResponse.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      onComplete();
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error('Failed to submit task:', error);
    },
  });

  const generateFeedbackMutation = api.ai.generateTaskFeedback.useMutation();

  // Initialize responses from existing task progress
  useEffect(() => {
    if (taskProgress?.response) {
      try {
        const existingResponses = JSON.parse(taskProgress.response);
        setResponses(existingResponses);
        if (Object.keys(existingResponses).length > 0) {
          setShowSubmitForm(true);
        }
      } catch {
        // If response is not JSON, treat as old format
        setResponses({ general: taskProgress.response });
      }
    }
  }, [taskProgress]);

  const prompts = task.content.prompts || [];
  const isCompleted = taskProgress?.status === TaskStatus.COMPLETED;

  const handleResponseChange = (key: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStepComplete = () => {
    if (currentStep < prompts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSubmitForm(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create structured response
      const structuredResponse = {
        prompts: prompts.reduce((acc, prompt, index) => {
          acc[`prompt_${index}`] = responses[`prompt_${index}`] || '';
          return acc;
        }, {} as { [key: string]: string }),
        reflection: responses.reflection || '',
        completedAt: new Date().toISOString(),
      };

      // Submit the response
      await submitResponseMutation.mutateAsync({
        taskId: task.id,
        response: JSON.stringify(structuredResponse),
      });

      // Generate AI feedback
      const responseText = Object.values(structuredResponse.prompts).join('\n\n') + 
        (structuredResponse.reflection ? `\n\nReflection: ${structuredResponse.reflection}` : '');
      
      await generateFeedbackMutation.mutateAsync({
        taskId: task.id,
        userResponse: responseText,
      });

    } catch (error) {
      setIsSubmitting(false);
      console.error('Failed to submit reflection:', error);
    }
  };

  const canProceed = () => {
    const currentPromptKey = `prompt_${currentStep}`;
    return responses[currentPromptKey]?.trim().length > 0;
  };

  const canSubmit = () => {
    return prompts.every((_, index) => 
      responses[`prompt_${index}`]?.trim().length > 0
    );
  };

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
            Reflection Completed!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            You&apos;ve successfully completed this reflection task. Your responses have been saved.
          </p>
        </div>

        {/* Show completed responses */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Your Responses:</h4>
          {prompts.map((prompt, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
                  {prompt}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {responses[`prompt_${index}`] || 'No response recorded'}
                </p>
              </CardContent>
            </Card>
          ))}
          {responses.reflection && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
                  Additional Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {responses.reflection}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!showSubmitForm) {
    // Step-by-step prompt completion
    const currentPrompt = prompts[currentStep];
    const currentPromptKey = `prompt_${currentStep}`;

    return (
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Step {currentStep + 1} of {prompts.length}
            </Badge>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-sm text-gray-500">
            {Math.round(((currentStep) / prompts.length) * 100)}% complete
          </div>
        </div>

        {/* Current prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-lg">{currentPrompt}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Take your time to reflect and share your thoughts..."
              value={responses[currentPromptKey] || ''}
              onChange={(e) => handleResponseChange(currentPromptKey, e.target.value)}
              className="min-h-32"
              disabled={isSubmitting}
            />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0 || isSubmitting}
              >
                Previous
              </Button>
              <Button
                onClick={handleStepComplete}
                disabled={!canProceed() || isSubmitting}
              >
                {currentStep === prompts.length - 1 ? 'Continue to Summary' : 'Next Prompt'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress through prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`p-3 text-left text-xs rounded-lg border transition-colors ${
                index === currentStep
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : responses[`prompt_${index}`]
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Prompt {index + 1}</span>
                {responses[`prompt_${index}`] && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Final submission form
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold mb-2">Review Your Reflection</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Review your responses below and add any final thoughts before submitting.
        </p>
      </div>

      {/* Summary of responses */}
      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
                {prompt}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={responses[`prompt_${index}`] || ''}
                onChange={(e) => handleResponseChange(`prompt_${index}`, e.target.value)}
                className="min-h-20"
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Additional Reflection (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional thoughts or insights you'd like to share?"
            value={responses.reflection || ''}
            onChange={(e) => handleResponseChange('reflection', e.target.value)}
            className="min-h-24"
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Submit button */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setShowSubmitForm(false)}
          disabled={isSubmitting}
        >
          Back to Prompts
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Complete Reflection
            </>
          )}
        </Button>
      </div>
    </div>
  );
}