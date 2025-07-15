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
});