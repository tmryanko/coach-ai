"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { api } from "@/utils/api";
import { SimpleAppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, ArrowLeft, RefreshCw } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("profile");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tGoals = useTranslations("assessment.goals.goalOptions");
  const tChallenges = useTranslations("assessment.challenges.challengeOptions");
  const tComm = useTranslations(
    "assessment.lifestyleCompatibility.communicationStyles"
  );
  const tStatus = useTranslations(
    "assessment.relationshipStatus.statusOptions"
  );
  const tValues = useTranslations(
    "assessment.lifestyleCompatibility.coreValues"
  );
  const tStrengths = useTranslations(
    "assessment.enhanced.selfReflection.personalStrengths"
  );

  const {
    data: profile,
    isLoading,
    refetch: refetchProfile,
  } = api.assessment.getProfile.useQuery();
  const { data: assessmentStatus, refetch: refetchStatus } =
    api.assessment.getStatus.useQuery();
  const repairAssessment =
    api.assessment.repairAssessmentCompletion.useMutation({
      onSuccess: () => {
        refetchStatus();
        refetchProfile();
      },
    });

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchProfile();
      await refetchStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  // If user hasn't completed assessment, try to repair or redirect to assessment
  useEffect(() => {
    if (assessmentStatus && !assessmentStatus.isCompleted) {
      // If user has substantial data but no completion timestamp, try to repair
      if (
        profile &&
        (profile.name || profile.emotionalProfile || profile.coreValues?.length)
      ) {
        console.log(
          "🔧 User has data but no completion timestamp, attempting repair..."
        );
        repairAssessment.mutate();
      } else {
        // Otherwise redirect to assessment
        router.push(`/${locale}/assessment`);
      }
    }
  }, [assessmentStatus, profile, router, locale, repairAssessment]);

  // Refresh profile data when user might be returning from edit mode
  useEffect(() => {
    const handleFocus = async () => {
      // When user focuses back to this page, refresh profile data
      // This catches cases where they navigated back from assessment edit
      setIsRefreshing(true);
      try {
        await refetchProfile();
      } finally {
        setIsRefreshing(false);
      }
    };

    // Listen for when user focuses back to this page
    window.addEventListener("focus", handleFocus);

    // Also refresh on component mount in case of direct navigation back
    const timeoutId = setTimeout(async () => {
      if (!isLoading) {
        setIsRefreshing(true);
        try {
          await refetchProfile();
        } finally {
          setIsRefreshing(false);
        }
      }
    }, 100);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearTimeout(timeoutId);
    };
  }, [refetchProfile, isLoading]);

  // Show loading while redirecting
  if (assessmentStatus && !assessmentStatus.isCompleted) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </SimpleAppLayout>
    );
  }

  if (isLoading) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </SimpleAppLayout>
    );
  }

  if (!profile) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">{t("noProfileFound")}</p>
              <Button onClick={() => router.push(`/${locale}/assessment`)}>
                {t("completeAssessment")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </SimpleAppLayout>
    );
  }

  const getPersonalityDescription = () => {
    const traits = profile.personalityTraits as any;
    if (!traits) return t("notSpecified");

    const socialStyle =
      traits.introversion <= 2
        ? t("personalityValues.extroverted")
        : traits.introversion >= 4
        ? t("personalityValues.introverted")
        : t("personalityValues.balanced");
    const empathyLevel =
      traits.empathy <= 2
        ? t("personalityValues.logicFocused")
        : traits.empathy >= 4
        ? t("personalityValues.highlyEmpathetic")
        : t("personalityValues.balancedEmpathy");

    return `${socialStyle}, ${empathyLevel}`;
  };

  const translateValue = (value: string) => {
    try {
      // Try to translate core values with .label suffix
      const coreValueTranslation = tValues(`${value}.label`);
      if (
        coreValueTranslation &&
        !coreValueTranslation.includes("assessment.lifestyleCompatibility")
      ) {
        return coreValueTranslation;
      }

      // Try to translate personal strengths
      const strengthTranslation = tStrengths(value);
      if (
        strengthTranslation &&
        !strengthTranslation.includes("assessment.enhanced")
      ) {
        return strengthTranslation;
      }
    } catch (error) {
      // If translation fails, continue to fallback
    }

    // Fallback to formatted value
    return value.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };
  console.log("profile:", profile);

  return (
    <SimpleAppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing
                    ? t("buttons.refreshing")
                    : t("buttons.refresh")}
                </Button>
                <Button
                  onClick={() => router.push(`/${locale}/assessment?edit=true`)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t("editProfile")}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {/* Relationship Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("relationshipStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-sm">
                {profile.relationshipStatus
                  ? (() => {
                      try {
                        const statusTranslation = tStatus(
                          `${profile.relationshipStatus}.label`
                        );
                        if (
                          statusTranslation &&
                          !statusTranslation.includes(
                            "assessment.relationshipStatus"
                          )
                        ) {
                          return statusTranslation;
                        }
                      } catch (error) {
                        // Fall through to fallback
                      }
                      return profile.relationshipStatus
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());
                    })()
                  : t("notSpecified")}
              </Badge>
            </CardContent>
          </Card>

          {/* Goals and Core Values */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("goals")}(
                {(profile.relationshipGoals?.length || 0) +
                  (profile.coreValues?.length || 0)}
                )
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {/* Legacy relationship goals */}
                {profile.relationshipGoals?.map((goal) => (
                  <Badge key={goal} variant="secondary">
                    {tGoals(goal)}
                  </Badge>
                ))}
                {/* Core values from rich assessment */}
                {profile.coreValues?.map((value, index) => (
                  <Badge key={`core-value-${index}`} variant="secondary">
                    {translateValue(value)}
                  </Badge>
                ))}
                {!profile.relationshipGoals?.length &&
                  !profile.coreValues?.length && (
                    <span className="text-gray-500">
                      {t("noGoalsSpecified")}
                    </span>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Challenges and Deal Breakers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("challenges")}(
                {(profile.currentChallenges?.length || 0) +
                  (profile.dealBreakers?.length || 0) +
                  ((profile.emotionalProfile as any)?.emotionalChallenges
                    ?.length || 0)}
                )
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {/* Legacy challenges */}
                {profile.currentChallenges?.map((challenge) => (
                  <Badge key={challenge} variant="destructive">
                    {tChallenges(challenge) ||
                      tChallenges(`${challenge}.label`) ||
                      challenge}
                  </Badge>
                ))}
                {/* Deal breakers from rich assessment */}
                {profile.dealBreakers?.map((dealBreaker, index) => (
                  <Badge key={`deal-breaker-${index}`} variant="destructive">
                    {dealBreaker}
                  </Badge>
                ))}
                {/* Emotional challenges from rich assessment */}
                {(
                  (profile.emotionalProfile as any)?.emotionalChallenges || []
                ).map((challenge: string, index: number) => (
                  <Badge key={`emotional-challenge-${index}`} variant="outline">
                    {challenge}
                  </Badge>
                ))}
                {!profile.currentChallenges?.length &&
                  !profile.dealBreakers?.length &&
                  !(profile.emotionalProfile as any)?.emotionalChallenges
                    ?.length && (
                    <span className="text-gray-500">
                      {t("noChallengesSpecified")}
                    </span>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("communicationStyle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">
                {profile.preferredCommunicationStyle
                  ? // Try direct translation first, fallback to adding .label
                    tComm(profile.preferredCommunicationStyle) ||
                    tComm(`${profile.preferredCommunicationStyle}.label`) ||
                    profile.preferredCommunicationStyle
                  : t("notSpecified")}
              </Badge>
            </CardContent>
          </Card>

          {/* Emotional Profile and Personality */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("personality")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic personality traits */}
              <div>
                <span className="text-sm font-medium">
                  {t("personalityFields.personality")}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {getPersonalityDescription()}
                </span>
              </div>

              {/* Attachment style from emotional profile */}
              {(profile.emotionalProfile as any)?.attachmentStyle && (
                <div>
                  <span className="text-sm font-medium">
                    {t("sections.attachmentStyle")}:
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {(profile.emotionalProfile as any).attachmentStyle.replace(
                      "_",
                      " "
                    )}
                  </span>
                </div>
              )}

              {/* Top strengths from emotional profile */}
              {(profile.emotionalProfile as any)?.topStrengths?.length > 0 && (
                <div>
                  <span className="text-sm font-medium">
                    {t("sections.topStrengths")}:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(profile.emotionalProfile as any).topStrengths.map(
                      (strength: string, index: number) => (
                        <Badge
                          key={`strength-${index}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {translateValue(strength)}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Primary fears from emotional profile */}
              {(profile.emotionalProfile as any)?.primaryFears?.length > 0 && (
                <div>
                  <span className="text-sm font-medium">
                    {t("sections.primaryConcerns")}:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(profile.emotionalProfile as any).primaryFears.map(
                      (fear: string, index: number) => (
                        <Badge
                          key={`fear-${index}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {fear}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {(profile.personalityTraits as any)?.conflictStyle && (
                <div>
                  <span className="text-sm font-medium">
                    {t("personalityFields.conflictStyle")}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {(profile.personalityTraits as any).conflictStyle}
                  </span>
                </div>
              )}
              {(profile.personalityTraits as any)?.learningPreference && (
                <div>
                  <span className="text-sm font-medium">
                    {t("personalityFields.learningStyle")}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {(
                      profile.personalityTraits as any
                    ).learningPreference.replace("-", " ")}
                  </span>
                </div>
              )}
              {(profile.personalityTraits as any)?.priorities &&
                (profile.personalityTraits as any).priorities.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("personalityFields.lifePriorities")}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(profile.personalityTraits as any).priorities.map(
                        (priority: any) => (
                          <Badge
                            key={priority}
                            variant="outline"
                            className="text-xs"
                          >
                            {priority
                              .replace("-", " ")
                              .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Relationship Vision */}
          {profile.relationshipVision && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {t("sections.relationshipVision")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profile.relationshipVision}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Self Reflection */}
          {(profile.selfReflection as any)?.friendsDescription && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {t("sections.selfReflection")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(profile.selfReflection as any).friendsDescription && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("sections.friendsDescription")}:
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {(profile.selfReflection as any).friendsDescription}
                    </p>
                  </div>
                )}
                {(profile.selfReflection as any).proudestMoment && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("sections.proudestMoment")}:
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {(profile.selfReflection as any).proudestMoment}
                    </p>
                  </div>
                )}
                {(profile.selfReflection as any).personalStrengths?.length >
                  0 && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("sections.personalStrengths")}:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(profile.selfReflection as any).personalStrengths.map(
                        (strength: string, index: number) => (
                          <Badge
                            key={`personal-strength-${index}`}
                            variant="secondary"
                            className="text-xs"
                          >
                            {translateValue(strength)}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Profile Completion Date */}
          {profile.assessmentCompletedAt && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("completedAt")}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(profile.assessmentCompletedAt).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button
            onClick={() => router.push(`/${locale}/dashboard`)}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToDashboard")}
          </Button>
        </div>
      </div>
    </SimpleAppLayout>
  );
}
