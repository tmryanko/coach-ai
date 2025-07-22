'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  Play,
  Loader2
} from 'lucide-react';
import { TaskStatus } from '@prisma/client';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  
  const { data: program, isLoading } = api.programs.getById.useQuery({ id: programId });
  const { data: userProgress } = api.programs.getUserProgress.useQuery({ programId });
  
  const enrollMutation = api.programs.enroll.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const startTaskMutation = api.tasks.startTask.useMutation();

  if (isLoading) {
    return (
      <AppLayout title="Loading Program..." showBackButton={true}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!program) {
    return (
      <AppLayout title="Program Not Found" showBackButton={true}>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">This program could not be found.</p>
          <Button onClick={() => router.push('/programs')} className="mt-4">
            Back to Programs
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isEnrolled = !!userProgress;
  const progressPercentage = userProgress 
    ? (userProgress.completedTasks / userProgress.totalTasks) * 100 
    : 0;

  const currentStage = program.phases[selectedStageIndex];
  
  const getTaskStatus = (taskId: string) => {
    if (!userProgress) return TaskStatus.NOT_STARTED;
    
    const taskProgress = userProgress.program.phases
      .flatMap(phase => phase.tasks)
      .find(task => task.id === taskId)
      ?.taskProgress[0];
    
    return taskProgress?.status || TaskStatus.NOT_STARTED;
  };

  const getStageProgress = (stageIndex: number) => {
    if (!userProgress) return { completed: 0, total: 0 };
    
    const stage = program.phases[stageIndex];
    const total = stage.tasks.length;
    const completed = stage.tasks.filter(task => 
      getTaskStatus(task.id) === TaskStatus.COMPLETED
    ).length;
    
    return { completed, total };
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await startTaskMutation.mutateAsync({ taskId });
      // Navigate to task page
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Failed to start task:', error);
    }
  };

  const handleContinueTask = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleEnroll = () => {
    enrollMutation.mutate({ programId });
  };

  return (
    <AppLayout 
      title={program.name} 
      description={program.description}
      showBackButton={true}
    >
      <div className="max-w-6xl mx-auto">
        {/* Program Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{program.name}</CardTitle>
                <CardDescription className="text-base">
                  {program.description}
                </CardDescription>
              </div>
              {isEnrolled ? (
                <Badge variant="default" className="ml-4">Enrolled</Badge>
              ) : (
                <Button onClick={handleEnroll} disabled={enrollMutation.isPending}>
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{program.duration} days</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{program.phases.length} stages</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{program.phases.reduce((sum, phase) => sum + phase.tasks.length, 0)} tasks</span>
              </div>
            </div>

            {isEnrolled && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stages Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Program Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {program.phases.map((phase, index) => {
                  const stageProgress = getStageProgress(index);
                  const isSelected = selectedStageIndex === index;
                  const isCompleted = stageProgress.completed === stageProgress.total && stageProgress.total > 0;
                  
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setSelectedStageIndex(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          Stage {index + 1}: {phase.name}
                        </span>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {phase.description}
                      </p>
                      {isEnrolled && (
                        <div className="text-xs text-gray-500">
                          {stageProgress.completed}/{stageProgress.total} tasks completed
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stage Details */}
          <div className="lg:col-span-2 space-y-6">
            {currentStage && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          Stage {selectedStageIndex + 1}: {currentStage.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {currentStage.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStageIndex(Math.max(0, selectedStageIndex - 1))}
                          disabled={selectedStageIndex === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStageIndex(Math.min(program.phases.length - 1, selectedStageIndex + 1))}
                          disabled={selectedStageIndex === program.phases.length - 1}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Stage Tasks */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tasks in this Stage</h3>
                  {currentStage.tasks.map((task, taskIndex) => {
                    const taskStatus = getTaskStatus(task.id);
                    const isCompleted = taskStatus === TaskStatus.COMPLETED;
                    const isInProgress = taskStatus === TaskStatus.IN_PROGRESS;
                    
                    return (
                      <Card key={task.id} className={isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{taskIndex + 1}. {task.title}</span>
                                <Badge variant={task.type === 'REFLECTION' ? 'default' : task.type === 'EXERCISE' ? 'secondary' : 'outline'}>
                                  {task.type.toLowerCase()}
                                </Badge>
                                {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {isInProgress && <Clock className="w-4 h-4 text-blue-500" />}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                {task.description}
                              </p>
                            </div>
                          </div>
                          
                          {isEnrolled && (
                            <div className="flex justify-end">
                              {!isCompleted && !isInProgress ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStartTask(task.id)}
                                  disabled={startTaskMutation.isPending}
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  Start Task
                                </Button>
                              ) : isInProgress ? (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleContinueTask(task.id)}
                                >
                                  Continue Task
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleContinueTask(task.id)}
                                >
                                  Review Task
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}