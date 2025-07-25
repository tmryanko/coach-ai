import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  userId?: string;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    prisma,
    userId: opts.userId,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const supabase = await createClient();
  
  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return createInnerTRPCContext({
    userId: user?.id,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
// superjson handles Date objects and other built-in types automatically
// Removed custom configuration that was interfering with Date serialization

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Development middleware to catch serialization issues early
 */
const serializationDebugMiddleware = t.middleware(async ({ next, path, type }) => {
  const result = await next();
  
  if (process.env.NODE_ENV === 'development' && result.ok) {
    try {
      // Test serialization in development
      JSON.stringify(result.data);
    } catch (error) {
      console.error(`[tRPC Serialization Error] ${type} ${path}:`, error);
      console.error('Data that failed to serialize:', result.data);
    }
  }
  
  return result;
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.userId` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(serializationDebugMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        userId: ctx.userId,
      },
    });
  });