import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MessageCircle, Target, TrendingUp, Heart } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Fill out an assessment that helps your AI coach understand you deeply — your personality, past relationships, current challenges, and goals.",
    icon: User,
  },
  {
    id: 2,
    title: "Meet Your AI Coach",
    description: "Begin an ongoing, dynamic conversation with your personal AI coach — tailored just for you.",
    icon: MessageCircle,
  },
  {
    id: 3,
    title: "Follow a Personalized Plan",
    description: "Get step-by-step guidance through exercises, reflections, and challenges that match your pace and emotional state.",
    icon: Target,
  },
  {
    id: 4,
    title: "Track Your Progress",
    description: "The coach remembers everything — your answers, your growth, your completed exercises — and adjusts the plan as you evolve.",
    icon: TrendingUp,
  },
  {
    id: 5,
    title: "Build Real Confidence & Connection",
    description: "The goal isn't just to find someone — it's to become ready for the right kind of relationship.",
    icon: Heart,
  },
];

export function HowItWorks() {
  return (
    <div id="how-it-works" className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How the Coaching Journey Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A structured approach to personal growth and relationship readiness
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Step {step.id}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden transform -translate-y-1/2 lg:block">
                      <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}