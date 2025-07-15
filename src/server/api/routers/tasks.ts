import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TaskStatus } from '@prisma/client';

export const tasksRouter = createTRPCRouter({
  getTaskProgress: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const taskProgress = await ctx.prisma.taskProgress.findUnique({
        where: {
          userId_taskId: {
            userId: ctx.userId,
            taskId: input.taskId,
          },
        },
        include: {
          task: {
            include: {
              phase: {
                include: {
                  program: true,
                },
              },
            },
          },
        },
      });

      return taskProgress;
    }),

  startTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const taskProgress = await ctx.prisma.taskProgress.upsert({
        where: {
          userId_taskId: {
            userId: ctx.userId,
            taskId: input.taskId,
          },
        },
        update: {
          status: TaskStatus.IN_PROGRESS,
        },
        create: {
          userId: ctx.userId,
          taskId: input.taskId,
          status: TaskStatus.IN_PROGRESS,
        },
      });

      return taskProgress;
    }),

  submitResponse: protectedProcedure
    .input(z.object({
      taskId: z.string(),
      response: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const taskProgress = await ctx.prisma.taskProgress.upsert({
        where: {
          userId_taskId: {
            userId: ctx.userId,
            taskId: input.taskId,
          },
        },
        update: {
          response: input.response,
          status: TaskStatus.COMPLETED,
          completedAt: new Date(),
        },
        create: {
          userId: ctx.userId,
          taskId: input.taskId,
          response: input.response,
          status: TaskStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      // Update user progress
      await ctx.prisma.$transaction(async (tx) => {
        // Get the task to find the program
        const task = await tx.task.findUnique({
          where: { id: input.taskId },
          include: {
            phase: {
              include: {
                program: true,
              },
            },
          },
        });

        if (task) {
          // Count completed tasks for this program
          const completedTasks = await tx.taskProgress.count({
            where: {
              userId: ctx.userId,
              status: TaskStatus.COMPLETED,
              task: {
                phase: {
                  programId: task.phase.programId,
                },
              },
            },
          });

          // Update user progress
          await tx.userProgress.update({
            where: {
              userId_programId: {
                userId: ctx.userId,
                programId: task.phase.programId,
              },
            },
            data: {
              completedTasks,
            },
          });
        }
      });

      return taskProgress;
    }),

  getUserTasks: protectedProcedure
    .input(z.object({
      programId: z.string().optional(),
      status: z.nativeEnum(TaskStatus).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const taskProgress = await ctx.prisma.taskProgress.findMany({
        where: {
          userId: ctx.userId,
          ...(input.status && { status: input.status }),
          ...(input.programId && {
            task: {
              phase: {
                programId: input.programId,
              },
            },
          }),
        },
        include: {
          task: {
            include: {
              phase: {
                include: {
                  program: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return taskProgress;
    }),
});