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