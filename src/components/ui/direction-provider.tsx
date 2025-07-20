'use client';

import { useDirection } from '@/hooks/useDirection';

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  // This component now only provides direction context to child components
  // The actual dir attribute and RTL class are set server-side in the layout
  const { direction, isRTL } = useDirection();

  return <>{children}</>;
}