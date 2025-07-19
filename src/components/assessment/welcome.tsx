import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface AssessmentWelcomeProps {
  onNext: () => void;
}

export function AssessmentWelcome({ onNext }: AssessmentWelcomeProps) {
  const t = useTranslations('assessment.welcome');

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {t('expectationsTitle')}
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
          <li>• {t('expectations.steps')}</li>
          <li>• {t('expectations.time')}</li>
          <li>• {t('expectations.personalized')}</li>
          <li>• {t('expectations.private')}</li>
        </ul>
      </div>

      <div className="pt-4">
        <Button onClick={() => onNext()} size="lg" className="px-8">
          {t('getStarted')}
        </Button>
      </div>
    </div>
  );
}