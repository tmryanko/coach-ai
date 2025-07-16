import { createTRPCRouter } from '@/server/api/trpc';
import { exampleRouter } from '@/server/api/routers/example';
import { userRouter } from '@/server/api/routers/user';
import { programsRouter } from '@/server/api/routers/programs';
import { tasksRouter } from '@/server/api/routers/tasks';
import { chatRouter } from '@/server/api/routers/chat';
import { aiRouter } from '@/server/api/routers/ai';
import { assessmentRouter } from '@/server/api/routers/assessment';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  programs: programsRouter,
  tasks: tasksRouter,
  chat: chatRouter,
  ai: aiRouter,
  assessment: assessmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;