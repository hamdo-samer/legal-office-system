import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`../../messages/${currentLocale}.json`)).default
  };
});

export const locales = ['ar', 'tr', 'en'] as const;
export const defaultLocale = 'ar' as const;
