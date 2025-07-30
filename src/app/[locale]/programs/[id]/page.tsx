"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Play,
  Loader2,
} from "lucide-react";
import { TaskStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function ProgramDetailPage() {
  const t = useTranslations("programDetailPage");
  const tProgram = useTranslations("coachingProgram");
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  // Function to get translated program content
  const getTranslatedProgram = (program: any) => {
    // If the program name matches our main coaching program, use translations
    if (
      program.name === "AI Relationship Coaching Program" ||
      program.name === "תכנית אימון זוגי עם AI"
    ) {
      return {
        name: tProgram("name"),
        description: tProgram("description"),
      };
    }
    // Otherwise, return the original content
    return {
      name: program.name,
      description: program.description,
    };
  };

  // Function to get translated phase content
  const getTranslatedPhase = (phase: any) => {
    // Map of known phase names to their translation keys
    const phaseTranslationMap: Record<string, string> = {
      "Self-Discovery": "selfDiscovery",
      "Past Relationship Patterns": "pastRelationshipPatterns",
      "Inner Blocks & Fears": "innerBlocksFears",
      "Emotional Regulation": "emotionalRegulation",
      "Self-Compassion & Confidence": "selfCompassionConfidence",
      "Communication & Expression": "communicationExpression",
      "Boundaries & Standards": "boundariesStandards",
      "Ideal Partner & Vision": "idealPartnerVision",
      "Real-Life Exposure": "realLifeExposure",
      "Handling Rejection & Uncertainty": "handlingRejectionUncertainty",
      "Healthy Attraction": "healthyAttraction",
      "Integration & Readiness": "integrationReadiness",
    };

    const translationKey = phaseTranslationMap[phase.name];
    if (translationKey) {
      return {
        name: tProgram(`phases.${translationKey}.name`),
        description: tProgram(`phases.${translationKey}.description`),
      };
    }

    // Return original content if no translation found
    return {
      name: phase.name,
      description: phase.description,
    };
  };

  const { data: program, isLoading } = api.programs.getById.useQuery({
    id: programId,
  });
  const { data: userProgress } = api.programs.getUserProgress.useQuery({
    programId,
  });

  const enrollMutation = api.programs.enroll.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const startTaskMutation = api.tasks.startTask.useMutation();

  if (isLoading) {
    return (
      <AppLayout title={t("loadingTitle")} showBackButton={true}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!program) {
    return (
      <AppLayout title={t("notFoundTitle")} showBackButton={true}>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            {t("notFoundDescription")}
          </p>
          <Button onClick={() => router.push("/programs")} className="mt-4">
            {t("backToPrograms")}
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
      .flatMap((phase) => phase.tasks)
      .find((task) => task.id === taskId)?.taskProgress[0];

    return taskProgress?.status || TaskStatus.NOT_STARTED;
  };

  const getStageProgress = (stageIndex: number) => {
    if (!userProgress) return { completed: 0, total: 0 };

    const stage = program.phases[stageIndex];
    const total = stage.tasks.length;
    const completed = stage.tasks.filter(
      (task) => getTaskStatus(task.id) === TaskStatus.COMPLETED
    ).length;

    return { completed, total };
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await startTaskMutation.mutateAsync({ taskId });
      // Navigate to task page
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Failed to start task:", error);
    }
  };

  const handleContinueTask = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleEnroll = () => {
    enrollMutation.mutate({ programId });
  };

  const translatedProgram = getTranslatedProgram(program);

  return (
    <AppLayout
      title={translatedProgram.name}
      description={translatedProgram.description}
      showBackButton={true}
    >
      <div className="max-w-6xl mx-auto">
        {/* Program Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {translatedProgram.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {translatedProgram.description}
                </CardDescription>
              </div>
              {isEnrolled ? (
                <Badge variant="default" className="ml-4">
                  {t("enrolled")}
                </Badge>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? t("enrolling") : t("enrollNow")}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{t("duration", { count: program.duration })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{t("stages", { count: program.phases.length })}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>
                  {t("tasks", {
                    count: program.phases.reduce(
                      (sum, phase) => sum + phase.tasks.length,
                      0
                    ),
                  })}
                </span>
              </div>
            </div>

            {isEnrolled && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{t("overallProgress")}</span>
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
              <CardTitle className="text-lg">{t("programStages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {program.phases.map((phase, index) => {
                  const stageProgress = getStageProgress(index);
                  const isSelected = selectedStageIndex === index;
                  const isCompleted =
                    stageProgress.completed === stageProgress.total &&
                    stageProgress.total > 0;

                  return (
                    <button
                      key={phase.id}
                      onClick={() => setSelectedStageIndex(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {(() => {
                        const translatedPhase = getTranslatedPhase(phase);
                        return (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">
                                {t("stage", {
                                  number: index + 1,
                                  name: translatedPhase.name,
                                })}
                              </span>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                              {translatedPhase.description}
                            </p>
                          </>
                        );
                      })()}
                      {isEnrolled && (
                        <div className="text-xs text-gray-500">
                          {t("tasksCompleted", {
                            completed: stageProgress.completed,
                            total: stageProgress.total,
                          })}
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
            {currentStage &&
              (() => {
                const translatedCurrentStage = getTranslatedPhase(currentStage);
                return (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">
                              {t("stage", {
                                number: selectedStageIndex + 1,
                                name: translatedCurrentStage.name,
                              })}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {translatedCurrentStage.description}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedStageIndex(
                                  Math.max(0, selectedStageIndex - 1)
                                )
                              }
                              disabled={selectedStageIndex === 0}
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedStageIndex(
                                  Math.min(
                                    program.phases.length - 1,
                                    selectedStageIndex + 1
                                  )
                                )
                              }
                              disabled={
                                selectedStageIndex === program.phases.length - 1
                              }
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Stage Tasks */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {t("tasksInStage")}
                      </h3>
                      {currentStage.tasks.map((task, taskIndex) => {
                        const taskStatus = getTaskStatus(task.id);
                        const isCompleted = taskStatus === TaskStatus.COMPLETED;
                        const isInProgress =
                          taskStatus === TaskStatus.IN_PROGRESS;

                        return (
                          <Card
                            key={task.id}
                            className={
                              isCompleted
                                ? "border-green-200 bg-green-50 dark:bg-green-900/10"
                                : ""
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">
                                      {taskIndex + 1}. {task.title}
                                    </span>
                                    <Badge
                                      variant={
                                        task.type === "REFLECTION"
                                          ? "default"
                                          : task.type === "EXERCISE"
                                          ? "secondary"
                                          : "outline"
                                      }
                                    >
                                      {task.type.toLowerCase()}
                                    </Badge>
                                    {isCompleted && (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                    {isInProgress && (
                                      <Clock className="w-4 h-4 text-blue-500" />
                                    )}
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
                                      {t("startTask")}
                                    </Button>
                                  ) : isInProgress ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleContinueTask(task.id)
                                      }
                                    >
                                      {t("continueTask")}
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleContinueTask(task.id)
                                      }
                                    >
                                      {t("reviewTask")}
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
                );
              })()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
