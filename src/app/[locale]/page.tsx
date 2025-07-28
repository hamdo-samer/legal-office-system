'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                نظام إدارة المكتب القانوني
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            مرحباً بك في نظام إدارة المكتب القانوني
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            نظام شامل لإدارة القضايا والعملاء والمواعيد
          </p>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {t('auth.login')}
            </Link>
            <Link
              href="/auth/register"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {t('auth.register')}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('navigation.cases')}
              </h3>
              <p className="text-gray-600">
                إدارة شاملة للقضايا والملفات القانونية
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('navigation.clients')}
              </h3>
              <p className="text-gray-600">
                إدارة بيانات العملاء والتواصل معهم
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('navigation.appointments')}
              </h3>
              <p className="text-gray-600">
                جدولة المواعيد والاجتماعات
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
