import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

export const programsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.prisma.coachingProgram.findMany({
      where: { isActive: true },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                type: true,
                order: true,
              },
            },
          },
        },
      },
    });

    return programs;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const program = await ctx.prisma.coachingProgram.findUnique({
        where: { id: input.id },
        include: {
          phases: {
            orderBy: { order: 'asc' },
            include: {
              tasks: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      if (!program) {
        throw new Error('Program not found');
      }

      return program;
    }),

  enroll: protectedProcedure
    .input(z.object({ programId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is already enrolled
      const existingProgress = await ctx.prisma.userProgress.findUnique({
        where: {
          userId_programId: {
            userId: ctx.userId,
            programId: input.programId,
          },
        },
      });

      if (existingProgress) {
        throw new Error('Already enrolled in this program');
      }

      // Get program with tasks to calculate total tasks
      const program = await ctx.prisma.coachingProgram.findUnique({
        where: { id: input.programId },
        include: {
          phases: {
            include: {
              tasks: true,
            },
          },
        },
      });

      if (!program) {
        throw new Error('Program not found');
      }

      const totalTasks = program.phases.reduce(
        (sum, phase) => sum + phase.tasks.length,
        0
      );

      // Create user progress record
      const userProgress = await ctx.prisma.userProgress.create({
        data: {
          userId: ctx.userId,
          programId: input.programId,
          totalTasks,
        },
      });

      return userProgress;
    }),

  getUserProgress: protectedProcedure
    .input(z.object({ programId: z.string() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.prisma.userProgress.findUnique({
        where: {
          userId_programId: {
            userId: ctx.userId,
            programId: input.programId,
          },
        },
        include: {
          program: {
            include: {
              phases: {
                orderBy: { order: 'asc' },
                include: {
                  tasks: {
                    orderBy: { order: 'asc' },
                    include: {
                      taskProgress: {
                        where: { userId: ctx.userId },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return progress;
    }),

  getRecommendations: protectedProcedure.query(async ({ ctx }) => {
    // Get user's assessment profile
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        relationshipStatus: true,
        relationshipGoals: true,
        currentChallenges: true,
        preferredCommunicationStyle: true,
        personalityTraits: true,
        assessmentCompletedAt: true,
      },
    });

    if (!user?.assessmentCompletedAt) {
      return { recommendations: [], message: 'Complete your assessment to get personalized program recommendations' };
    }

    // Get all active programs
    const programs = await ctx.prisma.coachingProgram.findMany({
      where: { isActive: true },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                type: true,
                order: true,
              },
            },
          },
        },
        userProgress: {
          where: { userId: ctx.userId },
        },
      },
    });

    // Create personalized recommendations
    const recommendations = programs.map((program) => {
      const isEnrolled = program.userProgress.length > 0;
      
      // Calculate relevance score based on user profile
      let relevanceScore = 0;
      let customization = {
        description: program.description,
        highlightedStages: [] as string[],
        personalizedMessage: '',
      };

      // Base relevance for AI Relationship Coaching Program
      if (program.name === 'AI Relationship Coaching Program') {
        relevanceScore = 100; // Always highest relevance
        
        // Customize based on relationship status
        if (user.relationshipStatus === 'single') {
          customization.personalizedMessage = 'Perfect for building self-awareness and preparing for healthy relationships';
          customization.highlightedStages = ['Self-Discovery', 'Inner Blocks & Fears', 'Real-Life Exposure'];
        } else if (user.relationshipStatus === 'dating') {
          customization.personalizedMessage = 'Ideal for developing healthy dating patterns and making conscious choices';
          customization.highlightedStages = ['Healthy Attraction', 'Boundaries & Standards', 'Handling Rejection & Uncertainty'];
        } else if (['committed', 'engaged', 'married'].includes(user.relationshipStatus || '')) {
          customization.personalizedMessage = 'Great for deepening your existing relationship and personal growth';
          customization.highlightedStages = ['Communication & Expression', 'Emotional Regulation', 'Integration & Readiness'];
        }

        // Customize based on primary goals
        if (user.relationshipGoals?.includes('improve-communication')) {
          customization.highlightedStages.push('Communication & Expression');
          if (!customization.personalizedMessage.includes('communication')) {
            customization.personalizedMessage += ' with special focus on communication skills';
          }
        }
        
        if (user.relationshipGoals?.includes('build-trust')) {
          customization.highlightedStages.push('Boundaries & Standards', 'Inner Blocks & Fears');
        }
        
        if (user.relationshipGoals?.includes('personal-growth')) {
          customization.highlightedStages.push('Self-Discovery', 'Self-Compassion & Confidence');
        }

        // Customize based on communication style
        if (user.preferredCommunicationStyle === 'direct-honest') {
          customization.personalizedMessage += '. Tasks adapted for direct, practical approaches.';
        } else if (user.preferredCommunicationStyle === 'gentle-supportive') {
          customization.personalizedMessage += '. Tasks designed with gentle, nurturing guidance.';
        } else if (user.preferredCommunicationStyle === 'analytical-logical') {
          customization.personalizedMessage += '. Structured, evidence-based approach throughout.';
        } else if (user.preferredCommunicationStyle === 'emotional-expressive') {
          customization.personalizedMessage += '. Creative, feeling-focused exercises included.';
        }

        // Customize based on current challenges
        if (user.currentChallenges?.includes('communication')) {
          customization.highlightedStages.push('Communication & Expression', 'Emotional Regulation');
        }
        if (user.currentChallenges?.includes('trust')) {
          customization.highlightedStages.push('Inner Blocks & Fears', 'Boundaries & Standards');
        }
        if (user.currentChallenges?.includes('intimacy')) {
          customization.highlightedStages.push('Self-Compassion & Confidence', 'Communication & Expression');
        }
      }

      // Other program logic for additional programs
      if (program.name === 'Communication Mastery') {
        if (user.relationshipGoals?.includes('improve-communication')) {
          relevanceScore = 85;
        } else {
          relevanceScore = 60;
        }
        customization.personalizedMessage = 'Focused specifically on communication skills development';
      }

      // Remove duplicates from highlighted stages
      customization.highlightedStages = [...new Set(customization.highlightedStages)];

      return {
        ...program,
        relevanceScore,
        customization,
        isEnrolled,
        totalTasks: program.phases.reduce((sum, phase) => sum + phase.tasks.length, 0),
      };
    });

    // Sort by relevance score (highest first)
    const sortedRecommendations = recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      recommendations: sortedRecommendations,
      userProfile: {
        relationshipStatus: user.relationshipStatus,
        primaryGoals: user.relationshipGoals?.slice(0, 2) || [],
        communicationStyle: user.preferredCommunicationStyle,
        topChallenges: user.currentChallenges?.slice(0, 2) || [],
      },
    };
  }),
});