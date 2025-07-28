'use client';

import { useEffect, useState } from 'react';

interface SafeHydrationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * مكون لحل مشاكل Hydration
 * يضمن أن المحتوى يُعرض فقط بعد تحميل العميل
 */
export default function SafeHydration({ children, fallback = null }: SafeHydrationProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook للتحقق من تحميل العميل
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
