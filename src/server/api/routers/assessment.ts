import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

const assessmentInputSchema = z.object({
  relationshipStatus: z.string().min(1, 'Relationship status is required'),
  relationshipGoals: z.array(z.string()).min(1, 'At least one goal is required'),
  currentChallenges: z.array(z.string()).min(1, 'At least one challenge is required'),
  preferredCommunicationStyle: z.string().min(1, 'Communication style is required'),
  personalityTraits: z.object({
    introversion: z.number().min(1).max(5),
    empathy: z.number().min(1).max(5),
    conflictStyle: z.string(),
    learningPreference: z.string(),
    priorities: z.array(z.string()),
  }),
});

export const assessmentRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { 
        assessmentCompletedAt: true,
        relationshipStatus: true,
        relationshipGoals: true,
        currentChallenges: true,
        preferredCommunicationStyle: true,
        personalityTraits: true,
      },
    });

    return {
      isCompleted: !!user?.assessmentCompletedAt,
      hasPartialData: !!(user?.relationshipStatus || user?.relationshipGoals?.length),
      data: user,
    };
  }),

  submit: protectedProcedure
    .input(assessmentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          relationshipStatus: input.relationshipStatus,
          relationshipGoals: input.relationshipGoals,
          currentChallenges: input.currentChallenges,
          preferredCommunicationStyle: input.preferredCommunicationStyle,
          personalityTraits: input.personalityTraits,
          assessmentCompletedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Assessment completed successfully!',
        user: {
          id: updatedUser.id,
          assessmentCompletedAt: updatedUser.assessmentCompletedAt,
        },
      };
    }),

  updateStep: protectedProcedure
    .input(z.object({
      step: z.string(),
      data: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Progressive saving of assessment data
      const updateData: any = {};
      
      // Early return if no data provided
      if (!input.data) {
        return { success: true, message: 'No data to save' };
      }
      
      if (input.step === 'relationship-status' && input.data.relationshipStatus) {
        updateData.relationshipStatus = input.data.relationshipStatus;
      }
      
      if (input.step === 'goals' && input.data.relationshipGoals) {
        updateData.relationshipGoals = input.data.relationshipGoals;
      }
      
      if (input.step === 'challenges' && input.data.currentChallenges) {
        updateData.currentChallenges = input.data.currentChallenges;
      }
      
      if (input.step === 'communication' && input.data.preferredCommunicationStyle) {
        updateData.preferredCommunicationStyle = input.data.preferredCommunicationStyle;
      }
      
      if (input.step === 'personality' && input.data.personalityTraits) {
        updateData.personalityTraits = input.data.personalityTraits;
      }

      if (Object.keys(updateData).length > 0) {
        await ctx.prisma.user.update({
          where: { id: ctx.userId },
          data: updateData,
        });
      }

      return { success: true };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
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

    return user;
  }),
});