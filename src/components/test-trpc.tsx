'use client';

import { api } from '@/utils/api';

export function TestTRPC() {
  const { data, isLoading, error } = api.example.getAll.useQuery(undefined, {
    enabled: typeof window !== 'undefined',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">tRPC Test</h2>
      <p>{data?.message}</p>
    </div>
  );
}