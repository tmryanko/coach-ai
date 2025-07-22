'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatus } from '@prisma/client';
import { CheckCircle, Clock } from 'lucide-react';
import { api } from '@/utils/api';

interface CommunicationTaskProps {
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

export function CommunicationTask({ task, taskProgress, onComplete }: CommunicationTaskProps) {
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
          Communication Practice Completed!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          You&apos;ve successfully completed this communication task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Practice Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Communication task interface is being developed. For now, you can mark this task as complete.
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
                    type: 'communication_placeholder'
                  }),
                });
              } catch (error) {
                console.error('Failed to complete communication:', error);
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              'Mark as Complete'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}