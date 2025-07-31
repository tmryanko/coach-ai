"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmotionalProfileData } from "@/types/assessment";
import { Brain, Heart, Shield, ArrowRight, Star } from "lucide-react";

interface EmotionalIntelligenceStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const getAttachmentStyles = (t: any) => {
  const getTraitsArray = (traitsObj: any) => {
    if (typeof traitsObj === 'object' && traitsObj !== null && !Array.isArray(traitsObj)) {
      return Object.values(traitsObj);
    }
    return Array.isArray(traitsObj) ? traitsObj : [];
  };

  
  return [
  {
    value: "secure",
    label: t("attachmentStyles.secure.label"),
    description: t("attachmentStyles.secure.description"),
    traits: getTraitsArray(t("attachmentStyles.secure.traits")),
  },
  {
    value: "anxious",
    label: t("attachmentStyles.anxious.label"),
    description: t("attachmentStyles.anxious.description"),
    traits: getTraitsArray(t("attachmentStyles.anxious.traits")),
  },
  {
    value: "avoidant",
    label: t("attachmentStyles.avoidant.label"),
    description: t("attachmentStyles.avoidant.description"),
    traits: getTraitsArray(t("attachmentStyles.avoidant.traits")),
  },
  {
    value: "disorganized",
    label: t("attachmentStyles.disorganized.label"),
    description: t("attachmentStyles.disorganized.description"),
    traits: getTraitsArray(t("attachmentStyles.disorganized.traits")),
  },
  {
    value: "unsure",
    label: t("attachmentStyles.unsure.label"),
    description: t("attachmentStyles.unsure.description"),
    traits: getTraitsArray(t("attachmentStyles.unsure.traits")),
  },
]};

const getFearOptions = (t: any) => [
  { value: "rejection", label: t("fearOptions.rejection"), icon: "💔" },
  { value: "abandonment", label: t("fearOptions.abandonment"), icon: "😰" },
  { value: "intimacy", label: t("fearOptions.intimacy"), icon: "🚧" },
  { value: "vulnerability", label: t("fearOptions.vulnerability"), icon: "🛡️" },
  {
    value: "not-good-enough",
    label: t("fearOptions.not-good-enough"),
    icon: "😔",
  },
  {
    value: "losing-independence",
    label: t("fearOptions.losing-independence"),
    icon: "🔗",
  },
  { value: "commitment", label: t("fearOptions.commitment"), icon: "⚰️" },
  {
    value: "repeating-mistakes",
    label: t("fearOptions.repeating-mistakes"),
    icon: "🔄",
  },
  { value: "being-hurt", label: t("fearOptions.being-hurt"), icon: "💔" },
  { value: "conflict", label: t("fearOptions.conflict"), icon: "⚡" },
];

const getStrengthOptions = (t: any) => [
  { value: "empathy", label: t("strengthOptions.empathy"), icon: "❤️" },
  {
    value: "communication",
    label: t("strengthOptions.communication"),
    icon: "💬",
  },
  { value: "loyalty", label: t("strengthOptions.loyalty"), icon: "🤝" },
  {
    value: "emotional-awareness",
    label: t("strengthOptions.emotional-awareness"),
    icon: "🧠",
  },
  { value: "resilience", label: t("strengthOptions.resilience"), icon: "💪" },
  { value: "compassion", label: t("strengthOptions.compassion"), icon: "🤗" },
  { value: "patience", label: t("strengthOptions.patience"), icon: "⏳" },
  {
    value: "authenticity",
    label: t("strengthOptions.authenticity"),
    icon: "✨",
  },
  {
    value: "supportiveness",
    label: t("strengthOptions.supportiveness"),
    icon: "🫂",
  },
  { value: "forgiveness", label: t("strengthOptions.forgiveness"), icon: "🕊️" },
];

// Map actual challenge IDs to translation keys (removing hyphens)
const getTranslationKey = (challengeId: string): string => {
  return challengeId.replace(/-/g, '');
};

const getChallengeOptions = (t: any) => [
  {
    value: "setting-boundaries",
    label: t(`challengeOptions.${getTranslationKey("setting-boundaries")}`),
    icon: "🚧",
  },
  {
    value: "expressing-emotions",
    label: t(`challengeOptions.${getTranslationKey("expressing-emotions")}`),
    icon: "💭",
  },
  {
    value: "managing-anxiety",
    label: t(`challengeOptions.${getTranslationKey("managing-anxiety")}`),
    icon: "😰",
  },
  {
    value: "trusting-others",
    label: t(`challengeOptions.${getTranslationKey("trusting-others")}`),
    icon: "🤔",
  },
  {
    value: "conflict-resolution",
    label: t(`challengeOptions.${getTranslationKey("conflict-resolution")}`),
    icon: "⚡",
  },
  {
    value: "self-confidence",
    label: t(`challengeOptions.${getTranslationKey("self-confidence")}`),
    icon: "💪",
  },
  {
    value: "emotional-regulation",
    label: t(`challengeOptions.${getTranslationKey("emotional-regulation")}`),
    icon: "🌊",
  },
  {
    value: "overthinking",
    label: t(`challengeOptions.${getTranslationKey("overthinking")}`),
    icon: "🤯",
  },
  {
    value: "past-trauma",
    label: t(`challengeOptions.${getTranslationKey("past-trauma")}`),
    icon: "🩹",
  },
  { value: "opening-up", label: t(`challengeOptions.${getTranslationKey("opening-up")}`), icon: "🔓" },
];

const getReadinessLevels = (t: any) => [
  {
    value: 1,
    label: t("readinessLevels.1.label"),
    description: t("readinessLevels.1.description"),
  },
  {
    value: 2,
    label: t("readinessLevels.2.label"),
    description: t("readinessLevels.2.description"),
  },
  {
    value: 3,
    label: t("readinessLevels.3.label"),
    description: t("readinessLevels.3.description"),
  },
  {
    value: 4,
    label: t("readinessLevels.4.label"),
    description: t("readinessLevels.4.description"),
  },
  {
    value: 5,
    label: t("readinessLevels.5.label"),
    description: t("readinessLevels.5.description"),
  },
  {
    value: 6,
    label: t("readinessLevels.6.label"),
    description: t("readinessLevels.6.description"),
  },
  {
    value: 7,
    label: t("readinessLevels.7.label"),
    description: t("readinessLevels.7.description"),
  },
];

export function EmotionalIntelligenceStep({
  data,
  onNext,
  onBack,
  canGoBack,
  isLoading,
}: EmotionalIntelligenceStepProps) {
  const t = useTranslations("assessment.emotionalIntelligence");
  const [attachmentStyle, setAttachmentStyle] = useState(
    data.attachmentStyle || ""
  );
  const [primaryFears, setPrimaryFears] = useState<string[]>(
    data.primaryFears || []
  );
  const [topStrengths, setTopStrengths] = useState<string[]>(
    data.topStrengths || []
  );
  const [emotionalChallenges, setEmotionalChallenges] = useState<string[]>(
    data.emotionalChallenges || []
  );
  const [relationshipReadiness, setRelationshipReadiness] = useState(
    data.relationshipReadiness || 5
  );

  const attachmentStyles = getAttachmentStyles(t);
  const fearOptions = getFearOptions(t);
  const strengthOptions = getStrengthOptions(t);
  const challengeOptions = getChallengeOptions(t);
  const readinessLevels = getReadinessLevels(t);

  const toggleSelection = (
    array: string[],
    setArray: (arr: string[]) => void,
    value: string,
    maxItems: number
  ) => {
    if (array.includes(value)) {
      setArray(array.filter((item) => item !== value));
    } else if (array.length < maxItems) {
      setArray([...array, value]);
    }
  };

  const handleNext = () => {
    const emotionalData: EmotionalProfileData = {
      attachmentStyle,
      primaryFears,
      topStrengths,
      emotionalChallenges,
      relationshipReadiness,
    };
    onNext(emotionalData);
  };

  const isFormValid =
    attachmentStyle &&
    primaryFears.length > 0 &&
    topStrengths.length > 0 &&
    emotionalChallenges.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Attachment Style */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              {t("attachmentStyleTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("attachmentStyleDescription")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {attachmentStyles.map((style) => (
              <Card
                key={style.value}
                className={`p-4 cursor-pointer transition-colors border-2 ${
                  attachmentStyle === style.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                }`}
                onClick={() => setAttachmentStyle(style.value)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {style.label}
                    </h3>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        attachmentStyle === style.value
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {style.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {style.traits.map((trait: string) => (
                      <Badge
                        key={trait}
                        variant="secondary"
                        className="text-xs"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Primary Fears */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              {t("fearsTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("fearsDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {primaryFears.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  {t("fearsSelected", { count: primaryFears.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {primaryFears.map((fear) => {
                    const option = fearOptions.find(
                      (opt) => opt.value === fear
                    );
                    return (
                      <Badge key={fear} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {fearOptions.map((fear) => (
                <Card
                  key={fear.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    primaryFears.includes(fear.value)
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : primaryFears.length >= 3
                      ? "border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    (primaryFears.length < 3 ||
                      primaryFears.includes(fear.value)) &&
                    toggleSelection(
                      primaryFears,
                      setPrimaryFears,
                      fear.value,
                      3
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{fear.icon}</span>
                    <span className="font-medium text-sm">{fear.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Strengths */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-green-500" />
              {t("strengthsTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("strengthsDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {topStrengths.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                  {t("strengthsSelected", { count: topStrengths.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {topStrengths.map((strength) => {
                    const option = strengthOptions.find(
                      (opt) => opt.value === strength
                    );
                    return (
                      <Badge key={strength} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {strengthOptions.map((strength) => (
                <Card
                  key={strength.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    topStrengths.includes(strength.value)
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : topStrengths.length >= 4
                      ? "border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    (topStrengths.length < 4 ||
                      topStrengths.includes(strength.value)) &&
                    toggleSelection(
                      topStrengths,
                      setTopStrengths,
                      strength.value,
                      4
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{strength.icon}</span>
                    <span className="font-medium text-sm">
                      {strength.label}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emotional Challenges */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              {t("challengesTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("challengesDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {emotionalChallenges.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t("challengesSelected", {
                    count: emotionalChallenges.length,
                  })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {emotionalChallenges.map((challenge) => {
                    const option = challengeOptions.find(
                      (opt) => opt.value === challenge
                    );
                    return (
                      <Badge key={challenge} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {challengeOptions.map((challenge) => (
                <Card
                  key={challenge.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    emotionalChallenges.includes(challenge.value)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : emotionalChallenges.length >= 3
                      ? "border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    (emotionalChallenges.length < 3 ||
                      emotionalChallenges.includes(challenge.value)) &&
                    toggleSelection(
                      emotionalChallenges,
                      setEmotionalChallenges,
                      challenge.value,
                      3
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{challenge.icon}</span>
                    <span className="font-medium text-sm">
                      {challenge.label}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relationship Readiness */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              {t("readinessTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("readinessDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    {relationshipReadiness}/7
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {
                      readinessLevels.find(
                        (level) => level.value === relationshipReadiness
                      )?.label
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {
                      readinessLevels.find(
                        (level) => level.value === relationshipReadiness
                      )?.description
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {readinessLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setRelationshipReadiness(level.value)}
                      className={`w-10 h-10 rounded-full border-2 text-sm font-semibold transition-colors ${
                        relationshipReadiness === level.value
                          ? "border-pink-500 bg-pink-500 text-white"
                          : "border-gray-300 dark:border-gray-600 hover:border-pink-300 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {level.value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>{t("readinessScale.notReady")}</span>
                <span>{t("readinessScale.completelyReady")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack || isLoading}
        >
          {t("buttons.back")}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid || isLoading}
          className="px-8"
        >
          {isLoading ? t("buttons.saving") : t("buttons.continue")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
