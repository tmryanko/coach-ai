import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { MessageRole, SessionType } from '@prisma/client';
import { getTaskSystemPrompt, getTaskWelcomeMessage } from '@/lib/task-prompts';

export const chatRouter = createTRPCRouter({
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    const sessions = await ctx.prisma.chatSession.findMany({
      where: { userId: ctx.userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return sessions;
  }),

  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.findUnique({
        where: { 
          id: input.sessionId,
          userId: ctx.userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      return session;
    }),

  createSession: protectedProcedure
    .input(z.object({
      title: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.create({
        data: {
          userId: ctx.userId,
          title: input.title,
        },
      });

      return session;
    }),

  updateSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      title: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.update({
        where: { 
          id: input.sessionId,
          userId: ctx.userId,
        },
        data: {
          title: input.title,
        },
      });

      return session;
    }),

  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chatSession.delete({
        where: { 
          id: input.sessionId,
          userId: ctx.userId,
        },
      });

      return { success: true };
    }),

  addMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
      role: z.nativeEnum(MessageRole),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.chatMessage.create({
        data: {
          sessionId: input.sessionId,
          content: input.content,
          role: input.role,
          metadata: input.metadata,
        },
      });

      // Update session timestamp
      await ctx.prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { updatedAt: new Date() },
      });

      return message;
    }),

  getMessages: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.chatMessage.findMany({
        where: { 
          sessionId: input.sessionId,
          session: {
            userId: ctx.userId,
          },
        },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
        orderBy: { createdAt: 'desc' },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (messages.length > input.limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem!.id;
      }

      return {
        messages: messages.reverse(),
        nextCursor,
      };
    }),

  // Task-specific session endpoints
  createTaskSession: protectedProcedure
    .input(z.object({
      taskId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get task details to create appropriate system prompt
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

      // Check if session already exists for this task
      const existingSession = await ctx.prisma.chatSession.findFirst({
        where: {
          userId: ctx.userId,
          taskId: input.taskId,
          sessionType: SessionType.TASK_FOCUSED,
        },
      });

      if (existingSession) {
        return existingSession;
      }

      // Create new task-focused session
      const systemPrompt = getTaskSystemPrompt(task.type, task.title, task.description);
      const welcomeMessage = getTaskWelcomeMessage(task.type, task.title);

      const session = await ctx.prisma.chatSession.create({
        data: {
          userId: ctx.userId,
          title: `Task: ${task.title}`,
          sessionType: SessionType.TASK_FOCUSED,
          taskId: input.taskId,
          systemPrompt,
        },
      });

      // Add welcome message
      await ctx.prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          content: welcomeMessage,
          role: MessageRole.ASSISTANT,
        },
      });

      return session;
    }),

  getTaskSession: protectedProcedure
    .input(z.object({
      taskId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.findFirst({
        where: {
          userId: ctx.userId,
          taskId: input.taskId,
          sessionType: SessionType.TASK_FOCUSED,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return session;
    }),

  completeTaskSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.update({
        where: {
          id: input.sessionId,
          userId: ctx.userId,
        },
        data: {
          isTaskCompleted: true,
        },
      });

      return session;
    }),
});