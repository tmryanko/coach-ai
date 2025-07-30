'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatus } from '@prisma/client';
import { CheckCircle, Clock } from 'lucide-react';
import { api } from '@/utils/api';
import { useTranslations } from 'next-intl';

interface JournalingTaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    content: any;
  };
  taskProgress: {
    status: TaskStatus;
    response?: string | null;
  };
  onComplete: () => void;
}

export function JournalingTask({ task, taskProgress, onComplete }: JournalingTaskProps) {
  const t = useTranslations('taskComponents.journalingTask');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompleted = taskProgress?.status === TaskStatus.COMPLETED;

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

  if (isCompleted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
          {t('completedTitle')}
        </h3>
        <p className="text-green-700 dark:text-green-300">
          {t('completedDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('comingSoonTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('comingSoonDescription')}
          </p>
          <Button 
            onClick={async () => {
              setIsSubmitting(true);
              try {
                await submitResponseMutation.mutateAsync({
                  taskId: task.id,
                  response: JSON.stringify({
                    completed: true,
                    completedAt: new Date().toISOString(),
                    type: 'journaling_placeholder'
                  }),
                });
              } catch (error) {
                console.error('Failed to complete journaling:', error);
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                {t('completing')}
              </>
            ) : (
              t('markAsComplete')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
