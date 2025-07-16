import { Button } from '@/components/ui/button';

interface AssessmentWelcomeProps {
  onNext: () => void;
}

export function AssessmentWelcome({ onNext }: AssessmentWelcomeProps) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to Your Personal Coaching Journey!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Before we begin, let&apos;s get to know you better. This assessment will help us create a personalized coaching experience tailored to your unique relationship goals and communication style.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          What to expect:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
          <li>• 6 quick steps to build your personal profile</li>
          <li>• Takes about 5-7 minutes to complete</li>
          <li>• Your responses help create personalized coaching programs</li>
          <li>• All information is private and secure</li>
        </ul>
      </div>

      <div className="pt-4">
        <Button onClick={() => onNext()} size="lg" className="px-8">
          Let&apos;s Get Started
        </Button>
      </div>
    </div>
  );
}