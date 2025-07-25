'use client';

import { api } from '@/utils/api';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

export default function ProgramsPage() {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  
  const { data: programs, isLoading } = api.programs.getAll.useQuery(undefined, {
    enabled: typeof window !== 'undefined',
  });
  const { data: userProgress } = api.user.getProgress.useQuery(undefined, {
    enabled: !!user && typeof window !== 'undefined',
  });

  const enrollMutation = api.programs.enroll.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const handleEnroll = (programId: string) => {
    enrollMutation.mutate({ programId });
  };

  const getUserProgressForProgram = (programId: string) => {
    return userProgress?.find(p => p.programId === programId);
  };

  if (isLoading) {
    return (
      <AppLayout 
        title="Coaching Programs"
        description="Choose from our structured programs designed to help you build stronger relationships"
        showBackButton={true}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading programs...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Coaching Programs"
      description="Choose from our structured programs designed to help you build stronger relationships"
      showBackButton={true}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs?.map((program) => {
          const userProg = getUserProgressForProgram(program.id);
          const isEnrolled = !!userProg;
          const progressPercentage = userProg 
            ? (userProg.completedTasks / userProg.totalTasks) * 100 
            : 0;

          return (
            <Card key={program.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {program.description}
                    </CardDescription>
                  </div>
                  {isEnrolled && (
                    <Badge variant="default" className="ml-2">
                      Enrolled
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{program.phases?.length || 0} phases</span>
                    </div>
                  </div>

                  {isEnrolled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Program Structure:</h4>
                    <div className="space-y-1">
                      {program.phases?.map((phase, index) => (
                        <div key={phase.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-300">
                            {index + 1}. {phase.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({phase.tasks.length} tasks)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    {isEnrolled ? (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/programs/${program.id}`}>
                          Continue Program
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(program.id)}
                        className="w-full"
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? 'Enrolling...' : 'Start Program'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {programs?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            No coaching programs are currently available. Check back soon!
          </p>
        </div>
      )}
    </AppLayout>
  );
}