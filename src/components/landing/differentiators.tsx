import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain, Shield, Users, Target } from "lucide-react";

const differentiators = [
  {
    title: "Not Generic — Tailored to You",
    description: "A real training plan designed specifically for your personality, goals, and relationship history.",
    icon: Target,
  },
  {
    title: "Remembers Your Journey",
    description: "The AI coach remembers your history and adapts as you grow, building on every conversation.",
    icon: Brain,
  },
  {
    title: "Built by Experts",
    description: "Developed with experts in emotional intelligence, dating psychology, and coaching methodologies.",
    icon: Users,
  },
  {
    title: "Long-term Relationship Readiness",
    description: "Designed for lasting change, not just quick dating tips — become ready for the right relationship.",
    icon: Zap,
  },
  {
    title: "Private & Judgment-Free",
    description: "Safe, secure, and completely confidential. No judgment, just personalized guidance.",
    icon: Shield,
  },
];

export function Differentiators() {
  return (
    <div className="py-20 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why This Isn&apos;t Just Another Chatbot
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A fundamentally different approach to relationship coaching
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl mt-4">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}