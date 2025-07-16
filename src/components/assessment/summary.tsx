import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssessmentData } from '@/app/assessment/page';

interface SummaryStepProps {
  data: Partial<AssessmentData>;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
  isLastStep: boolean;
}

const RELATIONSHIP_STATUS_LABELS: Record<string, string> = {
  'single': 'Single',
  'dating': 'Dating',
  'committed': 'In a committed relationship',
  'engaged': 'Engaged',
  'married': 'Married',
  'separated': 'Separated',
  'divorced': 'Divorced',
  'widowed': 'Widowed',
  'complicated': 'It&apos;s complicated',
};

const COMMUNICATION_STYLE_LABELS: Record<string, string> = {
  'direct-honest': 'Direct & Honest',
  'gentle-supportive': 'Gentle & Supportive',
  'analytical-logical': 'Analytical & Logical',
  'emotional-expressive': 'Emotional & Expressive',
  'collaborative-democratic': 'Collaborative & Democratic',
  'patient-thoughtful': 'Patient & Thoughtful',
};

const GOAL_LABELS: Record<string, string> = {
  'improve-communication': 'Improve Communication',
  'build-trust': 'Build Trust',
  'resolve-conflicts': 'Resolve Conflicts Better',
  'increase-intimacy': 'Increase Intimacy',
  'work-life-balance': 'Better Work-Life Balance',
  'future-planning': 'Plan Our Future Together',
  'family-planning': 'Navigate Family Planning',
  'financial-harmony': 'Financial Harmony',
  'social-life': 'Improve Social Life Together',
  'personal-growth': 'Support Each Other&apos;s Growth',
  'physical-health': 'Health & Fitness Goals',
  'spiritual-connection': 'Spiritual Connection',
  'dating-skills': 'Improve Dating Skills',
  'self-confidence': 'Build Self-Confidence',
  'emotional-intelligence': 'Emotional Intelligence',
};

const CHALLENGE_LABELS: Record<string, string> = {
  'poor-communication': 'Poor Communication',
  'frequent-arguments': 'Frequent Arguments',
  'trust-issues': 'Trust Issues',
  'lack-intimacy': 'Lack of Intimacy',
  'different-values': 'Different Values',
  'time-management': 'Time Management',
  'financial-stress': 'Financial Stress',
  'family-pressure': 'Family Pressure',
  'jealousy': 'Jealousy Issues',
  'future-uncertainty': 'Future Uncertainty',
  'social-differences': 'Social Differences',
  'personal-growth': 'Personal Growth Gaps',
  'past-baggage': 'Past Relationship Baggage',
  'long-distance': 'Long Distance',
  'work-stress': 'Work-Related Stress',
  'commitment-fears': 'Commitment Fears',
};

export function SummaryStep({ data, onNext, onBack, canGoBack, isLoading, isLastStep }: SummaryStepProps) {
  const getPersonalityDescription = () => {
    const traits = data.personalityTraits;
    if (!traits) return 'Not specified';
    
    const socialStyle = traits.introversion <= 2 ? 'Extroverted' : traits.introversion >= 4 ? 'Introverted' : 'Balanced';
    const empathyLevel = traits.empathy <= 2 ? 'Logic-focused' : traits.empathy >= 4 ? 'Highly empathetic' : 'Balanced empathy';
    
    return `${socialStyle}, ${empathyLevel}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Review Your Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please review your responses below. This information will be used to personalize your coaching experience.
        </p>
      </div>

      <div className="space-y-4">
        {/* Relationship Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Relationship Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">
              {data.relationshipStatus ? RELATIONSHIP_STATUS_LABELS[data.relationshipStatus] : 'Not specified'}
            </Badge>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Goals ({data.relationshipGoals?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.relationshipGoals?.map(goal => (
                <Badge key={goal} variant="secondary">
                  {GOAL_LABELS[goal] || goal}
                </Badge>
              )) || <span className="text-gray-500">No goals specified</span>}
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Challenges ({data.currentChallenges?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.currentChallenges?.map(challenge => (
                <Badge key={challenge} variant="destructive">
                  {CHALLENGE_LABELS[challenge] || challenge}
                </Badge>
              )) || <span className="text-gray-500">No challenges specified</span>}
            </div>
          </CardContent>
        </Card>

        {/* Communication Style */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Communication Style</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">
              {data.preferredCommunicationStyle ? COMMUNICATION_STYLE_LABELS[data.preferredCommunicationStyle] : 'Not specified'}
            </Badge>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Personality & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Personality:</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                {getPersonalityDescription()}
              </span>
            </div>
            {data.personalityTraits?.conflictStyle && (
              <div>
                <span className="text-sm font-medium">Conflict Style:</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {data.personalityTraits.conflictStyle}
                </span>
              </div>
            )}
            {data.personalityTraits?.learningPreference && (
              <div>
                <span className="text-sm font-medium">Learning Style:</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {data.personalityTraits.learningPreference.replace('-', ' ')}
                </span>
              </div>
            )}
            {data.personalityTraits?.priorities && data.personalityTraits.priorities.length > 0 && (
              <div>
                <span className="text-sm font-medium">Life Priorities:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {data.personalityTraits.priorities.map(priority => (
                    <Badge key={priority} variant="outline" className="text-xs">
                      {priority.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>• Your AI coach will use this profile to personalize your experience</li>
          <li>• You&apos;ll receive customized coaching programs based on your goals</li>
          <li>• Conversation style will match your communication preferences</li>
          <li>• You can update your profile anytime in settings</li>
        </ul>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack || isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Completing Assessment...' : 'Complete Assessment & Start Coaching!'}
        </Button>
      </div>
    </div>
  );
}