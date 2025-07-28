'use client';

import { useState } from 'react';

export default function UpdateDBPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const updateDatabase = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/update-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ خطأ: ${data.error}\nالتفاصيل: ${data.details || 'غير متوفرة'}`);
      }
    } catch (error) {
      setResult(`❌ خطأ في الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">تحديث قاعدة البيانات</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              هذه الصفحة تقوم بتحديث جدول المحامين لإضافة الحقول الجديدة:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>البلد (country)</li>
              <li>منطقة العمل (workArea)</li>
              <li>تاريخ الإنشاء (createdAt)</li>
              <li>تاريخ التحديث (updatedAt)</li>
              <li>تحديث نوع حقل التخصصات</li>
              <li>إضافة فهارس للبحث السريع</li>
            </ul>
          </div>

          <button
            onClick={updateDatabase}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'جاري التحديث...' : 'تحديث قاعدة البيانات'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">النتيجة:</h3>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}

          <div className="mt-8 text-center">
            <a 
              href="/auth/register" 
              className="text-blue-600 hover:text-blue-500"
            >
              ← الذهاب إلى صفحة التسجيل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
