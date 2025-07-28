import { EnhancedAssessmentData, ProfileInsights } from '@/types/assessment';
import { generateCoachResponse } from '@/lib/openai';

interface AnalysisContext {
  userProfile: EnhancedAssessmentData;
}

export async function generateProfileInsights(assessmentData: EnhancedAssessmentData): Promise<ProfileInsights> {
  try {
    // Attachment Style Analysis
    const attachmentAnalysis = await generateAttachmentAnalysis(assessmentData);
    
    // Relationship Readiness Score
    const readinessScore = calculateRelationshipReadiness(assessmentData);
    
    // Communication Style Analysis
    const communicationAnalysis = await generateCommunicationAnalysis(assessmentData);
    
    // Recommended Coaching Approach
    const coachingApproach = await generateCoachingApproach(assessmentData);
    
    // Key Strengths
    const keyStrengths = extractKeyStrengths(assessmentData);
    
    // Growth Areas
    const growthAreas = extractGrowthAreas(assessmentData);
    
    // Personalized Recommendations
    const recommendations = await generatePersonalizedRecommendations(assessmentData);

    return {
      attachmentStyleAnalysis: attachmentAnalysis,
      relationshipReadinessScore: readinessScore,
      communicationStyleAnalysis: communicationAnalysis,
      recommendedCoachingApproach: coachingApproach,
      keyStrengths,
      growthAreas,
      personalizedRecommendations: recommendations,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating profile insights:', error);
    throw new Error('Failed to generate profile insights');
  }
}

async function generateAttachmentAnalysis(data: EnhancedAssessmentData): Promise<string> {
  const prompt = `Analyze this person's attachment style and relationship patterns based on their assessment:

Attachment Style: ${data.emotionalProfile?.attachmentStyle || 'Not specified'}
Primary Fears: ${data.emotionalProfile?.primaryFears?.join(', ') || 'None specified'}
Relationship History: ${data.relationshipHistory ? JSON.stringify(data.relationshipHistory) : 'Not provided'}
Emotional Challenges: ${data.emotionalProfile?.emotionalChallenges?.join(', ') || 'None specified'}

Provide a compassionate, insightful analysis (150-200 words) that helps them understand:
1. How their attachment style shows up in relationships
2. Common patterns they might experience
3. Positive aspects of their attachment style
4. Gentle guidance for growth

Be encouraging and non-judgmental.`;

  return await generateCoachResponse(prompt, []);
}

function calculateRelationshipReadiness(data: EnhancedAssessmentData): number {
  let score = data.relationshipReadiness || 5;
  
  // Adjust based on emotional factors
  const fears = data.emotionalProfile?.primaryFears || [];
  if (fears.includes('intimacy') || fears.includes('vulnerability')) score -= 0.5;
  if (fears.includes('rejection') || fears.includes('abandonment')) score -= 0.3;
  
  // Adjust based on relationship history
  if (data.relationshipHistory?.timeSinceLastRelationship === 'very-recent') score -= 0.5;
  if (data.relationshipHistory?.timeSinceLastRelationship === 'long-ago') score += 0.3;
  
  // Adjust based on self-awareness and growth mindset
  const strengths = data.emotionalProfile?.topStrengths || [];
  if (strengths.includes('emotional-awareness')) score += 0.3;
  if (strengths.includes('resilience')) score += 0.2;
  
  // Ensure score stays within bounds
  return Math.max(1, Math.min(10, Math.round(score * 2) / 2));
}

async function generateCommunicationAnalysis(data: EnhancedAssessmentData): Promise<string> {
  const prompt = `Analyze this person's communication patterns based on their assessment:

Communication Style: ${data.preferredCommunicationStyle || 'Not specified'}
Conflict Resolution: ${data.conflictResolutionStyle || 'Not specified'}
Emotional Profile: ${data.emotionalProfile ? JSON.stringify(data.emotionalProfile) : 'Not provided'}

Provide a supportive analysis (150-200 words) covering:
1. Their communication strengths
2. Potential communication challenges
3. How their style affects relationships
4. Tips for effective communication

Be practical and encouraging.`;

  return await generateCoachResponse(prompt, []);
}

async function generateCoachingApproach(data: EnhancedAssessmentData): Promise<string> {
  const prompt = `Based on this comprehensive assessment, recommend the most effective coaching approach:

Attachment Style: ${data.emotionalProfile?.attachmentStyle || 'Not specified'}
Learning Preferences: ${data.personalityTraits?.learningPreference || 'Not specified'}
Communication Style: ${data.preferredCommunicationStyle || 'Not specified'}
Relationship Goals: ${data.relationshipGoals?.join(', ') || 'Not specified'}
Growth Areas: ${data.emotionalProfile?.emotionalChallenges?.join(', ') || 'Not specified'}

Recommend specific coaching strategies (100-150 words):
1. Best coaching style for this person
2. Types of exercises that would work well
3. Communication approach to use
4. Pacing and structure preferences

Be specific and actionable.`;

  return await generateCoachResponse(prompt, []);
}

function extractKeyStrengths(data: EnhancedAssessmentData): string[] {
  const strengths: string[] = [];
  
  // From emotional profile
  const emotionalStrengths = data.emotionalProfile?.topStrengths || [];
  strengths.push(...emotionalStrengths);
  
  // From self-reflection
  const personalStrengths = data.selfReflection?.personalStrengths || [];
  strengths.push(...personalStrengths);
  
  // From values (translate core values to strengths)
  const values = data.coreValues || [];
  if (values.includes('honesty')) strengths.push('authenticity');
  if (values.includes('loyalty')) strengths.push('commitment');
  if (values.includes('empathy')) strengths.push('emotional-intelligence');
  
  // Remove duplicates and return top 5
  return [...new Set(strengths)].slice(0, 5);
}

function extractGrowthAreas(data: EnhancedAssessmentData): string[] {
  const growthAreas: string[] = [];
  
  // From emotional challenges
  const challenges = data.emotionalProfile?.emotionalChallenges || [];
  growthAreas.push(...challenges);
  
  // From primary fears (translate fears to growth areas)
  const fears = data.emotionalProfile?.primaryFears || [];
  if (fears.includes('rejection')) growthAreas.push('self-confidence');
  if (fears.includes('intimacy')) growthAreas.push('vulnerability');
  if (fears.includes('abandonment')) growthAreas.push('attachment-security');
  
  // From relationship readiness
  if ((data.relationshipReadiness || 5) < 4) {
    growthAreas.push('relationship-readiness');
  }
  
  // Remove duplicates and return top 4
  return [...new Set(growthAreas)].slice(0, 4);
}

async function generatePersonalizedRecommendations(data: EnhancedAssessmentData): Promise<string[]> {
  const prompt = `Based on this complete relationship assessment, provide 4-6 specific, actionable recommendations:

Profile Summary:
- Attachment Style: ${data.emotionalProfile?.attachmentStyle || 'Not specified'}
- Relationship Status: ${data.relationshipStatus || 'Not specified'}
- Primary Goals: ${data.relationshipGoals?.join(', ') || 'Not specified'}
- Main Challenges: ${data.emotionalProfile?.emotionalChallenges?.join(', ') || 'Not specified'}
- Core Values: ${data.coreValues?.join(', ') || 'Not specified'}
- Relationship Vision: ${data.relationshipVision || 'Not provided'}

Provide specific recommendations in this format:
1. [Action item for immediate improvement]
2. [Strategy for building on strengths]
3. [Approach for addressing main challenge]
4. [Relationship skill to develop]
5. [Personal growth activity]
6. [Dating/relationship strategy]

Each recommendation should be 1-2 sentences and actionable.`;

  const response = await generateCoachResponse(prompt, [], {});
  
  // Parse the response into individual recommendations
  const recommendations = response
    .split(/\d+\./)
    .slice(1)
    .map(rec => rec.trim())
    .filter(rec => rec.length > 0)
    .slice(0, 6);
    
  return recommendations;
}

export function formatInsightsForDisplay(insights: ProfileInsights): {
  summary: string;
  highlights: string[];
  nextSteps: string[];
} {
  const summary = `Based on your assessment, you show ${insights.attachmentStyleAnalysis?.slice(0, 100)}... Your relationship readiness score is ${insights.relationshipReadinessScore}/10.`;
  
  const highlights = [
    `Attachment Style: ${insights.attachmentStyleAnalysis?.slice(0, 80)}...`,
    `Communication: ${insights.communicationStyleAnalysis?.slice(0, 80)}...`,
    `Key Strengths: ${insights.keyStrengths?.slice(0, 3).join(', ')}`,
  ];
  
  const nextSteps = insights.personalizedRecommendations?.slice(0, 3) || [];
  
  return { summary, highlights, nextSteps };
}