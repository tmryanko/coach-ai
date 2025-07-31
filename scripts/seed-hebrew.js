const { PrismaClient, TaskType } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Load Hebrew translations
const heTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/messages/he.json"), "utf8")
);

// Helper function to get nested translation
function getTranslation(key) {
  const keys = key.split(".");
  let value = heTranslations.coachingProgram;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation not found for key: coachingProgram.${key}`);
      return key; // Return key if translation not found
    }
  }
  
  return value;
}

async function seedHebrewData() {
  try {
    // Delete existing programs first
    await prisma.taskProgress.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.task.deleteMany();
    await prisma.phase.deleteMany();
    await prisma.coachingProgram.deleteMany();

    // Create the comprehensive 12-stage AI Relationship Coaching Program
    const program = await prisma.coachingProgram.create({
      data: {
        name: getTranslation("name"),
        description: getTranslation("description"),
        duration: 84, // 12 stages × 7 days each
        phases: {
          create: [
            {
              name: getTranslation("phases.selfDiscovery.name"),
              description: getTranslation("phases.selfDiscovery.description"),
              order: 1,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.selfDiscovery.defineCoreValues.title"),
                    description: getTranslation("tasks.selfDiscovery.defineCoreValues.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.selfDiscovery.defineCoreValues.goal"),
                      focus: getTranslation("tasks.selfDiscovery.defineCoreValues.focus"),
                      prompts: getTranslation("prompts.selfDiscovery.defineCoreValues"),
                    },
                  },
                  {
                    title: getTranslation("tasks.selfDiscovery.authenticSelfAssessment.title"),
                    description: getTranslation("tasks.selfDiscovery.authenticSelfAssessment.description"),
                    type: TaskType.ASSESSMENT,
                    order: 2,
                    content: {
                      goal: getTranslation("tasks.selfDiscovery.authenticSelfAssessment.goal"),
                      focus: getTranslation("tasks.selfDiscovery.authenticSelfAssessment.focus"),
                      questions: [
                        "מתי אתה מרגיש הכי אותנטי להיות עצמך?",
                        "אילו תכונות אתה הכי אוהב בעצמך?",
                        "אילו היבטים של עצמך אתה מסתיר בזוגיות?",
                        "איך אתה רוצה שבן/בת זוג רומנטי יראה אותך?",
                      ],
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.pastRelationshipPatterns.name"),
              description: getTranslation("phases.pastRelationshipPatterns.description"),
              order: 2,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.title"),
                    description: getTranslation("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.goal"),
                      focus: getTranslation("tasks.pastRelationshipPatterns.relationshipPatternAnalysis.focus"),
                      prompts: getTranslation("prompts.pastRelationshipPatterns.relationshipPatternAnalysis"),
                    },
                  },
                  {
                    title: getTranslation("tasks.pastRelationshipPatterns.emotionalWoundsInventory.title"),
                    description: getTranslation("tasks.pastRelationshipPatterns.emotionalWoundsInventory.description"),
                    type: TaskType.JOURNALING,
                    order: 2,
                    content: {
                      instructions: getTranslation("tasks.pastRelationshipPatterns.emotionalWoundsInventory.instructions"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.innerBlocksFears.name"),
              description: getTranslation("phases.innerBlocksFears.description"),
              order: 3,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.innerBlocksFears.fearIdentificationExercise.title"),
                    description: getTranslation("tasks.innerBlocksFears.fearIdentificationExercise.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.innerBlocksFears.fearIdentificationExercise.goal"),
                      focus: getTranslation("tasks.innerBlocksFears.fearIdentificationExercise.focus"),
                      prompts: getTranslation("prompts.innerBlocksFears.fearIdentificationExercise"),
                    },
                  },
                  {
                    title: getTranslation("tasks.innerBlocksFears.limitingBeliefChallenge.title"),
                    description: getTranslation("tasks.innerBlocksFears.limitingBeliefChallenge.description"),
                    type: TaskType.EXERCISE,
                    order: 2,
                    content: {
                      technique: getTranslation("tasks.innerBlocksFears.limitingBeliefChallenge.technique"),
                      steps: getTranslation("tasks.innerBlocksFears.limitingBeliefChallenge.steps"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.emotionalRegulation.name"),
              description: getTranslation("phases.emotionalRegulation.description"),
              order: 4,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.emotionalRegulation.triggerResponseAnalysis.title"),
                    description: getTranslation("tasks.emotionalRegulation.triggerResponseAnalysis.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.emotionalRegulation.triggerResponseAnalysis.goal"),
                      focus: getTranslation("tasks.emotionalRegulation.triggerResponseAnalysis.focus"),
                      prompts: getTranslation("prompts.emotionalRegulation.triggerResponseAnalysis"),
                    },
                  },
                  {
                    title: getTranslation("tasks.emotionalRegulation.emotionalRegulationToolkit.title"),
                    description: getTranslation("tasks.emotionalRegulation.emotionalRegulationToolkit.description"),
                    type: TaskType.EXERCISE,
                    order: 2,
                    content: {
                      techniques: getTranslation("tasks.emotionalRegulation.emotionalRegulationToolkit.techniques"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.selfCompassionConfidence.name"),
              description: getTranslation("phases.selfCompassionConfidence.description"),
              order: 5,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.selfCompassionConfidence.selfCompassionLetter.title"),
                    description: getTranslation("tasks.selfCompassionConfidence.selfCompassionLetter.description"),
                    type: TaskType.JOURNALING,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.selfCompassionConfidence.selfCompassionLetter.goal"),
                      focus: getTranslation("tasks.selfCompassionConfidence.selfCompassionLetter.focus"),
                      prompts: getTranslation("prompts.selfCompassionConfidence.selfCompassionLetter"),
                    },
                  },
                  {
                    title: getTranslation("tasks.selfCompassionConfidence.confidenceBuildingPractice.title"),
                    description: getTranslation("tasks.selfCompassionConfidence.confidenceBuildingPractice.description"),
                    type: TaskType.EXERCISE,
                    order: 2,
                    content: {
                      dailyPractice: getTranslation("tasks.selfCompassionConfidence.confidenceBuildingPractice.dailyPractice"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.communicationExpression.name"),
              description: getTranslation("phases.communicationExpression.description"),
              order: 6,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.communicationExpression.authenticExpressionPractice.title"),
                    description: getTranslation("tasks.communicationExpression.authenticExpressionPractice.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.communicationExpression.authenticExpressionPractice.goal"),
                      focus: getTranslation("tasks.communicationExpression.authenticExpressionPractice.focus"),
                      prompts: getTranslation("prompts.communicationExpression.authenticExpressionPractice"),
                    },
                  },
                  {
                    title: getTranslation("tasks.communicationExpression.activeListeningChallenge.title"),
                    description: getTranslation("tasks.communicationExpression.activeListeningChallenge.description"),
                    type: TaskType.EXERCISE,
                    order: 2,
                    content: {
                      instructions: getTranslation("tasks.communicationExpression.activeListeningChallenge.instructions"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.boundariesStandards.name"),
              description: getTranslation("phases.boundariesStandards.description"),
              order: 7,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.boundariesStandards.relationshipBoundariesDefinition.title"),
                    description: getTranslation("tasks.boundariesStandards.relationshipBoundariesDefinition.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.boundariesStandards.relationshipBoundariesDefinition.goal"),
                      focus: getTranslation("tasks.boundariesStandards.relationshipBoundariesDefinition.focus"),
                      prompts: getTranslation("prompts.boundariesStandards.relationshipBoundariesDefinition"),
                    },
                  },
                  {
                    title: getTranslation("tasks.boundariesStandards.standardsAssessment.title"),
                    description: getTranslation("tasks.boundariesStandards.standardsAssessment.description"),
                    type: TaskType.ASSESSMENT,
                    order: 2,
                    content: {
                      categories: getTranslation("tasks.boundariesStandards.standardsAssessment.categories"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.idealPartnerVision.name"),
              description: getTranslation("phases.idealPartnerVision.description"),
              order: 8,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.idealPartnerVision.relationshipVisionBoard.title"),
                    description: getTranslation("tasks.idealPartnerVision.relationshipVisionBoard.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.idealPartnerVision.relationshipVisionBoard.goal"),
                      focus: getTranslation("tasks.idealPartnerVision.relationshipVisionBoard.focus"),
                      prompts: getTranslation("prompts.idealPartnerVision.relationshipVisionBoard"),
                    },
                  },
                  {
                    title: getTranslation("tasks.idealPartnerVision.valuesAlignmentExercise.title"),
                    description: getTranslation("tasks.idealPartnerVision.valuesAlignmentExercise.description"),
                    type: TaskType.EXERCISE,
                    order: 2,
                    content: {
                      steps: getTranslation("tasks.idealPartnerVision.valuesAlignmentExercise.steps"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.realLifeExposure.name"),
              description: getTranslation("phases.realLifeExposure.description"),
              order: 9,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.realLifeExposure.socialConnectionPractice.title"),
                    description: getTranslation("tasks.realLifeExposure.socialConnectionPractice.description"),
                    type: TaskType.EXERCISE,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.realLifeExposure.socialConnectionPractice.goal"),
                      focus: getTranslation("tasks.realLifeExposure.socialConnectionPractice.focus"),
                      suggestions: getTranslation("tasks.realLifeExposure.socialConnectionPractice.suggestions"),
                    },
                  },
                  {
                    title: getTranslation("tasks.realLifeExposure.comfortZoneExpansion.title"),
                    description: getTranslation("tasks.realLifeExposure.comfortZoneExpansion.description"),
                    type: TaskType.REFLECTION,
                    order: 2,
                    content: {
                      prompts: getTranslation("prompts.realLifeExposure.comfortZoneExpansion"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.handlingRejectionUncertainty.name"),
              description: getTranslation("phases.handlingRejectionUncertainty.description"),
              order: 10,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.handlingRejectionUncertainty.rejectionReframeExercise.title"),
                    description: getTranslation("tasks.handlingRejectionUncertainty.rejectionReframeExercise.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.handlingRejectionUncertainty.rejectionReframeExercise.goal"),
                      focus: getTranslation("tasks.handlingRejectionUncertainty.rejectionReframeExercise.focus"),
                      prompts: getTranslation("prompts.handlingRejectionUncertainty.rejectionReframeExercise"),
                    },
                  },
                  {
                    title: getTranslation("tasks.handlingRejectionUncertainty.resilienceBuildingToolkit.title"),
                    description: getTranslation("tasks.handlingRejectionUncertainty.resilienceBuildingToolkit.description"),
                    type: TaskType.EXERCISE,
                    order: 2,
                    content: {
                      strategies: getTranslation("tasks.handlingRejectionUncertainty.resilienceBuildingToolkit.strategies"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.healthyAttraction.name"),
              description: getTranslation("phases.healthyAttraction.description"),
              order: 11,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.healthyAttraction.attractionAnalysis.title"),
                    description: getTranslation("tasks.healthyAttraction.attractionAnalysis.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.healthyAttraction.attractionAnalysis.goal"),
                      focus: getTranslation("tasks.healthyAttraction.attractionAnalysis.focus"),
                      prompts: getTranslation("prompts.healthyAttraction.attractionAnalysis"),
                    },
                  },
                  {
                    title: getTranslation("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.title"),
                    description: getTranslation("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.description"),
                    type: TaskType.ASSESSMENT,
                    order: 2,
                    content: {
                      healthySignal: getTranslation("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.healthySignal"),
                      unhealthySignals: getTranslation("tasks.healthyAttraction.healthyUnhealthyPatternsAssessment.unhealthySignals"),
                    },
                  },
                ],
              },
            },
            {
              name: getTranslation("phases.integrationReadiness.name"),
              description: getTranslation("phases.integrationReadiness.description"),
              order: 12,
              tasks: {
                create: [
                  {
                    title: getTranslation("tasks.integrationReadiness.journeyReflection.title"),
                    description: getTranslation("tasks.integrationReadiness.journeyReflection.description"),
                    type: TaskType.REFLECTION,
                    order: 1,
                    content: {
                      goal: getTranslation("tasks.integrationReadiness.journeyReflection.goal"),
                      focus: getTranslation("tasks.integrationReadiness.journeyReflection.focus"),
                      prompts: getTranslation("prompts.integrationReadiness.journeyReflection"),
                    },
                  },
                  {
                    title: getTranslation("tasks.integrationReadiness.readinessAssessmentCommitment.title"),
                    description: getTranslation("tasks.integrationReadiness.readinessAssessmentCommitment.description"),
                    type: TaskType.ASSESSMENT,
                    order: 2,
                    content: {
                      readinessIndicators: getTranslation("tasks.integrationReadiness.readinessAssessmentCommitment.readinessIndicators"),
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log("Hebrew coaching program created successfully!");
    return program;
  } catch (error) {
    console.error("Error seeding Hebrew data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedHebrewData();