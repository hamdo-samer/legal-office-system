'use client';

import { useState } from 'react';

export default function TestUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ تم إنشاء المستخدمين التجريبيين بنجاح');
        fetchUsers(); // إعادة تحميل قائمة المستخدمين
      } else {
        alert(`❌ فشل في إنشاء المستخدمين: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ خطأ: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ تسجيل دخول ناجح: ${result.user.name}`);
      } else {
        alert(`❌ فشل تسجيل الدخول: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ خطأ: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">اختبار المستخدمين</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'جاري التحميل...' : 'عرض المستخدمين'}
            </button>

            <button
              onClick={createTestUsers}
              disabled={isLoading}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              إنشاء مستخدمين تجريبيين
            </button>
          </div>

          {users.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">المستخدمين الموجودين:</h2>
              
              {users.map((user, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><strong>الاسم:</strong> {user.name}</div>
                    <div><strong>الإيميل:</strong> {user.email}</div>
                    <div><strong>الهاتف:</strong> {user.phone}</div>
                    <div><strong>رقم الترخيص:</strong> {user.licenseNo}</div>
                    <div><strong>التخصص:</strong> {user.specialties}</div>
                    <div><strong>البلد:</strong> {user.country}</div>
                    <div><strong>منطقة العمل:</strong> {user.workArea}</div>
                    <div><strong>نشط:</strong> {user.isActive ? 'نعم' : 'لا'}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => testLogin(user.email, 'password')}
                      className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                    >
                      اختبار تسجيل الدخول (password)
                    </button>
                    <button
                      onClick={() => testLogin(user.email, '123456')}
                      className="bg-orange-600 text-white py-1 px-3 rounded text-sm hover:bg-orange-700"
                    >
                      اختبار تسجيل الدخول (123456)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">بيانات الاختبار:</h3>
            <div className="text-sm space-y-1">
              <div><strong>الحساب التجريبي:</strong></div>
              <div>الإيميل: admin@legaloffice.com</div>
              <div>كلمة المرور: password</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-500"
            >
              ← الذهاب إلى صفحة تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
