'use client';

import { useEffect, useState } from 'react';

interface FormattedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function FormattedNumber({
  value,
  suffix = '',
  prefix = '',
  className = ''
}: FormattedNumberProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // عرض الرقم بدون تنسيق على الخادم وبتنسيق على العميل
  const displayValue = isClient ? value.toLocaleString() : value.toString();

  return (
    <span className={className} suppressHydrationWarning>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
