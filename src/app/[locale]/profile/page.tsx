"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
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

// Type interfaces for profile data structures
interface PersonalityTraits {
  introversion?: number;
  empathy?: number;
  conflictStyle?: string;
  learningPreference?: string;
  priorities?: string[];
}

interface EmotionalProfile {
  attachmentStyle?: string;
  topStrengths?: string[];
  emotionalChallenges?: string[];
  primaryFears?: string[];
}

interface SelfReflection {
  friendsDescription?: string;
  proudestMoment?: string;
  personalStrengths?: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("profile");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasAttemptedRepair, setHasAttemptedRepair] = useState(false);
  const [isRepairInProgress, setIsRepairInProgress] = useState(false);

  // Translation hooks - these are stable references from next-intl
  const tGoals = useTranslations("assessment.goals.goalOptions");
  const tChallenges = useTranslations("assessment.challenges.challengeOptions");
  const tComm = useTranslations("assessment.lifestyleCompatibility.communicationStyles");
  const tStatus = useTranslations("assessment.relationshipStatus.statusOptions");
  const tCoreValues = useTranslations("assessment.valuesVision.coreValues");
  const tPersonalStrengths = useTranslations("assessment.selfReflection.personalStrengths");
  const tEmotionalStrengths = useTranslations("assessment.emotionalIntelligence.strengthOptions");
  const tEmotionalChallenges = useTranslations("assessment.emotionalIntelligence.challengeOptions");
  const tDealBreakers = useTranslations("assessment.valuesVision.dealBreakers");
  const tFears = useTranslations("assessment.emotionalIntelligence.fearOptions");

  // Memoized translation function to avoid recalculating for same values
  const translateValue = useMemo(() => {
    const translateValueMemo = (
      value: string,
      category?:
        | "coreValues"
        | "personalStrengths"
        | "emotionalStrengths"
        | "challenges"
        | "dealBreakers"
        | "fears"
    ): string => {
      try {
        // If category is specified, try that category first
        if (category) {
          let categoryTranslation;

          switch (category) {
            case "coreValues":
              categoryTranslation = tCoreValues(`${value}.label`);
              if (
                categoryTranslation &&
                !categoryTranslation.includes("assessment.valuesVision")
              ) {
                return categoryTranslation;
              }
              break;
            case "personalStrengths":
              categoryTranslation = tPersonalStrengths(value);
              if (
                categoryTranslation &&
                !categoryTranslation.includes("assessment.selfReflection")
              ) {
                return categoryTranslation;
              }
              break;
            case "emotionalStrengths":
              categoryTranslation = tEmotionalStrengths(value);
              if (
                categoryTranslation &&
                !categoryTranslation.includes("assessment.emotionalIntelligence")
              ) {
                return categoryTranslation;
              }
              break;
            case "challenges":
              categoryTranslation =
                tChallenges(`${value}.label`) || tEmotionalChallenges(value);
              if (
                categoryTranslation &&
                !categoryTranslation.includes("assessment.")
              ) {
                return categoryTranslation;
              }
              break;
            case "dealBreakers":
              categoryTranslation = tDealBreakers(value);
              if (
                categoryTranslation &&
                !categoryTranslation.includes("assessment.valuesVision")
              ) {
                return categoryTranslation;
              }
              break;
            case "fears":
              categoryTranslation = tFears(value);
              if (
                categoryTranslation &&
                !categoryTranslation.includes("assessment.emotionalIntelligence")
              ) {
                return categoryTranslation;
              }
              break;
          }
        }

        // If no category specified or category-specific translation failed, try all categories
        // 1. Core Values (from values & vision section)
        const coreValueTranslation = tCoreValues(`${value}.label`);
        if (
          coreValueTranslation &&
          !coreValueTranslation.includes("assessment.valuesVision")
        ) {
          return coreValueTranslation;
        }

        // 2. Personal Strengths (from self-reflection section)
        const personalStrengthTranslation = tPersonalStrengths(value);
        if (
          personalStrengthTranslation &&
          !personalStrengthTranslation.includes("assessment.selfReflection")
        ) {
          return personalStrengthTranslation;
        }

        // 3. Emotional Strengths (from emotional intelligence section)
        const emotionalStrengthTranslation = tEmotionalStrengths(value);
        if (
          emotionalStrengthTranslation &&
          !emotionalStrengthTranslation.includes(
            "assessment.emotionalIntelligence"
          )
        ) {
          return emotionalStrengthTranslation;
        }

        // 4. Challenges (try both emotional and general challenges)
        const challengeTranslation =
          tChallenges(`${value}.label`) || tEmotionalChallenges(value);
        if (
          challengeTranslation &&
          !challengeTranslation.includes("assessment.")
        ) {
          return challengeTranslation;
        }

        // 5. Deal Breakers
        const dealBreakerTranslation = tDealBreakers(value);
        if (
          dealBreakerTranslation &&
          !dealBreakerTranslation.includes("assessment.valuesVision")
        ) {
          return dealBreakerTranslation;
        }

        // 6. Fears
        const fearTranslation = tFears(value);
        if (
          fearTranslation &&
          !fearTranslation.includes("assessment.emotionalIntelligence")
        ) {
          return fearTranslation;
        }
      } catch (error) {
        // If translation fails, continue to fallback
      }

      // Fallback to formatted value
      return value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return translateValueMemo;
  }, [
    tCoreValues,
    tPersonalStrengths,
    tEmotionalStrengths,
    tChallenges,
    tEmotionalChallenges,
    tDealBreakers,
    tFears,
  ]);

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
        setIsRepairInProgress(false);
        refetchStatus();
        refetchProfile();
      },
      onError: () => {
        setIsRepairInProgress(false);
        // If repair fails, redirect to assessment anyway
        router.push('/assessment');
      },
    });

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isRepairInProgress) return; // Prevent multiple simultaneous operations
    
    setIsRefreshing(true);
    try {
      await Promise.all([refetchProfile(), refetchStatus()]);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isRepairInProgress, refetchProfile, refetchStatus]);

  // Stabilize the repair function to prevent dependency issues
  const handleRepairOrRedirect = useCallback(() => {
    if (assessmentStatus && !assessmentStatus.isCompleted && !isRepairInProgress) {
      // If user has substantial data but no completion timestamp, try to repair (only once)
      if (
        !hasAttemptedRepair &&
        profile &&
        (profile.name || profile.emotionalProfile || profile.coreValues?.length)
      ) {
        setHasAttemptedRepair(true);
        setIsRepairInProgress(true);
        repairAssessment.mutate();
      } else if (hasAttemptedRepair || !profile || (!profile.name && !profile.emotionalProfile && !profile.coreValues?.length)) {
        // Either we already tried repair or there's insufficient data - redirect to assessment
        router.push('/assessment');
      }
    }
  }, [assessmentStatus, profile, router, hasAttemptedRepair, isRepairInProgress, repairAssessment]);

  // If user hasn't completed assessment, try to repair or redirect to assessment
  useEffect(() => {
    handleRepairOrRedirect();
  }, [handleRepairOrRedirect]);

  // Refresh profile data when user might be returning from edit mode
  const handleFocus = useCallback(async () => {
    // When user focuses back to this page, refresh profile data
    // This catches cases where they navigated back from assessment edit
    if (!isRefreshing && !isLoading) {
      setIsRefreshing(true);
      try {
        await refetchProfile();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [isRefreshing, isLoading, refetchProfile]);

  useEffect(() => {
    // Listen for when user focuses back to this page
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [handleFocus]);

  // Show loading while redirecting or repairing
  if ((assessmentStatus && !assessmentStatus.isCompleted) || isRepairInProgress) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                {isRepairInProgress ? t("repairingProfile") : t("redirecting")}
              </p>
            </div>
          </div>
        </div>
      </SimpleAppLayout>
    );
  }

  // Show loading for initial data fetch
  if (isLoading || (!profile && !assessmentStatus)) {
    return (
      <SimpleAppLayout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">{t("loadingProfile")}</p>
            </div>
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
              <Button onClick={() => router.push('/assessment')}>
                {t("completeAssessment")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </SimpleAppLayout>
    );
  }


  const getPersonalityDescription = () => {
    const traits = profile.personalityTraits as PersonalityTraits;
    if (!traits) return t("notSpecified");

    const socialStyle =
      (traits.introversion ?? 3) <= 2
        ? t("personalityValues.extroverted")
        : (traits.introversion ?? 3) >= 4
        ? t("personalityValues.introverted")
        : t("personalityValues.balanced");
    const empathyLevel =
      (traits.empathy ?? 3) <= 2
        ? t("personalityValues.logicFocused")
        : (traits.empathy ?? 3) >= 4
        ? t("personalityValues.highlyEmpathetic")
        : t("personalityValues.balancedEmpathy");

    return `${socialStyle}, ${empathyLevel}`;
  };

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
                  onClick={() => router.push('/assessment?edit=true')}
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
                  (profile.coreValues?.length || 0)})
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
                    {translateValue(value, "coreValues")}
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
                  ((profile.emotionalProfile as EmotionalProfile)?.emotionalChallenges
                    ?.length || 0)})
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
                    {translateValue(dealBreaker, "dealBreakers")}
                  </Badge>
                ))}
                {/* Emotional challenges from rich assessment */}
                {(
                  (profile.emotionalProfile as EmotionalProfile)?.emotionalChallenges || []
                ).map((challenge: string, index: number) => (
                  <Badge key={`emotional-challenge-${index}`} variant="outline">
                    {translateValue(challenge, "challenges")}
                  </Badge>
                ))}
                {!profile.currentChallenges?.length &&
                  !profile.dealBreakers?.length &&
                  !((profile.emotionalProfile as EmotionalProfile)?.emotionalChallenges
                    ?.length) && (
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
              {(profile.emotionalProfile as EmotionalProfile)?.attachmentStyle && (
                <div>
                  <span className="text-sm font-medium">
                    {t("sections.attachmentStyle")}:
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {(profile.emotionalProfile as EmotionalProfile).attachmentStyle?.replace(
                      "_",
                      " "
                    )}
                  </span>
                </div>
              )}

              {/* Top strengths from emotional profile */}
              {(profile.emotionalProfile as EmotionalProfile)?.topStrengths?.length && (
                <div>
                  <span className="text-sm font-medium">
                    {t("sections.topStrengths")}:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(profile.emotionalProfile as EmotionalProfile).topStrengths?.map(
                      (strength: string, index: number) => (
                        <Badge
                          key={`strength-${index}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {translateValue(strength, "emotionalStrengths")}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Primary fears from emotional profile */}
              {(profile.emotionalProfile as EmotionalProfile)?.primaryFears?.length && (
                <div>
                  <span className="text-sm font-medium">
                    {t("sections.primaryConcerns")}:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(profile.emotionalProfile as EmotionalProfile).primaryFears?.map(
                      (fear: string, index: number) => (
                        <Badge
                          key={`fear-${index}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {translateValue(fear, "fears")}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {(profile.personalityTraits as PersonalityTraits)?.conflictStyle && (
                <div>
                  <span className="text-sm font-medium">
                    {t("personalityFields.conflictStyle")}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {(profile.personalityTraits as PersonalityTraits).conflictStyle}
                  </span>
                </div>
              )}
              {(profile.personalityTraits as PersonalityTraits)?.learningPreference && (
                <div>
                  <span className="text-sm font-medium">
                    {t("personalityFields.learningStyle")}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {(
                      profile.personalityTraits as PersonalityTraits
                    ).learningPreference?.replace("-", " ")}
                  </span>
                </div>
              )}
              {(profile.personalityTraits as PersonalityTraits)?.priorities &&
                (profile.personalityTraits as PersonalityTraits).priorities!.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("personalityFields.lifePriorities")}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(profile.personalityTraits as PersonalityTraits).priorities?.map(
                        (priority: string) => (
                          <Badge
                            key={priority}
                            variant="outline"
                            className="text-xs"
                          >
                            {priority
                              .replace("-", " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
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
          {(profile.selfReflection as SelfReflection)?.friendsDescription && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {t("sections.selfReflection")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(profile.selfReflection as SelfReflection).friendsDescription && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("sections.friendsDescription")}:
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {(profile.selfReflection as SelfReflection).friendsDescription}
                    </p>
                  </div>
                )}
                {(profile.selfReflection as SelfReflection).proudestMoment && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("sections.proudestMoment")}:
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {(profile.selfReflection as SelfReflection).proudestMoment}
                    </p>
                  </div>
                )}
                {(profile.selfReflection as SelfReflection).personalStrengths?.length && (
                  <div>
                    <span className="text-sm font-medium">
                      {t("sections.personalStrengths")}:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(profile.selfReflection as SelfReflection).personalStrengths?.map(
                        (strength: string, index: number) => (
                          <Badge
                            key={`personal-strength-${index}`}
                            variant="secondary"
                            className="text-xs"
                          >
                            {translateValue(strength, "personalStrengths")}
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
            onClick={() => router.push('/dashboard')}
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
