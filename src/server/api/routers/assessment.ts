import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

// Legacy assessment schema for backward compatibility
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

// Enhanced assessment schema
const enhancedAssessmentSchema = z.object({
  // Core Identity
  name: z.string().optional(),
  age: z.number().optional(),
  location: z.string().optional(),
  gender: z.string().optional(),
  
  // Relationship Status & History
  relationshipStatus: z.string().min(1, 'Relationship status is required'),
  relationshipHistory: z.object({
    hasSignificantPast: z.boolean(),
    lastRelationshipDuration: z.string().optional(),
    timeSinceLastRelationship: z.string().optional(),
    keyLessonsLearned: z.string().optional(),
    healingProgress: z.string().optional(),
  }).optional(),
  
  // Goals & Intentions
  relationshipGoals: z.array(z.string()).min(1, 'At least one goal is required'),
  relationshipReadiness: z.number().min(1).max(7).optional(),
  
  // Emotional & Psychological Profile
  emotionalProfile: z.object({
    attachmentStyle: z.string().optional(),
    primaryFears: z.array(z.string()).optional(),
    topStrengths: z.array(z.string()).optional(),
    emotionalChallenges: z.array(z.string()).optional(),
    copingStrategies: z.array(z.string()).optional(),
  }).optional(),
  
  // Values & Life Vision
  coreValues: z.array(z.string()).optional(),
  relationshipVision: z.string().optional(),
  dealBreakers: z.array(z.string()).optional(),
  
  // Communication & Compatibility
  preferredCommunicationStyle: z.string().min(1, 'Communication style is required'),
  
  // Lifestyle & Interests
  lifestylePriorities: z.object({
    workLifeBalance: z.string().optional(),
    socialEnergyLevel: z.number().min(1).max(7).optional(),
    hobbiesAndInterests: z.array(z.string()).optional(),
    livingPreferences: z.array(z.string()).optional(),
  }).optional(),
  
  // Self-Reflection & Growth
  selfReflection: z.object({
    friendsDescription: z.string().optional(),
    proudestMoment: z.string().optional(),
    biggestGrowthArea: z.string().optional(),
    personalStrengths: z.array(z.string()).optional(),
    areasForImprovement: z.array(z.string()).optional(),
  }).optional(),
  
  // Legacy compatibility
  currentChallenges: z.array(z.string()).min(1, 'At least one challenge is required'),
  personalityTraits: z.object({
    introversion: z.number().min(1).max(5),
    empathy: z.number().min(1).max(5),
    conflictStyle: z.string(),
    learningPreference: z.string(),
    priorities: z.array(z.string()),
  }).optional(),
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
        // Enhanced fields
        name: true,
        emotionalProfile: true,
        coreValues: true,
        selfReflection: true,
      },
    });

    // Check if assessment is formally completed OR has sufficient profile data
    const hasEssentialData = !!(
      user?.relationshipStatus && 
      user?.relationshipGoals?.length && 
      (user?.currentChallenges?.length || user?.preferredCommunicationStyle)
    );
    
    const hasEnhancedData = !!(
      user?.name || 
      user?.emotionalProfile || 
      user?.coreValues?.length || 
      user?.selfReflection
    );

    return {
      isCompleted: !!user?.assessmentCompletedAt || (hasEssentialData && hasEnhancedData),
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

  // Enhanced assessment submission
  submitEnhanced: protectedProcedure
    .input(enhancedAssessmentSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          // Core identity
          name: input.name,
          age: input.age,
          location: input.location,
          gender: input.gender,
          
          // Relationship data
          relationshipStatus: input.relationshipStatus,
          relationshipHistory: input.relationshipHistory,
          relationshipGoals: input.relationshipGoals,
          relationshipReadiness: input.relationshipReadiness,
          
          // Emotional and psychological profile
          emotionalProfile: input.emotionalProfile,
          
          // Values and vision
          coreValues: input.coreValues,
          relationshipVision: input.relationshipVision,
          dealBreakers: input.dealBreakers,
          
          // Communication
          preferredCommunicationStyle: input.preferredCommunicationStyle,
          
          // Lifestyle
          lifestylePriorities: input.lifestylePriorities,
          
          // Self-reflection
          selfReflection: input.selfReflection,
          
          // Legacy compatibility
          currentChallenges: input.currentChallenges,
          personalityTraits: input.personalityTraits,
          
          assessmentCompletedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Enhanced assessment completed successfully!',
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
      console.log('🔍 UpdateStep Debug - User ID:', ctx.userId);
      console.log('🔍 UpdateStep Debug - Step:', input.step);
      console.log('🔍 UpdateStep Debug - Input Data:', JSON.stringify(input.data, null, 2));
      
      // Progressive saving of assessment data
      const updateData: any = {};
      
      // Early return if no data provided
      if (!input.data) {
        console.log('🔍 UpdateStep Debug - No data provided, returning early');
        return { success: true, message: 'No data to save' };
      }
      
      // Enhanced assessment step handling
      if (input.step === 'identity') {
        if (input.data.name) updateData.name = input.data.name;
        if (input.data.age) updateData.age = input.data.age;
        if (input.data.location) updateData.location = input.data.location;
        if (input.data.gender) updateData.gender = input.data.gender;
      }
      
      if (input.step === 'relationship-history') {
        if (input.data.relationshipStatus) updateData.relationshipStatus = input.data.relationshipStatus;
        if (input.data.hasSignificantPast !== undefined || 
            input.data.lastRelationshipDuration || 
            input.data.timeSinceLastRelationship || 
            input.data.keyLessonsLearned || 
            input.data.healingProgress) {
          updateData.relationshipHistory = {
            hasSignificantPast: input.data.hasSignificantPast,
            lastRelationshipDuration: input.data.lastRelationshipDuration,
            timeSinceLastRelationship: input.data.timeSinceLastRelationship,
            keyLessonsLearned: input.data.keyLessonsLearned,
            healingProgress: input.data.healingProgress,
          };
        }
      }
      
      if (input.step === 'emotional-intelligence') {
        if (input.data.relationshipGoals) updateData.relationshipGoals = input.data.relationshipGoals;
        if (input.data.relationshipReadiness) updateData.relationshipReadiness = input.data.relationshipReadiness;
        if (input.data.attachmentStyle || 
            input.data.primaryFears || 
            input.data.topStrengths || 
            input.data.emotionalChallenges) {
          updateData.emotionalProfile = {
            attachmentStyle: input.data.attachmentStyle,
            primaryFears: input.data.primaryFears,
            topStrengths: input.data.topStrengths,
            emotionalChallenges: input.data.emotionalChallenges,
          };
        }
      }
      
      if (input.step === 'values-vision') {
        if (input.data.coreValues) updateData.coreValues = input.data.coreValues;
        if (input.data.relationshipVision) updateData.relationshipVision = input.data.relationshipVision;
        if (input.data.dealBreakers) updateData.dealBreakers = input.data.dealBreakers;
      }
      
      if (input.step === 'lifestyle-compatibility') {
        if (input.data.preferredCommunicationStyle) updateData.preferredCommunicationStyle = input.data.preferredCommunicationStyle;
        if (input.data.workLifeBalance || 
            input.data.socialEnergyLevel || 
            input.data.hobbiesAndInterests) {
          updateData.lifestylePriorities = {
            workLifeBalance: input.data.workLifeBalance,
            socialEnergyLevel: input.data.socialEnergyLevel,
            hobbiesAndInterests: input.data.hobbiesAndInterests,
          };
        }
      }
      
      if (input.step === 'self-reflection') {
        if (input.data.friendsDescription || 
            input.data.proudestMoment || 
            input.data.biggestGrowthArea || 
            input.data.personalStrengths) {
          updateData.selfReflection = {
            friendsDescription: input.data.friendsDescription,
            proudestMoment: input.data.proudestMoment,
            biggestGrowthArea: input.data.biggestGrowthArea,
            personalStrengths: input.data.personalStrengths,
            areasForImprovement: input.data.areasForImprovement,
          };
        }
        // Also handle legacy fields that might still be needed
        if (input.data.currentChallenges) updateData.currentChallenges = input.data.currentChallenges;
        if (input.data.personalityTraits) updateData.personalityTraits = input.data.personalityTraits;
      }
      
      // Legacy step handling for backward compatibility
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
        console.log('🔍 UpdateStep Debug - About to save updateData:', JSON.stringify(updateData, null, 2));
        
        const updatedUser = await ctx.prisma.user.update({
          where: { id: ctx.userId },
          data: updateData,
        });
        
        console.log('🔍 UpdateStep Debug - Successfully updated user. User ID:', updatedUser.id);
      } else {
        console.log('🔍 UpdateStep Debug - No data to update, updateData is empty');
      }

      return { success: true };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    console.log('🔍 GetProfile Debug - User ID:', ctx.userId);
    
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        // Legacy fields
        relationshipStatus: true,
        relationshipGoals: true,
        currentChallenges: true,
        preferredCommunicationStyle: true,
        personalityTraits: true,
        assessmentCompletedAt: true,
        
        // Enhanced fields
        name: true,
        age: true,
        location: true,
        gender: true,
        relationshipHistory: true,
        relationshipReadiness: true,
        emotionalProfile: true,
        coreValues: true,
        relationshipVision: true,
        dealBreakers: true,
        lifestylePriorities: true,
        selfReflection: true,
      },
    });

    console.log('🔍 GetProfile Debug - Retrieved user:', user ? 'User found' : 'User not found');
    if (user) {
      console.log('🔍 GetProfile Debug - User data summary:');
      console.log('  - Name:', user.name);
      console.log('  - Relationship Status:', user.relationshipStatus);
      console.log('  - Relationship Goals:', user.relationshipGoals);
      console.log('  - Emotional Profile:', user.emotionalProfile ? 'Has data' : 'Empty');
      console.log('  - Self Reflection:', user.selfReflection ? 'Has data' : 'Empty');
      console.log('  - Assessment Completed At:', user.assessmentCompletedAt);
      console.log('🔍 GetProfile Debug - Full user data:', JSON.stringify(user, null, 2));
    }

    return user;
  }),

  // Repair assessment completion status for users with data but no completion timestamp
  repairAssessmentCompletion: protectedProcedure.mutation(async ({ ctx }) => {
    console.log('🔧 Repairing assessment completion for user:', ctx.userId);
    
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        assessmentCompletedAt: true,
        name: true,
        relationshipStatus: true,
        emotionalProfile: true,
        coreValues: true,
        lifestylePriorities: true,
        selfReflection: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has substantial data but no completion timestamp
    const hasSubstantialData = !!(
      user.name && 
      user.relationshipStatus && 
      (user.emotionalProfile || user.coreValues?.length || user.lifestylePriorities || user.selfReflection)
    );

    if (hasSubstantialData && !user.assessmentCompletedAt) {
      console.log('🔧 User has substantial data but no completion timestamp, fixing...');
      
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          assessmentCompletedAt: new Date(),
        },
      });

      console.log('🔧 Assessment completion repaired successfully');
      return { repaired: true, completedAt: updatedUser.assessmentCompletedAt };
    }

    console.log('🔧 No repair needed');
    return { repaired: false, reason: 'User either lacks data or already has completion timestamp' };
  }),

  // Get enhanced profile with AI analysis
  getEnhancedProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
    });

    return user;
  }),
});