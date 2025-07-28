'use client';

import { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface DatabaseStats {
  المستخدمين: number;
  العملاء: number;
  القضايا: number;
  المواعيد: number;
  العقود: number;
  الفواتير: number;
  المستندات: number;
}

interface TestResult {
  success: boolean;
  message: string;
  data?: {
    connection: string;
    stats: DatabaseStats;
  };
  error?: string;
}

export default function TestDatabasePage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            اختبار قاعدة البيانات
          </h1>
          <p className="text-gray-600">
            اختبار الاتصال بقاعدة البيانات والحصول على الإحصائيات
          </p>
        </div>

        {/* Test Button */}
        <div className="text-center mb-8">
          <Button
            onClick={testDatabase}
            loading={isLoading}
            icon={RefreshCw}
            iconPosition="right"
            size="lg"
          >
            اختبار الاتصال
          </Button>
        </div>

        {/* Results */}
        {testResult && (
          <div className="space-y-6">
            {/* Connection Status */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {testResult.success ? (
                    <CheckCircle className="h-8 w-8 text-green-500 ml-3" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500 ml-3" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      حالة الاتصال
                    </h3>
                    <p className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.message}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  testResult.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testResult.success ? 'متصل' : 'غير متصل'}
                </span>
              </div>
            </Card>

            {/* Database Statistics */}
            {testResult.success && testResult.data && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  إحصائيات قاعدة البيانات
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(testResult.data.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {value}
                      </div>
                      <div className="text-sm text-gray-600">{key}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Error Details */}
            {!testResult.success && testResult.error && (
              <Card>
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  تفاصيل الخطأ
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <code className="text-red-800 text-sm">
                    {testResult.error}
                  </code>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            تعليمات الإعداد
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. تشغيل XAMPP:</h4>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>قم بتشغيل XAMPP Control Panel</li>
                <li>ابدأ تشغيل Apache و MySQL</li>
                <li>تأكد من أن الخدمتين تعملان (اللون الأخضر)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. إنشاء قاعدة البيانات:</h4>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>اذهب إلى <code className="bg-gray-100 px-1 rounded">http://localhost/phpmyadmin</code></li>
                <li>قم بتنفيذ ملف <code className="bg-gray-100 px-1 rounded">database/create_database.sql</code></li>
                <li>قم بتنفيذ ملف <code className="bg-gray-100 px-1 rounded">database/sample_data.sql</code></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. التحقق من الإعدادات:</h4>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>تأكد من ملف <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
                <li>تحقق من إعدادات الاتصال</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
