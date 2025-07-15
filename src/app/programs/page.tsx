'use client';

import { api } from '@/utils/api';
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
      // Refresh user progress
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading programs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Coaching Programs</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose from our structured programs designed to help you build stronger relationships.
          </p>
        </div>

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
                      <CardDescription className="mt-2">
                        {program.description}
                      </CardDescription>
                    </div>
                    {isEnrolled && (
                      <Badge variant="secondary" className="ml-2">
                        Enrolled
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{program.phases.length} phases</span>
                    </div>
                  </div>

                  {isEnrolled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{userProg.completedTasks}/{userProg.totalTasks} tasks</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Program Overview:</h4>
                    <div className="space-y-1">
                      {program.phases.map((phase, index) => (
                        <div key={phase.id} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">{phase.name}</span>
                          <span className="text-xs text-gray-500">
                            ({phase.tasks.length} tasks)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    {isEnrolled ? (
                      <Button asChild className="w-full">
                        <a href={`/programs/${program.id}`}>
                          {userProg.completedAt ? 'Review Program' : 'Continue Program'}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEnroll(program.id)}
                        disabled={enrollMutation.isPending}
                        className="w-full"
                      >
                        {enrollMutation.isPending ? 'Enrolling...' : 'Start Program'}
                      </Button>
                    )}
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
      </div>
    </div>
  );
}