'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedAssessmentData, ProfileInsights } from '@/types/assessment';
import { api } from '@/utils/api';
import { 
  Heart, 
  Brain, 
  Star, 
  Target, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Trophy
} from 'lucide-react';

interface EnhancedSummaryProps {
  data: any;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isLoading: boolean;
  isLastStep?: boolean;
}

export function EnhancedSummary({ 
  data, 
  onNext, 
  onBack, 
  canGoBack, 
  isLoading: isSubmitting,
  isLastStep 
}: EnhancedSummaryProps) {
  const t = useTranslations('assessment.enhancedSummary');
  const [insights, setInsights] = useState<ProfileInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    generateInsights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateInsightsMutation = api.ai.generateProfileInsights.useMutation({
    onSuccess: (profileInsights) => {
      setInsights(profileInsights);
      setAnalysisComplete(true);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error('Failed to generate insights:', error);
      setIsAnalyzing(false);
    },
  });

  const generateInsights = async () => {
    setIsAnalyzing(true);
    try {
      await generateInsightsMutation.mutateAsync({ assessmentData: data });
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setIsAnalyzing(false);
    }
  };

  const getCompletionStats = () => {
    let completed = 0;
    let total = 7;
    
    if (data.name) completed++;
    if (data.relationshipStatus) completed++;
    if (data.relationshipGoals?.length) completed++;
    if (data.emotionalProfile?.attachmentStyle) completed++;
    if (data.coreValues?.length) completed++;
    if (data.lifestylePriorities) completed++;
    if (data.selfReflection?.friendsDescription) completed++;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Completion Progress */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              {t('profileCompletion.title')}
            </h3>
            <Badge className="bg-green-600 text-white">
              {t('profileCompletion.percentage', { percentage: stats.percentage })}
            </Badge>
          </div>
          <Progress value={stats.percentage} className="h-3 mb-2" />
          <p className="text-sm text-green-800 dark:text-green-200">
            {t('profileCompletion.description', { completed: stats.completed, total: stats.total })}
          </p>
        </CardContent>
      </Card>

      {/* Profile Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              {t('profileSnapshot.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('profileSnapshot.name')}</Label>
              <p className="font-semibold">{data.name || t('profileSnapshot.notProvided')}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('profileSnapshot.relationshipStatus')}</Label>
              <p className="font-semibold capitalize">{data.relationshipStatus?.replace('-', ' ') || t('profileSnapshot.notSpecified')}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('profileSnapshot.attachmentStyle')}</Label>
              <p className="font-semibold capitalize">{data.emotionalProfile?.attachmentStyle || t('profileSnapshot.notAssessed')}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('profileSnapshot.relationshipReadiness')}</Label>
              <p className="font-semibold">{data.relationshipReadiness || t('profileSnapshot.notRated')}/7</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              {t('topStrengths.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.emotionalProfile?.topStrengths?.slice(0, 4).map((strength: string, index: number) => (
                <div key={strength} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-yellow-600">{index + 1}</span>
                  </div>
                  <span className="capitalize">{strength.replace('-', ' ')}</span>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400">{t('topStrengths.toBeIdentified')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Values */}
      {data.coreValues && data.coreValues.length > 0 && (
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              {t('coreValues.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.coreValues.map((value: string) => (
                <Badge key={value} variant="secondary" className="text-sm">
                  {value.replace('-', ' ').toLowerCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationship Vision */}
      {data.relationshipVision && (
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {t('relationshipVision.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
              &quot;{data.relationshipVision}&quot;
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            {t('aiInsights.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('aiInsights.analyzing')}
                </p>
              </div>
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                  {t('aiInsights.attachmentAnalysis')}
                </h4>
                <p className="text-sm text-indigo-800 dark:text-indigo-200">
                  {insights.attachmentStyleAnalysis}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {t('aiInsights.communicationStyle')}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {insights.communicationStyleAnalysis}
                </p>
              </div>
              
              {insights.personalizedRecommendations && insights.personalizedRecommendations.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                    {t('aiInsights.recommendations')}
                  </h4>
                  <ul className="space-y-2">
                    {insights.personalizedRecommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t('aiInsights.unableToGenerate')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
        <CardContent>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-pink-900 dark:text-pink-100">
              {t('nextSteps.title')}
            </h3>
            <p className="text-pink-800 dark:text-pink-200">
              {t('nextSteps.description')}
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={!canGoBack || isSubmitting}
              >
                {t('buttons.backToReview')}
              </Button>
              <Button
                onClick={onNext}
                disabled={isSubmitting}
                className="px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('buttons.completing')}
                  </>
                ) : (
                  <>
                    {t('buttons.startProgram')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-sm font-medium text-gray-600 dark:text-gray-300 ${className}`}>
      {children}
    </div>
  );
}