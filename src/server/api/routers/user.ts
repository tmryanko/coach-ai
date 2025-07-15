import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { createClient } from '@/lib/supabase/server';

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const supabase = await createClient();
    
    // Get user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user exists in our database
    let dbUser = await ctx.prisma.user.findUnique({
      where: { id: user.id },
    });

    // If user doesn't exist, create them
    if (!dbUser) {
      dbUser = await ctx.prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.user_metadata?.full_name,
          avatar: user.user_metadata?.avatar_url,
          googleId: user.user_metadata?.provider_id,
        },
      });
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar,
      createdAt: dbUser.createdAt,
    };
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          name: input.name,
        },
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      };
    }),

  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const progress = await ctx.prisma.userProgress.findMany({
      where: { userId: ctx.userId },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
          },
        },
      },
    });

    return progress;
  }),
});