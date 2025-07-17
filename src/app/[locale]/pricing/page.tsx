'use client';

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with AI coaching',
    icon: Star,
    features: [
      'Basic coaching chat',
      '5 sessions per month',
      'Basic relationship assessment',
      'General coaching programs',
      'Community support'
    ],
    limitations: [
      'Limited session history',
      'Basic progress tracking'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
    popular: false
  },
  {
    name: 'Monthly',
    price: '$19.99',
    period: 'per month',
    description: 'Enhanced coaching with more personalized guidance',
    icon: Zap,
    features: [
      'Unlimited coaching sessions',
      'Advanced personality assessment',
      'Progress tracking & analytics',
      'Access to specialized programs',
      'Priority support',
      'Session history & notes',
      'Personalized coaching style'
    ],
    limitations: [],
    buttonText: 'Start Monthly Plan',
    buttonVariant: 'default' as const,
    popular: true
  },
  {
    name: 'Yearly',
    price: '$199.99',
    period: 'per year',
    description: 'Full access to all coaching features and programs',
    icon: Crown,
    features: [
      'Everything in Monthly plan',
      'Access to ALL coaching programs',
      'Advanced relationship insights',
      'Custom coaching plans',
      'Weekly progress reports',
      'Priority 24/7 support',
      'Early access to new features',
      'Export session transcripts',
      '2 months free (20% savings)'
    ],
    limitations: [],
    buttonText: 'Start Yearly Plan',
    buttonVariant: 'default' as const,
    popular: false
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Choose Your Coaching Plan</h1>
              <p className="text-muted-foreground">Select the perfect plan for your relationship journey</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">← Back to Home</Link>
              </Button>
              {!user && (
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your relationship coaching journey with our AI-powered platform. 
              Choose a plan that fits your needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={tier.name}
                className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      tier.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {tier.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground ml-1">/{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {tier.limitations.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                      <div className="space-y-1">
                        {tier.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={tier.buttonVariant}
                    size="lg"
                    asChild
                  >
                    <a href={user ? "/dashboard" : "/login"}>
                      {tier.buttonText}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </div>

          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Not sure which plan is right for you?</h3>
            <p className="text-muted-foreground mb-6">
              Start with our free plan and upgrade anytime. All plans include access to our AI coach 
              and basic relationship guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <a href={user ? "/chat" : "/login"}>Try Free Coaching</a>
              </Button>
              <Button asChild>
                <a href={user ? "/assessment" : "/login"}>Take Assessment</a>
              </Button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use enterprise-grade security to protect your personal information and conversations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What if I&apos;m not satisfied?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee on all paid plans. No questions asked.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How does AI coaching work?</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI coach is trained on relationship psychology and adapts to your communication style and needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}