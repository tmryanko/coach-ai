'use client';

import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { TaskLayout } from '@/components/tasks/task-layout';
import { ReflectionTask } from '@/components/tasks/reflection-task';
import { AssessmentTask } from '@/components/tasks/assessment-task';
import { ExerciseTask } from '@/components/tasks/exercise-task';
import { JournalingTask } from '@/components/tasks/journaling-task';
import { CommunicationTask } from '@/components/tasks/communication-task';
import { TaskType } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TaskPage() {
  const t = useTranslations('taskPage');
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;
  const utils = api.useUtils();

  const { data: taskProgress, isLoading } = api.tasks.getTaskProgress.useQuery({ taskId });

  if (isLoading) {
    return (
      <TaskLayout 
        task={null}
        taskProgress={null}
        onBack={() => router.back()}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </TaskLayout>
    );
  }

  if (!taskProgress?.task) {
    return (
      <TaskLayout 
        task={null}
        taskProgress={null}
        onBack={() => router.back()}
      >
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('taskNotFound')}
          </p>
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t('goBack')}
          </button>
        </div>
      </TaskLayout>
    );
  }

  const task = taskProgress.task;
  const programId = task.phase.program.id;

  const handleTaskComplete = () => {
    // Refresh task progress to update status
    void utils.tasks.getTaskProgress.invalidate({ taskId });
    // Navigate back to program page
    router.push(`/programs/${programId}`);
  };

  const renderTaskComponent = () => {
    // Type assertion for task content since it comes from database as JsonValue
    const typedTask = {
      ...task,
      content: task.content as any
    };

    const taskProps = {
      task: typedTask,
      taskProgress,
      onComplete: handleTaskComplete,
    };

    switch (task.type) {
      case TaskType.REFLECTION:
        return <ReflectionTask {...taskProps} />;
      case TaskType.ASSESSMENT:
        return <AssessmentTask {...taskProps} />;
      case TaskType.EXERCISE:
        return <ExerciseTask {...taskProps} />;
      case TaskType.JOURNALING:
        return <JournalingTask {...taskProps} />;
      case TaskType.COMMUNICATION:
        return <CommunicationTask {...taskProps} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              {t('unsupportedTaskType', { taskType: task.type })}
            </p>
          </div>
        );
    }
  };

  return (
    <TaskLayout 
      task={task}
      taskProgress={taskProgress}
      onBack={() => router.push(`/programs/${programId}`)}
    >
      {renderTaskComponent()}
    </TaskLayout>
  );
}