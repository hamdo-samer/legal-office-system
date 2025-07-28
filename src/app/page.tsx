import { Scale, Users, Calendar, FileText, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">نظام إدارة المكتب القانوني</h1>
            </div>
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <a href="#about" className="text-gray-700 hover:text-blue-600">من نحن</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600">خدماتنا</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">اتصل بنا</a>
              <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                تسجيل الدخول
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            نظام إدارة المكاتب القانونية
            <span className="block text-blue-600">الحل الشامل</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            منصة شاملة لإدارة القضايا والعملاء والمواعيد والمستندات القانونية بكفاءة عالية
          </p>
          <div className="flex justify-center">
            <Link href="/auth/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">خدماتنا</h3>
            <p className="text-xl text-gray-600">حلول شاملة لجميع احتياجات مكتبك القانوني</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">إدارة القضايا</h4>
              <p className="text-gray-600">تتبع شامل لجميع القضايا مع إدارة الجلسات والمستندات والمراحل القانونية</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">إدارة العملاء</h4>
              <p className="text-gray-600">قاعدة بيانات شاملة للعملاء مع تتبع التفاعلات والمراسلات</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl">
              <Calendar className="h-12 w-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">جدولة المواعيد</h4>
              <p className="text-gray-600">نظام متقدم لجدولة المواعيد والاجتماعات مع التذكيرات التلقائية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Scale className="h-8 w-8 text-blue-400 ml-3" />
                <h3 className="text-xl font-bold">نظام إدارة المكتب القانوني</h3>
              </div>
              <p className="text-gray-400">
                نظام شامل لإدارة المكاتب القانونية مع أحدث التقنيات والأدوات المتطورة
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/login" className="text-gray-400 hover:text-white">تسجيل الدخول</Link></li>
                <li><Link href="/auth/register" className="text-gray-400 hover:text-white">إنشاء حساب</Link></li>
                <li><a href="#about" className="text-gray-400 hover:text-white">من نحن</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white">خدماتنا</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-400 ml-2" />
                  <span className="text-gray-400">+966 50 123 4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-400 ml-2" />
                  <span className="text-gray-400">info@legaloffice.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-400 ml-2" />
                  <span className="text-gray-400">الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024  ل حمدو مكتب المحاماة الذكي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}