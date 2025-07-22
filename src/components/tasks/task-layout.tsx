'use client';

import { useState, useEffect } from 'react';
import { SimpleAppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Target, Focus } from 'lucide-react';
import { TaskStatus, TaskType } from '@prisma/client';
import { TaskChat } from './task-chat';

interface TaskLayoutProps {
  task: {
    id: string;
    title: string;
    description: string;
    type: TaskType;
    content: any;
    phase: {
      name: string;
      program: {
        id: string;
        name: string;
      };
    };
  } | null;
  taskProgress: {
    status: TaskStatus;
    response?: string | null;
    feedback?: string | null;
  } | null;
  onBack: () => void;
  onTaskComplete?: () => void;
  children: React.ReactNode;
}

export function TaskLayout({ task, taskProgress, onBack, onTaskComplete, children }: TaskLayoutProps) {
  const [coachMessage, setCoachMessage] = useState<string>('');

  useEffect(() => {
    if (task) {
      generateCoachWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const generateCoachWelcomeMessage = () => {
    if (!task) return;

    // Generate personalized welcome message based on task type and content
    let message = '';
    
    switch (task.type) {
      case TaskType.REFLECTION:
        message = `Let's do this together. I'll guide you step by step through this reflection. First — take a deep breath and think about what truly matters to you. This is a safe space to explore your thoughts and feelings.`;
        break;
      case TaskType.ASSESSMENT:
        message = `Welcome to your assessment! I'm here to help you explore important aspects of yourself. Take your time with each question — there are no right or wrong answers, only honest insights about who you are.`;
        break;
      case TaskType.EXERCISE:
        message = `Ready for some practical work? I'll guide you through this exercise step by step. Remember, this is about progress, not perfection. Let's take this journey together.`;
        break;
      case TaskType.JOURNALING:
        message = `Time for some personal reflection through writing. I'll be here to support you as you explore your thoughts and feelings. Let your authentic voice flow onto the page.`;
        break;
      case TaskType.COMMUNICATION:
        message = `Let's practice some communication skills together! This is a safe space to try new approaches and build your confidence. I'll provide guidance as you work through the exercises.`;
        break;
      default:
        message = `I'm here to support you through this task. Take your time, be honest with yourself, and remember — every step forward is progress worth celebrating.`;
    }

    setCoachMessage(message);
  };

  const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
      case TaskType.REFLECTION:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case TaskType.ASSESSMENT:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case TaskType.EXERCISE:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case TaskType.JOURNALING:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case TaskType.COMMUNICATION:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <SimpleAppLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>

          {task && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{task.phase.program.name}</span>
                <span>•</span>
                <span>{task.phase.name}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <Badge className={getTaskTypeColor(task.type)}>
                  {task.type.toLowerCase()}
                </Badge>
                {taskProgress && (
                  <Badge className={getStatusColor(taskProgress.status)}>
                    {taskProgress.status.toLowerCase().replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {task.description}
              </p>
            </div>
          )}
        </div>

        {/* AI Coach Message */}
        {coachMessage && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Your AI Coach
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    {coachMessage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Content */}
        {task?.content && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="space-y-3">
                {task.content.goal && (
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.content.goal}</p>
                    </div>
                  </div>
                )}
                {task.content.focus && (
                  <div className="flex items-start gap-2">
                    <Focus className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Focus</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.content.focus}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Task Interface */}
        <Card>
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>

        {/* AI Coach Chat */}
        {task && (
          <div className="mt-6">
            <TaskChat 
              taskId={task.id} 
              taskTitle={task.title}
              onTaskCompletion={onTaskComplete}
            />
          </div>
        )}

        {/* Feedback Section */}
        {taskProgress?.feedback && (
          <Card className="mt-6 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg text-green-900 dark:text-green-100 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Coach Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 dark:text-green-200 leading-relaxed">
                {taskProgress.feedback}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SimpleAppLayout>
  );
}