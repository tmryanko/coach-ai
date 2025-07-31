import { PrismaClient, TaskType } from "@prisma/client";
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient();

export const seedData = async (locale: string = "en") => {
  const t = await getTranslations({ locale, namespace: "coachingProgram" });

  // Create the comprehensive 12-stage AI Relationship Coaching Program
  const program = await prisma.coachingProgram.create({
    data: {
      name: t("name"),
      description: t("description"),
      duration: 84, // 12 stages × 7 days each
      phases: {
        create: [
          {
            name: t("phases.selfDiscovery.name"),
            description: t("phases.selfDiscovery.description"),
            order: 1,
            tasks: {
              create: [
                {
                  title: t("tasks.selfDiscovery.defineCoreValues.title"),
                  description: t(
                    "tasks.selfDiscovery.defineCoreValues.description"
                  ),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.selfDiscovery.defineCoreValues.goal"),
                    focus: t("tasks.selfDiscovery.defineCoreValues.focus"),
                    prompts: t.raw("prompts.selfDiscovery.defineCoreValues"),
                  },
                },
                {
                  title: t("tasks.selfDiscovery.authenticSelfAssessment.title"),
                  description: t(
                    "tasks.selfDiscovery.authenticSelfAssessment.description"
                  ),
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    goal: t("tasks.selfDiscovery.authenticSelfAssessment.goal"),
                    focus: t(
                      "tasks.selfDiscovery.authenticSelfAssessment.focus"
                    ),
                    questions: [
                      "When do you feel most authentically yourself?",
                      "What qualities do you love most about yourself?",
                      "What aspects of yourself do you hide in relationships?",
                      "How do you want to be seen by a romantic partner?",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: t("phases.pastRelationshipPatterns.name"),
            description: t("phases.pastRelationshipPatterns.description"),
            order: 2,
            tasks: {
              create: [
                {
                  title: t("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.title"),
                  description: t("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.goal"),
                    focus: t("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.focus"),
                    prompts: t.raw("prompts.pastRelationshipPatterns.relationshipPatternAnalysis"),
                  },
                },
                {
                  title: t("tasks.pastRelationshipPatterns.emotionalWoundsInventory.title"),
                  description: t("tasks.pastRelationshipPatterns.emotionalWoundsInventory.description"),
                  type: TaskType.JOURNALING,
                  order: 2,
                  content: {
                    instructions: t.raw("tasks.pastRelationshipPatterns.emotionalWoundsInventory.instructions"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.innerBlocksFears.name"),
            description: t("phases.innerBlocksFears.description"),
            order: 3,
            tasks: {
              create: [
                {
                  title: t("tasks.innerBlocksFears.fearIdentificationExercise.title"),
                  description: t("tasks.innerBlocksFears.fearIdentificationExercise.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.innerBlocksFears.fearIdentificationExercise.goal"),
                    focus: t("tasks.innerBlocksFears.fearIdentificationExercise.focus"),
                    prompts: t.raw("prompts.innerBlocksFears.fearIdentificationExercise"),
                  },
                },
                {
                  title: t("tasks.innerBlocksFears.limitingBeliefChallenge.title"),
                  description: t("tasks.innerBlocksFears.limitingBeliefChallenge.description"),
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    technique: t("tasks.innerBlocksFears.limitingBeliefChallenge.technique"),
                    steps: t.raw("tasks.innerBlocksFears.limitingBeliefChallenge.steps"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.emotionalRegulation.name"),
            description: t("phases.emotionalRegulation.description"),
            order: 4,
            tasks: {
              create: [
                {
                  title: t("tasks.emotionalRegulation.triggerResponseAnalysis.title"),
                  description: t("tasks.emotionalRegulation.triggerResponseAnalysis.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.emotionalRegulation.triggerResponseAnalysis.goal"),
                    focus: t("tasks.emotionalRegulation.triggerResponseAnalysis.focus"),
                    prompts: t.raw("prompts.emotionalRegulation.triggerResponseAnalysis"),
                  },
                },
                {
                  title: t("tasks.emotionalRegulation.emotionalRegulationToolkit.title"),
                  description: t("tasks.emotionalRegulation.emotionalRegulationToolkit.description"),
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    techniques: t.raw("tasks.emotionalRegulation.emotionalRegulationToolkit.techniques"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.selfCompassionConfidence.name"),
            description: t("phases.selfCompassionConfidence.description"),
            order: 5,
            tasks: {
              create: [
                {
                  title: t("tasks.selfCompassionConfidence.selfCompassionLetter.title"),
                  description: t("tasks.selfCompassionConfidence.selfCompassionLetter.description"),
                  type: TaskType.JOURNALING,
                  order: 1,
                  content: {
                    goal: t("tasks.selfCompassionConfidence.selfCompassionLetter.goal"),
                    focus: t("tasks.selfCompassionConfidence.selfCompassionLetter.focus"),
                    prompts: t.raw("prompts.selfCompassionConfidence.selfCompassionLetter"),
                  },
                },
                {
                  title: t("tasks.selfCompassionConfidence.confidenceBuildingPractice.title"),
                  description: t("tasks.selfCompassionConfidence.confidenceBuildingPractice.description"),
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    dailyPractice: t.raw("tasks.selfCompassionConfidence.confidenceBuildingPractice.dailyPractice"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.communicationExpression.name"),
            description: t("phases.communicationExpression.description"),
            order: 6,
            tasks: {
              create: [
                {
                  title: t("tasks.communicationExpression.authenticExpressionPractice.title"),
                  description: t("tasks.communicationExpression.authenticExpressionPractice.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.communicationExpression.authenticExpressionPractice.goal"),
                    focus: t("tasks.communicationExpression.authenticExpressionPractice.focus"),
                    prompts: t.raw("prompts.communicationExpression.authenticExpressionPractice"),
                  },
                },
                {
                  title: t("tasks.communicationExpression.activeListeningChallenge.title"),
                  description: t("tasks.communicationExpression.activeListeningChallenge.description"),
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    instructions: t.raw("tasks.communicationExpression.activeListeningChallenge.instructions"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.boundariesStandards.name"),
            description: t("phases.boundariesStandards.description"),
            order: 7,
            tasks: {
              create: [
                {
                  title: t("tasks.boundariesStandards.relationshipBoundariesDefinition.title"),
                  description: t("tasks.boundariesStandards.relationshipBoundariesDefinition.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.boundariesStandards.relationshipBoundariesDefinition.goal"),
                    focus: t("tasks.boundariesStandards.relationshipBoundariesDefinition.focus"),
                    prompts: t.raw("prompts.boundariesStandards.relationshipBoundariesDefinition"),
                  },
                },
                {
                  title: t("tasks.boundariesStandards.standardsAssessment.title"),
                  description: t("tasks.boundariesStandards.standardsAssessment.description"),
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    categories: t.raw("tasks.boundariesStandards.standardsAssessment.categories"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.idealPartnerVision.name"),
            description: t("phases.idealPartnerVision.description"),
            order: 8,
            tasks: {
              create: [
                {
                  title: t("tasks.idealPartnerVision.relationshipVisionBoard.title"),
                  description: t("tasks.idealPartnerVision.relationshipVisionBoard.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.idealPartnerVision.relationshipVisionBoard.goal"),
                    focus: t("tasks.idealPartnerVision.relationshipVisionBoard.focus"),
                    prompts: t.raw("prompts.idealPartnerVision.relationshipVisionBoard"),
                  },
                },
                {
                  title: t("tasks.idealPartnerVision.valuesAlignmentExercise.title"),
                  description: t("tasks.idealPartnerVision.valuesAlignmentExercise.description"),
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    steps: t.raw("tasks.idealPartnerVision.valuesAlignmentExercise.steps"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.realLifeExposure.name"),
            description: t("phases.realLifeExposure.description"),
            order: 9,
            tasks: {
              create: [
                {
                  title: t("tasks.realLifeExposure.socialConnectionPractice.title"),
                  description: t("tasks.realLifeExposure.socialConnectionPractice.description"),
                  type: TaskType.EXERCISE,
                  order: 1,
                  content: {
                    goal: t("tasks.realLifeExposure.socialConnectionPractice.goal"),
                    focus: t("tasks.realLifeExposure.socialConnectionPractice.focus"),
                    suggestions: t.raw("tasks.realLifeExposure.socialConnectionPractice.suggestions"),
                  },
                },
                {
                  title: t("tasks.realLifeExposure.comfortZoneExpansion.title"),
                  description: t("tasks.realLifeExposure.comfortZoneExpansion.description"),
                  type: TaskType.REFLECTION,
                  order: 2,
                  content: {
                    prompts: t.raw("prompts.realLifeExposure.comfortZoneExpansion"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.handlingRejectionUncertainty.name"),
            description: t("phases.handlingRejectionUncertainty.description"),
            order: 10,
            tasks: {
              create: [
                {
                  title: t("tasks.handlingRejectionUncertainty.rejectionReframeExercise.title"),
                  description: t("tasks.handlingRejectionUncertainty.rejectionReframeExercise.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.handlingRejectionUncertainty.rejectionReframeExercise.goal"),
                    focus: t("tasks.handlingRejectionUncertainty.rejectionReframeExercise.focus"),
                    prompts: t.raw("prompts.handlingRejectionUncertainty.rejectionReframeExercise"),
                  },
                },
                {
                  title: t("tasks.handlingRejectionUncertainty.resilienceBuildingToolkit.title"),
                  description: t("tasks.handlingRejectionUncertainty.resilienceBuildingToolkit.description"),
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    strategies: t.raw("tasks.handlingRejectionUncertainty.resilienceBuildingToolkit.strategies"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.healthyAttraction.name"),
            description: t("phases.healthyAttraction.description"),
            order: 11,
            tasks: {
              create: [
                {
                  title: t("tasks.healthyAttraction.attractionAnalysis.title"),
                  description: t("tasks.healthyAttraction.attractionAnalysis.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.healthyAttraction.attractionAnalysis.goal"),
                    focus: t("tasks.healthyAttraction.attractionAnalysis.focus"),
                    prompts: t.raw("prompts.healthyAttraction.attractionAnalysis"),
                  },
                },
                {
                  title: t("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.title"),
                  description: t("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.description"),
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    healthySignal: t.raw("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.healthySignal"),
                    unhealthySignals: t.raw("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.unhealthySignals"),
                  },
                },
              ],
            },
          },
          {
            name: t("phases.integrationReadiness.name"),
            description: t("phases.integrationReadiness.description"),
            order: 12,
            tasks: {
              create: [
                {
                  title: t("tasks.integrationReadiness.journeyReflection.title"),
                  description: t("tasks.integrationReadiness.journeyReflection.description"),
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: t("tasks.integrationReadiness.journeyReflection.goal"),
                    focus: t("tasks.integrationReadiness.journeyReflection.focus"),
                    prompts: t.raw("prompts.integrationReadiness.journeyReflection"),
                  },
                },
                {
                  title: t("tasks.integrationReadiness.readinessAssessmentCommitment.title"),
                  description: t("tasks.integrationReadiness.readinessAssessmentCommitment.description"),
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    readinessIndicators: t.raw("tasks.integrationReadiness.readinessAssessmentCommitment.readinessIndicators"),
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  return program;
};

export const runSeed = async (locale: string = "en") => {
  try {
    await seedData(locale);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  runSeed();
}
