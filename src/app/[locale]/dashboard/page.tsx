"use client";

import { useTranslations, useLocale } from "next-intl";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const { data: profile, isLoading: profileLoading } =
    api.assessment.getProfile.useQuery();
  const { data: userProfile } = api.user.getProfile.useQuery();
  const { data: progress } = api.user.getProgress.useQuery();
  const { data: recommendations } = api.programs.getRecommendations.useQuery();

  // Check if user has completed assessment
  useEffect(() => {
    if (!profileLoading && !profile && user) {
      router.push(`/${locale}/assessment`);
    }
  }, [profile, profileLoading, user, router, locale]);

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">{t("loading")}</div>
        </div>
      </AppLayout>
    );
  }

  const getWelcomeMessage = () => {
    if (profile?.relationshipStatus === "single") {
      return t("welcomeMessages.single");
    } else if (profile?.relationshipStatus === "dating") {
      return t("welcomeMessages.dating");
    } else if (
      ["committed", "engaged", "married"].includes(
        profile?.relationshipStatus || ""
      )
    ) {
      return t("welcomeMessages.committed");
    }
    return t("welcomeMessages.default");
  };

  const getPrimaryGoal = () => {
    if (profile?.relationshipGoals && profile.relationshipGoals.length > 0) {
      const goalKey = profile.relationshipGoals[0];
      return t(`goalLabels.${goalKey}`) || t("goalLabels.default");
    }
    return t("goalLabels.default");
  };

  return (
    <AppLayout
      title={t("welcomeBack", {
        name: userProfile?.name || user?.user_metadata?.name || "there",
      })}
      description={getWelcomeMessage()}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("sections.progress")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("progressLabels.programsStarted")}
                  </span>
                  <span className="font-medium">{progress?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("progressLabels.primaryGoal")}
                  </span>
                  <span className="font-medium text-sm capitalize">
                    {getPrimaryGoal()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("progressLabels.challenges")}
                  </span>
                  <span className="font-medium">
                    {profile?.currentChallenges?.length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("sections.style")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("progressLabels.communication")}
                  </span>
                  <p className="text-sm font-medium capitalize">
                    {profile?.preferredCommunicationStyle?.replace("-", " ") ||
                      t("progressLabels.notSet")}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("progressLabels.learning")}
                  </span>
                  <p className="text-sm font-medium capitalize">
                    {(
                      profile?.personalityTraits as any
                    )?.learningPreference?.replace("-", " ") ||
                      t("progressLabels.notSet")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("sections.quickActions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full" size="sm">
                  <Link href="/chat">{t("buttons.startCoaching")}</Link>
                </Button>
                <Button asChild className="w-full" variant="outline" size="sm">
                  <Link href="/assessment">{t("buttons.updateProfile")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.recommendedPrograms")}</CardTitle>
              <CardDescription>
                {recommendations?.userProfile ? 
                  `Personalized for ${recommendations.userProfile.relationshipStatus || 'your'} relationship journey` :
                  t("programs.basedOnGoals", { goal: getPrimaryGoal() })
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations?.recommendations?.slice(0, 2).map((program) => (
                  <div key={program.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg">{program.name}</h3>
                      {program.isEnrolled ? (
                        <Badge variant="default" className="ml-2">Enrolled</Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2">Recommended</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2 font-medium">
                      {program.customization.personalizedMessage}
                    </p>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {program.customization.description}
                    </p>

                    {program.customization.highlightedStages.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Key stages for you:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {program.customization.highlightedStages.slice(0, 3).map((stage) => (
                            <Badge key={stage} variant="secondary" className="text-xs">
                              {stage}
                            </Badge>
                          ))}
                          {program.customization.highlightedStages.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{program.customization.highlightedStages.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {program.phases?.length || 0} stages • {program.totalTasks} tasks • {program.duration} days
                      </div>
                      {program.isEnrolled ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/programs/${program.id}`}>Continue</Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <Link href={`/programs`}>{t("buttons.startProgram")}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {!recommendations?.recommendations?.length && (
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {recommendations?.message || "Loading recommendations..."}
                    </p>
                    {!profile && (
                      <Button size="sm" asChild>
                        <Link href="/assessment">Complete Assessment</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("sections.yourAiCoach")}</CardTitle>
              <CardDescription>
                {t("coachingStyles.personalizedGuidance")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {t("coachingStyles.title")}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {profile?.preferredCommunicationStyle === "direct-honest" &&
                      t("coachingStyles.direct-honest")}
                    {profile?.preferredCommunicationStyle ===
                      "gentle-supportive" &&
                      t("coachingStyles.gentle-supportive")}
                    {profile?.preferredCommunicationStyle ===
                      "analytical-logical" &&
                      t("coachingStyles.analytical-logical")}
                    {profile?.preferredCommunicationStyle ===
                      "emotional-expressive" &&
                      t("coachingStyles.emotional-expressive")}
                    {!profile?.preferredCommunicationStyle &&
                      t("coachingStyles.notComplete")}
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/chat">{t("buttons.startCoachingChat")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
