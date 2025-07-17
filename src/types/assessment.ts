export interface AssessmentData {
  relationshipStatus: string;
  relationshipGoals: string[];
  currentChallenges: string[];
  preferredCommunicationStyle: string;
  personalityTraits: {
    introversion: number;
    openness: number;
    conscientiousness: number;
    agreeableness: number;
    neuroticism: number;
  };
  additionalNotes?: string;
}