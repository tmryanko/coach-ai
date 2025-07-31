"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ValuesVisionData } from "@/types/assessment";
import {
  Compass,
  Heart,
  Target,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface ValuesVisionStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
}

const getCoreValues = (t: any) => [
  {
    value: "honesty",
    label: t("coreValues.honesty.label"),
    icon: "💎",
    description: t("coreValues.honesty.description"),
  },
  {
    value: "loyalty",
    label: t("coreValues.loyalty.label"),
    icon: "🤝",
    description: t("coreValues.loyalty.description"),
  },
  {
    value: "respect",
    label: t("coreValues.respect.label"),
    icon: "🙏",
    description: t("coreValues.respect.description"),
  },
  {
    value: "communication",
    label: t("coreValues.communication.label"),
    icon: "💬",
    description: t("coreValues.communication.description"),
  },
  {
    value: "trust",
    label: t("coreValues.trust.label"),
    icon: "🔒",
    description: t("coreValues.trust.description"),
  },
  {
    value: "independence",
    label: t("coreValues.independence.label"),
    icon: "🦋",
    description: t("coreValues.independence.description"),
  },
  {
    value: "family",
    label: t("coreValues.family.label"),
    icon: "👨‍👩‍👧‍👦",
    description: t("coreValues.family.description"),
  },
  {
    value: "adventure",
    label: t("coreValues.adventure.label"),
    icon: "🌟",
    description: t("coreValues.adventure.description"),
  },
  {
    value: "stability",
    label: t("coreValues.stability.label"),
    icon: "🏠",
    description: t("coreValues.stability.description"),
  },
  {
    value: "passion",
    label: t("coreValues.passion.label"),
    icon: "🔥",
    description: t("coreValues.passion.description"),
  },
  {
    value: "humor",
    label: t("coreValues.humor.label"),
    icon: "😄",
    description: t("coreValues.humor.description"),
  },
  {
    value: "spirituality",
    label: t("coreValues.spirituality.label"),
    icon: "🕯️",
    description: t("coreValues.spirituality.description"),
  },
  {
    value: "equality",
    label: t("coreValues.equality.label"),
    icon: "⚖️",
    description: t("coreValues.equality.description"),
  },
  {
    value: "ambition",
    label: t("coreValues.ambition.label"),
    icon: "🎯",
    description: t("coreValues.ambition.description"),
  },
  {
    value: "kindness",
    label: t("coreValues.kindness.label"),
    icon: "💕",
    description: t("coreValues.kindness.description"),
  },
];

const getLifePriorities = (t: any) => [
  {
    value: "career-success",
    label: t(`lifePriorities.${getTranslationKey("career-success")}`),
    icon: "💼",
  },
  { value: "family-time", label: t(`lifePriorities.${getTranslationKey("family-time")}`), icon: "👨‍👩‍👧‍👦" },
  {
    value: "personal-growth",
    label: t(`lifePriorities.${getTranslationKey("personal-growth")}`),
    icon: "🌱",
  },
  {
    value: "health-fitness",
    label: t(`lifePriorities.${getTranslationKey("health-fitness")}`),
    icon: "💪",
  },
  {
    value: "financial-security",
    label: t(`lifePriorities.${getTranslationKey("financial-security")}`),
    icon: "💰",
  },
  {
    value: "travel-adventure",
    label: t(`lifePriorities.${getTranslationKey("travel-adventure")}`),
    icon: "✈️",
  },
  {
    value: "social-connections",
    label: t(`lifePriorities.${getTranslationKey("social-connections")}`),
    icon: "👥",
  },
  { value: "creativity", label: t("lifePriorities.creativity"), icon: "🎨" },
  { value: "learning", label: t("lifePriorities.learning"), icon: "📚" },
  {
    value: "community-service",
    label: t(`lifePriorities.${getTranslationKey("community-service")}`),
    icon: "🤲",
  },
  {
    value: "spiritual-practice",
    label: t(`lifePriorities.${getTranslationKey("spiritual-practice")}`),
    icon: "🧘",
  },
  {
    value: "work-life-balance",
    label: t(`lifePriorities.${getTranslationKey("work-life-balance")}`),
    icon: "⚖️",
  },
];

// Map actual IDs to translation keys (removing hyphens)
const getTranslationKey = (id: string): string => {
  return id.replace(/-/g, '');
};

const getDealBreakers = (t: any) => [
  { value: "dishonesty", label: t("dealBreakers.dishonesty"), icon: "🚫" },
  { value: "disrespect", label: t("dealBreakers.disrespect"), icon: "❌" },
  { value: "infidelity", label: t("dealBreakers.infidelity"), icon: "💔" },
  { value: "abuse", label: t("dealBreakers.abuse"), icon: "🛑" },
  { value: "addiction", label: t("dealBreakers.addiction"), icon: "🚫" },
  {
    value: "different-values",
    label: t(`dealBreakers.${getTranslationKey("different-values")}`),
    icon: "🔀",
  },
  {
    value: "no-commitment",
    label: t(`dealBreakers.${getTranslationKey("no-commitment")}`),
    icon: "🏃‍♂️",
  },
  {
    value: "poor-communication",
    label: t(`dealBreakers.${getTranslationKey("poor-communication")}`),
    icon: "🤐",
  },
  {
    value: "different-goals",
    label: t(`dealBreakers.${getTranslationKey("different-goals")}`),
    icon: "↔️",
  },
  {
    value: "financial-irresponsibility",
    label: t(`dealBreakers.${getTranslationKey("financial-irresponsibility")}`),
    icon: "💸",
  },
  { value: "no-growth", label: t(`dealBreakers.${getTranslationKey("no-growth")}`), icon: "🚧" },
  { value: "jealousy", label: t("dealBreakers.jealousy"), icon: "👁️" },
];

export function ValuesVisionStep({
  data,
  onNext,
  onBack,
  canGoBack,
  isLoading,
}: ValuesVisionStepProps) {
  const t = useTranslations("assessment.valuesVision");
  const [coreValues, setCoreValues] = useState<string[]>(data.coreValues || []);
  const [relationshipVision, setRelationshipVision] = useState(
    data.relationshipVision || ""
  );
  const [lifePriorities, setLifePriorities] = useState<string[]>(
    data.lifePriorities || []
  );
  const [dealBreakers, setDealBreakers] = useState<string[]>(
    data.dealBreakers || []
  );

  const coreValueOptions = getCoreValues(t);
  const lifePriorityOptions = getLifePriorities(t);
  const dealBreakerOptions = getDealBreakers(t);

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
    const valuesData: ValuesVisionData = {
      coreValues,
      relationshipVision: relationshipVision.trim(),
      dealBreakers,
    };
    onNext(valuesData);
  };

  const isFormValid =
    coreValues.length >= 3 &&
    relationshipVision.trim().length >= 50 &&
    lifePriorities.length >= 2 &&
    dealBreakers.length >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Core Values */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              {t("coreValuesTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("coreValuesDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {coreValues.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                  {t("coreValuesSelected", { count: coreValues.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {coreValues.map((value) => {
                    const option = coreValueOptions.find(
                      (opt) => opt.value === value
                    );
                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="text-sm"
                      >
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {coreValueOptions.map((valueOption) => (
                <Card
                  key={valueOption.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    coreValues.includes(valueOption.value)
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : coreValues.length >= 5
                      ? "border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    (coreValues.length < 5 ||
                      coreValues.includes(valueOption.value)) &&
                    toggleSelection(
                      coreValues,
                      setCoreValues,
                      valueOption.value,
                      5
                    )
                  }
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{valueOption.icon}</span>
                      <span className="font-medium text-sm">
                        {valueOption.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {valueOption.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relationship Vision */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              {t("relationshipVisionTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("relationshipVisionDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder={t("relationshipVisionPlaceholder")}
                value={relationshipVision}
                onChange={(e) => setRelationshipVision(e.target.value)}
                className="min-h-32 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("characterCount", {
                    current: relationshipVision.length,
                    max: 1000,
                    min: 50,
                  })}
                </p>
                {relationshipVision.length >= 50 && (
                  <Badge variant="secondary" className="text-green-600">
                    {t("validationMessage.greatDetail")}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Life Priorities */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              {t("lifePrioritiesTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("lifePrioritiesDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {lifePriorities.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  {t("prioritiesSelected", { count: lifePriorities.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {lifePriorities.map((priority) => {
                    const option = lifePriorityOptions.find(
                      (opt) => opt.value === priority
                    );
                    return (
                      <Badge key={priority} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {lifePriorityOptions.map((priority) => (
                <Card
                  key={priority.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    lifePriorities.includes(priority.value)
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : lifePriorities.length >= 4
                      ? "border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    (lifePriorities.length < 4 ||
                      lifePriorities.includes(priority.value)) &&
                    toggleSelection(
                      lifePriorities,
                      setLifePriorities,
                      priority.value,
                      4
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{priority.icon}</span>
                    <span className="font-medium text-sm">
                      {priority.label}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal Breakers */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {t("dealBreakersTitle")}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("dealBreakersDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {dealBreakers.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  {t("dealBreakersSelected", { count: dealBreakers.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dealBreakers.map((dealBreaker) => {
                    const option = dealBreakerOptions.find(
                      (opt) => opt.value === dealBreaker
                    );
                    return (
                      <Badge key={dealBreaker} variant="secondary">
                        {option?.icon} {option?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {dealBreakerOptions.map((dealBreaker) => (
                <Card
                  key={dealBreaker.value}
                  className={`p-3 cursor-pointer transition-colors border-2 ${
                    dealBreakers.includes(dealBreaker.value)
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : dealBreakers.length >= 4
                      ? "border-gray-200 opacity-50 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    (dealBreakers.length < 4 ||
                      dealBreakers.includes(dealBreaker.value)) &&
                    toggleSelection(
                      dealBreakers,
                      setDealBreakers,
                      dealBreaker.value,
                      4
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{dealBreaker.icon}</span>
                    <span className="font-medium text-sm">
                      {dealBreaker.label}
                    </span>
                  </div>
                </Card>
              ))}
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
