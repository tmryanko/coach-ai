'use client';

import { useDirection } from '@/hooks/useDirection';
import { useEffect } from 'react';

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const { direction, isRTL } = useDirection();

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', direction === 'rtl' ? 'he' : 'en');
    
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [direction, isRTL]);

  return <>{children}</>;
}