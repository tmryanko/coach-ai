import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AuthCodeError() {
  const t = useTranslations('errors.authError');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('description')}
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('tryAgain')}
        </Link>
      </div>
    </div>
  );
}