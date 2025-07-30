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
            name: "Past Relationship Patterns",
            description:
              "Reflect on past experiences to identify patterns and wounds",
            order: 2,
            tasks: {
              create: [
                {
                  title: "Relationship Pattern Analysis",
                  description:
                    "Describe your most meaningful past relationship. What worked? What didn't?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Reflect on past experiences to identify patterns and wounds",
                    focus: "Lessons learned, emotional baggage",
                    prompts: [
                      "What patterns do you notice across your relationships?",
                      "What role do you typically play in relationships?",
                      "What lessons have your past relationships taught you?",
                      "Which relationship patterns serve you? Which don't?",
                      "What would you do differently in future relationships?",
                    ],
                  },
                },
                {
                  title: "Emotional Wounds Inventory",
                  description:
                    "Identify any unresolved hurt or trauma that might be affecting your ability to connect.",
                  type: TaskType.JOURNALING,
                  order: 2,
                  content: {
                    instructions: [
                      "Write about a time you felt deeply hurt in a relationship",
                      "Explore how this experience shaped your expectations",
                      "Identify any protective mechanisms you developed",
                      "Consider what healing might look like for you",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Inner Blocks & Fears",
            description:
              "Explore fears, limiting beliefs, and internal resistance",
            order: 3,
            tasks: {
              create: [
                {
                  title: "Fear Identification Exercise",
                  description:
                    "What's one thought that often holds you back from opening up to someone new?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Explore fears, limiting beliefs, and internal resistance",
                    focus: "Fear of rejection, abandonment, self-doubt",
                    prompts: [
                      "What are your biggest fears about relationships?",
                      "What beliefs about love hold you back?",
                      "When do you feel most vulnerable in relationships?",
                      "What stories do you tell yourself about your worthiness?",
                      "How do these fears protect you? How do they limit you?",
                    ],
                  },
                },
                {
                  title: "Limiting Belief Challenge",
                  description:
                    "Identify and challenge the negative beliefs that create relationship barriers.",
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    technique:
                      "For each limiting belief, ask: Is this absolutely true? What evidence contradicts it? How would I act without this belief?",
                    steps: [
                      "Write down 3 limiting beliefs about yourself in relationships",
                      "Question the truth of each belief",
                      "Find evidence that contradicts each belief",
                      "Rewrite each belief in a more empowering way",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Emotional Regulation",
            description: "Learn how to recognize and manage emotional triggers",
            order: 4,
            tasks: {
              create: [
                {
                  title: "Trigger Response Analysis",
                  description:
                    "Describe a recent emotional trigger and how you reacted. Could you respond differently next time?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Learn how to recognize and manage emotional triggers",
                    focus: "Emotional maturity, calm under pressure",
                    prompts: [
                      "What situations typically trigger strong emotions for you?",
                      "How do you usually react when triggered?",
                      "What physical sensations do you notice when triggered?",
                      "What would a healthier response look like?",
                      "How can you create space between trigger and response?",
                    ],
                  },
                },
                {
                  title: "Emotional Regulation Toolkit",
                  description:
                    "Develop a personalized set of strategies for managing intense emotions.",
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    techniques: [
                      "Deep breathing (4-7-8 technique)",
                      "Grounding exercises (5-4-3-2-1 sensory method)",
                      "Pause and reflect before responding",
                      "Physical movement to release energy",
                      "Self-compassion phrases for difficult moments",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Self-Compassion & Confidence",
            description: "Strengthen self-worth and inner dialogue",
            order: 5,
            tasks: {
              create: [
                {
                  title: "Self-Compassion Letter",
                  description:
                    "Write a short letter to yourself offering kindness and support, as if you were your own best friend.",
                  type: TaskType.JOURNALING,
                  order: 1,
                  content: {
                    goal: "Strengthen self-worth and inner dialogue",
                    focus: "Self-love, confidence, self-talk",
                    prompts: [
                      "What would you say to a dear friend going through your situation?",
                      "What kindness do you need to hear right now?",
                      "How can you be more gentle with yourself?",
                      "What are you most proud of about your journey so far?",
                      "What would unconditional self-love look like?",
                    ],
                  },
                },
                {
                  title: "Confidence Building Practice",
                  description:
                    "Identify your strengths and practice celebrating your unique qualities.",
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    dailyPractice: [
                      "Write down 3 things you did well each day",
                      "Practice positive self-talk in the mirror",
                      "List 5 qualities that make you a great partner",
                      "Celebrate small wins and progress",
                      "Practice receiving compliments gracefully",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Communication & Expression",
            description: "Improve honesty, vulnerability, and listening",
            order: 6,
            tasks: {
              create: [
                {
                  title: "Authentic Expression Practice",
                  description:
                    "Describe a time you didn't speak your truth. What would you say now?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Improve honesty, vulnerability, and listening",
                    focus: "Assertiveness, sharing needs, setting tone",
                    prompts: [
                      "When do you find it hardest to speak your truth?",
                      "What prevents you from being fully honest?",
                      "How do you want to communicate your needs?",
                      "What would authentic vulnerability look like for you?",
                      "How can you balance honesty with kindness?",
                    ],
                  },
                },
                {
                  title: "Active Listening Challenge",
                  description:
                    "Practice deep listening skills with someone in your life this week.",
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    instructions: [
                      "Listen to understand, not to respond",
                      "Reflect back what you heard before sharing your perspective",
                      "Ask curious questions instead of giving advice",
                      "Notice when your mind starts planning your response",
                      "Practice being fully present in conversations",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Boundaries & Standards",
            description:
              "Define what is okay — and what's not — for you in a relationship",
            order: 7,
            tasks: {
              create: [
                {
                  title: "Relationship Boundaries Definition",
                  description:
                    "List 3 emotional boundaries that you need in a healthy relationship.",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Define what is okay — and what's not — for you in a relationship",
                    focus: "Self-respect, protection, clarity",
                    prompts: [
                      "What behaviors are absolutely unacceptable to you?",
                      "What do you need to feel safe and respected?",
                      "How do you want to be treated when you're upset?",
                      "What boundaries have you struggled to maintain?",
                      "How will you communicate your boundaries clearly?",
                    ],
                  },
                },
                {
                  title: "Standards Assessment",
                  description:
                    "Define your non-negotiable standards for a romantic partnership.",
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    categories: [
                      "Communication style and conflict resolution",
                      "Emotional maturity and responsibility",
                      "Shared values and life direction",
                      "Physical and emotional intimacy",
                      "Respect and mutual support",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Ideal Partner & Vision",
            description: "Clarify the kind of connection you're seeking",
            order: 8,
            tasks: {
              create: [
                {
                  title: "Relationship Vision Board",
                  description:
                    "Write a vision of your ideal relationship — what does it feel like? What do you bring into it?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Clarify the kind of connection you're seeking",
                    focus: "Alignment, compatibility, long-term vision",
                    prompts: [
                      "How do you want to feel in your ideal relationship?",
                      "What kind of partnership do you envision?",
                      "What qualities do you want in a life partner?",
                      "How do you want to grow together?",
                      "What would you contribute to this relationship?",
                    ],
                  },
                },
                {
                  title: "Values Alignment Exercise",
                  description:
                    "Explore how your values align with your relationship vision.",
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    steps: [
                      "Review your core values from Stage 1",
                      "Consider how these values show up in relationships",
                      "Identify values you want to share with a partner",
                      "Explore where differences might be acceptable",
                      "Create a values-based relationship vision",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Real-Life Exposure",
            description: "Begin taking intentional action in real life",
            order: 9,
            tasks: {
              create: [
                {
                  title: "Social Connection Practice",
                  description:
                    "Start a short conversation with someone new this week. Reflect on how it felt.",
                  type: TaskType.EXERCISE,
                  order: 1,
                  content: {
                    goal: "Begin taking intentional action in real life",
                    focus: "Initiating conversations, putting self out there",
                    suggestions: [
                      "Strike up a conversation with a friendly stranger",
                      "Join a social activity or group that interests you",
                      "Practice being more open in existing friendships",
                      "Try online dating with authentic profile creation",
                      "Attend social events with an open, curious mindset",
                    ],
                  },
                },
                {
                  title: "Comfort Zone Expansion",
                  description:
                    "Take one small step outside your comfort zone in social situations.",
                  type: TaskType.REFLECTION,
                  order: 2,
                  content: {
                    prompts: [
                      "What feels scary but exciting about meeting new people?",
                      "How did it feel to step outside your comfort zone?",
                      "What did you learn about yourself?",
                      "What would you do differently next time?",
                      "How can you continue expanding your social world?",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Handling Rejection & Uncertainty",
            description: "Build resilience in the face of emotional risk",
            order: 10,
            tasks: {
              create: [
                {
                  title: "Rejection Reframe Exercise",
                  description:
                    "Recall a recent rejection or let-down. What did you learn? What did you make it mean about yourself?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Build resilience in the face of emotional risk",
                    focus: "Emotional agility, detachment, staying open",
                    prompts: [
                      "How do you typically handle rejection?",
                      "What stories do you tell yourself when things don't work out?",
                      "What would rejection mean if it wasn't about your worth?",
                      "How can you stay open while protecting your heart?",
                      "What would fearless dating look like for you?",
                    ],
                  },
                },
                {
                  title: "Resilience Building Toolkit",
                  description:
                    "Develop strategies for bouncing back from romantic disappointments.",
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    strategies: [
                      "Reframe rejection as redirection or incompatibility",
                      "Focus on what you can control (your actions, responses)",
                      "Maintain perspective - one person's opinion isn't universal truth",
                      "Use setbacks as opportunities for growth and learning",
                      "Build a support system for encouragement and reality-checking",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Healthy Attraction",
            description: "Recognize authentic interest vs. emotional addiction",
            order: 11,
            tasks: {
              create: [
                {
                  title: "Attraction Analysis",
                  description:
                    "Think of someone you were recently attracted to. What drew you in — and was it healthy?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Recognize authentic interest vs. emotional addiction",
                    focus:
                      "Avoiding toxic patterns, tuning into real compatibility",
                    prompts: [
                      "What typically attracts you to someone?",
                      "Do you confuse intensity with compatibility?",
                      "What red flags have you ignored because of attraction?",
                      "How do you distinguish healthy attraction from unhealthy patterns?",
                      "What would balanced, healthy attraction feel like?",
                    ],
                  },
                },
                {
                  title: "Healthy vs. Unhealthy Patterns Assessment",
                  description:
                    "Learn to identify the difference between healthy connection and emotional addiction.",
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    healthySignal: [
                      "Feeling calm and secure around them",
                      "Being able to be yourself authentically",
                      "Shared values and compatible life goals",
                      "Mutual respect and healthy communication",
                      "Natural progression without games or drama",
                    ],
                    unhealthySignals: [
                      "Constant anxiety or obsessing about them",
                      "Feeling like you need to change yourself",
                      "On-and-off patterns or hot-and-cold behavior",
                      "Ignoring your own needs and boundaries",
                      "Justifying concerning behaviors",
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Integration & Readiness",
            description:
              "Reflect on growth and prepare for long-term connection",
            order: 12,
            tasks: {
              create: [
                {
                  title: "Journey Reflection",
                  description:
                    "In your own words, how have you changed since beginning this journey? What are you ready for now?",
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    goal: "Reflect on growth and prepare for long-term connection",
                    focus: "Integration, self-trust, conscious readiness",
                    prompts: [
                      "What has been your biggest breakthrough in this journey?",
                      "How has your relationship with yourself changed?",
                      "What patterns have you released or transformed?",
                      "What new strengths have you discovered?",
                      "How do you feel different about love and relationships now?",
                    ],
                  },
                },
                {
                  title: "Readiness Assessment & Commitment",
                  description:
                    "Evaluate your readiness for a healthy, conscious relationship.",
                  type: TaskType.ASSESSMENT,
                  order: 2,
                  content: {
                    readinessIndicators: [
                      "I know and honor my own values and boundaries",
                      "I can communicate my needs clearly and kindly",
                      "I've healed my major emotional wounds",
                      "I feel confident in my worth and what I offer",
                      "I can handle rejection and uncertainty with grace",
                      "I attract people based on compatibility, not just chemistry",
                      "I'm ready to build something meaningful with the right person",
                    ],
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
