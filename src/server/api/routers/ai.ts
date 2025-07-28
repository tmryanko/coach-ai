import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { generateCoachResponse, generateTaskFeedback, generateTaskCoachResponse } from '@/lib/openai';
import { generateProfileInsights } from '@/lib/profile-analysis';
import { MessageRole, SessionType } from '@prisma/client';
import { getTaskCompletionMessage } from '@/lib/task-prompts';

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
        // Get user assessment profile
        const userProfile = await ctx.prisma.user.findUnique({
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

        const userProgress = await ctx.prisma.userProgress.findFirst({
          where: { userId: ctx.userId },
          select: {
            id: true,
            currentPhase: true,
            startedAt: true,
            program: {
              select: {
                id: true,
                name: true,
                description: true,
                phases: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    order: true,
                    tasks: {
                      select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        order: true,
                        taskProgress: {
                          where: { userId: ctx.userId },
                          select: {
                            id: true,
                            status: true,
                            completedAt: true,
                            response: true,
                          },
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

        // Get current phase name safely
        const currentPhase = userProgress?.program?.phases?.find(
          phase => phase.order === userProgress.currentPhase
        );

        context = {
          userProfile,
          userProgress,
          programPhase: currentPhase?.name,
        };
      }

      // Generate AI response - temporarily disabled due to quota limits
      const aiResponse = "I'm temporarily unavailable due to API quota limits. Your coaching features are being restored. Please try again later or contact support for immediate assistance.";

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

      // Generate feedback - temporarily disabled due to quota limits
      const feedback = "Thank you for completing this task! Your response shows thoughtful reflection. AI feedback is temporarily unavailable due to quota limits, but your progress has been saved.";

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
    .mutation(async ({ ctx }) => {
      // Get user's assessment profile
      const userProfile = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: {
          relationshipStatus: true,
          relationshipGoals: true,
          currentChallenges: true,
          preferredCommunicationStyle: true,
          personalityTraits: true,
        },
      });

      if (!userProfile || !userProfile.relationshipGoals?.length) {
        throw new Error('User assessment profile not found. Please complete your assessment first.');
      }

      const goals = userProfile.relationshipGoals.join(', ');
      const challenges = userProfile.currentChallenges?.join(', ') || 'None specified';
      const status = userProfile.relationshipStatus || 'Not specified';
      const communicationStyle = userProfile.preferredCommunicationStyle || 'Not specified';

      const prompt = `Based on this user's relationship assessment, suggest a personalized coaching program:

Relationship Status: ${status}
Relationship Goals: ${goals}
Current Challenges: ${challenges}
Communication Style: ${communicationStyle}
${userProfile.personalityTraits ? `Personality Traits: ${JSON.stringify(userProfile.personalityTraits)}` : ''}

Please provide:
1. A specific program title tailored to their needs
2. 3-4 key focus areas based on their goals and challenges
3. Recommended duration (in weeks)
4. 2-3 specific first steps they should take immediately
5. How the program will address their specific communication style

Format as a structured, encouraging response that feels personalized to their exact situation.`;

      const suggestion = "Based on your assessment, I recommend focusing on building emotional security and communication skills. A personalized coaching program would help you develop trust-building strategies and work through relationship anxiety. AI-powered recommendations are temporarily unavailable due to quota limits.";

      return {
        suggestion,
        userProfile: {
          relationshipStatus: status,
          goals: userProfile.relationshipGoals,
          challenges: userProfile.currentChallenges,
          communicationStyle,
        },
      };
    }),

  sendTaskMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get session and verify it's a task session
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

      if (session.sessionType !== SessionType.TASK_FOCUSED || !session.taskId) {
        throw new Error('This is not a task-focused session');
      }

      // Get task details for context
      const task = await ctx.prisma.task.findUnique({
        where: { id: session.taskId },
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

      // Get user context for personalization
      const userProfile = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: {
          relationshipStatus: true,
          relationshipGoals: true,
          currentChallenges: true,
          preferredCommunicationStyle: true,
          personalityTraits: true,
        },
      });

      // Generate task-focused AI response - temporarily disabled due to quota limits
      const aiResponse = "I'm here to help with your task, but AI responses are temporarily unavailable due to quota limits. Please continue with your task and your progress will be saved. Contact support if you need immediate assistance.";

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
        taskTitle: task.title,
      };
    }),

  generateProfileInsights: protectedProcedure
    .input(z.object({
      assessmentData: z.any(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Return mock insights due to quota limits
      return {
        attachmentStyleAnalysis: "AI analysis temporarily unavailable due to API quota limits. Your assessment data shows strong self-awareness and emotional intelligence.",
        communicationStyleAnalysis: "Based on your assessment, you show thoughtful communication patterns and good emotional awareness.",
        personalizedRecommendations: [
          "Focus on building trust and emotional security in relationships",
          "Practice open communication about your needs and boundaries", 
          "Continue developing your emotional intelligence skills",
          "Consider working with a relationship coach for personalized guidance"
        ],
        relationshipReadinessScore: input.assessmentData.relationshipReadiness || 7,
        recommendedCoachingApproach: "Gradual, supportive approach focusing on building confidence",
        keyStrengths: ["Self-awareness", "Emotional intelligence", "Growth mindset"],
        growthAreas: ["Building trust", "Communication", "Managing relationship anxiety"],
        generatedAt: new Date(),
      };
    }),
});