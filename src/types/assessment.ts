// Legacy interface for backward compatibility
export interface AssessmentData {
  relationshipStatus: string;
  relationshipGoals: string[];
  currentChallenges: string[];
  preferredCommunicationStyle: string;
  personalityTraits: {
    introversion: number;
    empathy: number;
    conflictStyle: string;
    learningPreference: string;
    priorities: string[];
  };
  additionalNotes?: string;
}

// Enhanced Assessment Data Structure
export interface EnhancedAssessmentData {
  // Core Identity
  name?: string;
  age?: number;
  location?: string;
  gender?: string;
  
  // Relationship Status & History
  relationshipStatus: string;
  relationshipHistory?: {
    hasSignificantPast: boolean;
    lastRelationshipDuration?: string;
    timeSinceLastRelationship?: string;
    keyLessonsLearned?: string;
    healingProgress?: string;
  };
  
  // Goals & Intentions
  relationshipGoals: string[];
  relationshipReadiness?: number; // 1-10 scale
  
  // Emotional & Psychological Profile
  emotionalProfile?: {
    attachmentStyle?: string;
    primaryFears?: string[];
    topStrengths?: string[];
    emotionalChallenges?: string[];
    copingStrategies?: string[];
  };
  
  // Values & Life Vision
  coreValues?: string[];
  relationshipVision?: string;
  
  // Communication & Compatibility
  preferredCommunicationStyle: string;
  dealBreakers?: string[];
  
  // Lifestyle & Interests
  lifestylePriorities?: {
    workLifeBalance?: string;
    socialEnergyLevel?: number;
    hobbiesAndInterests?: string[];
    livingPreferences?: string[];
  };
  
  // Self-Reflection & Growth
  selfReflection?: {
    friendsDescription?: string;
    proudestMoment?: string;
    biggestGrowthArea?: string;
    personalStrengths?: string[];
    areasForImprovement?: string[];
  };
  
  // Legacy compatibility
  currentChallenges: string[];
  personalityTraits?: {
    introversion: number;
    empathy: number;
    conflictStyle: string;
    learningPreference: string;
    priorities: string[];
  };
  
  // Progress tracking
  completedSteps?: string[];
  currentStep?: string;
  additionalNotes?: string;
}

// Step-specific interfaces
export interface IdentityStepData {
  name?: string;
  age?: number;
  location?: string;
  gender?: string;
}

export interface RelationshipHistoryData {
  relationshipStatus: string;
  hasSignificantPast: boolean;
  lastRelationshipDuration?: string;
  timeSinceLastRelationship?: string;
  keyLessonsLearned?: string;
  healingProgress?: string;
}

export interface EmotionalProfileData {
  attachmentStyle?: string;
  primaryFears?: string[];
  topStrengths?: string[];
  emotionalChallenges?: string[];
  relationshipReadiness?: number;
}

export interface ValuesVisionData {
  coreValues?: string[];
  relationshipVision?: string;
  dealBreakers?: string[];
}

export interface LifestyleCompatibilityData {
  workLifeBalance?: string;
  socialEnergyLevel?: number;
  hobbiesAndInterests?: string[];
  communicationStyle?: string;
  conflictStyle?: string;
}

export interface SelfReflectionData {
  friendsDescription?: string;
  proudestMoment?: string;
  biggestGrowthArea?: string;
  personalStrengths?: string[];
  areasForImprovement?: string[];
  futureRelationshipGoals?: string[];
}

// Assessment step configuration
export interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isRequired: boolean;
  estimatedTime?: number; // in minutes
}

// Assessment progress tracking
export interface AssessmentProgress {
  currentStep: string;
  completedSteps: string[];
  startedAt: Date;
  lastUpdated: Date;
  completionPercentage: number;
}

// AI-generated insights
export interface ProfileInsights {
  attachmentStyleAnalysis?: string;
  relationshipReadinessScore?: number;
  communicationStyleAnalysis?: string;
  recommendedCoachingApproach?: string;
  keyStrengths?: string[];
  growthAreas?: string[];
  personalizedRecommendations?: string[];
  generatedAt: Date;
}