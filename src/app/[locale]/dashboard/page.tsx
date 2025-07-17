'use client';

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = api.assessment.getProfile.useQuery();
  const { data: userProfile } = api.user.getProfile.useQuery();
  const { data: progress } = api.user.getProgress.useQuery();

  // Check if user has completed assessment
  useEffect(() => {
    if (!profileLoading && !profile && user) {
      router.push('/assessment');
    }
  }, [profile, profileLoading, user, router]);

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading your dashboard...</div>
        </div>
      </AppLayout>
    );
  }

  const getWelcomeMessage = () => {
    if (profile?.relationshipStatus === 'single') {
      return "Ready to build meaningful connections?";
    } else if (profile?.relationshipStatus === 'dating') {
      return "Let's strengthen your dating journey!";
    } else if (['committed', 'engaged', 'married'].includes(profile?.relationshipStatus || '')) {
      return "Time to deepen your relationship!";
    }
    return "Welcome to your personal coaching journey!";
  };

  const getPrimaryGoal = () => {
    if (profile?.relationshipGoals && profile.relationshipGoals.length > 0) {
      const goalLabels: Record<string, string> = {
        'improve-communication': 'improve communication',
        'build-trust': 'build trust',
        'resolve-conflicts': 'resolve conflicts',
        'increase-intimacy': 'increase intimacy',
        'work-life-balance': 'achieve work-life balance',
      };
      return goalLabels[profile.relationshipGoals[0]] || profile.relationshipGoals[0];
    }
    return 'personal growth';
  };

  return (
    <AppLayout 
      title={`Welcome back, ${userProfile?.name || user?.user_metadata?.name || 'there'}!`}
      description={getWelcomeMessage()}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Programs Started:</span>
                  <span className="font-medium">{progress?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Primary Goal:</span>
                  <span className="font-medium text-sm capitalize">{getPrimaryGoal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Challenges:</span>
                  <span className="font-medium">{profile?.currentChallenges?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Communication:</span>
                  <p className="text-sm font-medium capitalize">
                    {profile?.preferredCommunicationStyle?.replace('-', ' ') || 'Not set'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Learning:</span>
                  <p className="text-sm font-medium capitalize">
                    {(profile?.personalityTraits as any)?.learningPreference?.replace('-', ' ') || 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full" size="sm">
                  <Link href="/chat">Start Coaching Session</Link>
                </Button>
                <Button asChild className="w-full" variant="outline" size="sm">
                  <Link href="/assessment">Update Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Programs</CardTitle>
              <CardDescription>
                Based on your goals to {getPrimaryGoal()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile?.relationshipGoals?.includes('improve-communication') && (
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Communication Mastery</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Learn effective communication techniques</p>
                    <Button size="sm" className="mt-2">Start Program</Button>
                  </div>
                )}
                {profile?.relationshipGoals?.includes('build-trust') && (
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Trust Building</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Strengthen trust and emotional bonds</p>
                    <Button size="sm" className="mt-2">Start Program</Button>
                  </div>
                )}
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Relationship Foundations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Essential skills for healthy relationships</p>
                  <Button size="sm" className="mt-2">Start Program</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your AI Coach</CardTitle>
              <CardDescription>
                Personalized guidance based on your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Coaching Style Matched for You:
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {profile?.preferredCommunicationStyle === 'direct-honest' && 
                      "Your coach will be straightforward and honest, focusing on practical solutions."}
                    {profile?.preferredCommunicationStyle === 'gentle-supportive' && 
                      "Your coach will be warm and encouraging, providing supportive guidance."}
                    {profile?.preferredCommunicationStyle === 'analytical-logical' && 
                      "Your coach will use fact-based approaches with clear reasoning."}
                    {profile?.preferredCommunicationStyle === 'emotional-expressive' && 
                      "Your coach will help you explore and express emotions openly."}
                    {!profile?.preferredCommunicationStyle && 
                      "Complete your assessment to get personalized coaching style."}
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/chat">Start Coaching Chat</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}