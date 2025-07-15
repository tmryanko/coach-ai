import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { generateCoachResponse, generateTaskFeedback } from '@/lib/openai';
import { MessageRole } from '@prisma/client';

export const aiRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      message: z.string(),
      includeContext: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get session and verify ownership
      const session = await ctx.prisma.chatSession.findUnique({
        where: { 
          id: input.sessionId,
          userId: ctx.userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
        },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Save user message
      await ctx.prisma.chatMessage.create({
        data: {
          sessionId: input.sessionId,
          content: input.message,
          role: MessageRole.USER,
        },
      });

      // Prepare conversation history
      const conversationHistory = session.messages
        .reverse()
        .map(msg => ({
          role: msg.role === MessageRole.USER ? 'user' as const : 'assistant' as const,
          content: msg.content,
        }));

      // Get user context if requested
      let context;
      if (input.includeContext) {
        const userProgress = await ctx.prisma.userProgress.findFirst({
          where: { userId: ctx.userId },
          include: {
            program: {
              include: {
                phases: {
                  include: {
                    tasks: {
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
          orderBy: { startedAt: 'desc' },
        });

        if (userProgress) {
          context = {
            userProgress,
            programPhase: userProgress.program.phases[userProgress.currentPhase - 1]?.name,
          };
        }
      }

      // Generate AI response
      const aiResponse = await generateCoachResponse(
        input.message,
        conversationHistory,
        context
      );

      // Save AI response
      const aiMessage = await ctx.prisma.chatMessage.create({
        data: {
          sessionId: input.sessionId,
          content: aiResponse,
          role: MessageRole.ASSISTANT,
        },
      });

      // Update session timestamp
      await ctx.prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { updatedAt: new Date() },
      });

      return {
        userMessage: input.message,
        aiResponse: aiResponse,
        messageId: aiMessage.id,
      };
    }),

  generateTaskFeedback: protectedProcedure
    .input(z.object({
      taskId: z.string(),
      userResponse: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get task details
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        include: {
          phase: {
            include: {
              program: true,
            },
          },
        },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Generate feedback
      const feedback = await generateTaskFeedback(
        task.description,
        input.userResponse,
        task.type
      );

      // Update task progress with feedback
      await ctx.prisma.taskProgress.update({
        where: {
          userId_taskId: {
            userId: ctx.userId,
            taskId: input.taskId,
          },
        },
        data: {
          feedback,
        },
      });

      return {
        feedback,
        taskTitle: task.title,
      };
    }),

  generatePersonalizedProgram: protectedProcedure
    .input(z.object({
      relationshipGoals: z.string(),
      currentChallenges: z.string(),
      relationshipStatus: z.string(),
      preferences: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // This would generate a personalized program based on user input
      // For now, we'll return a structured response that could be used to create a custom program
      
      const prompt = `Based on this user's relationship information, suggest a personalized coaching program:

Relationship Goals: ${input.relationshipGoals}
Current Challenges: ${input.currentChallenges}
Relationship Status: ${input.relationshipStatus}

Please provide:
1. A program title
2. 3-4 key focus areas
3. Recommended duration
4. 2-3 specific first steps they should take

Format as a structured response that's encouraging and actionable.`;

      const suggestion = await generateCoachResponse(prompt);

      return {
        suggestion,
        userInput: input,
      };
    }),
});