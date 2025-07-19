import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errors.notFound');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('description')}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/en"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('goHome')}
          </Link>
          <div>
            <Link
              href="/en/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {t('goDashboard')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
