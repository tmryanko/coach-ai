"use client";

import { useEffect } from "react";
import { useTranslations } from 'next-intl';
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.serverError');
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-300">500</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('description')}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4"
          >
            {t('tryAgain')}
          </button>
          <Link
            href="/en"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
