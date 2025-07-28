'use client';

import { useState, useEffect } from 'react';
import { 
  Scale, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import FormattedNumber from '@/components/FormattedNumber';
import SafeHydration from '@/components/SafeHydration';
import Modal from '@/components/Modal';
import AddCaseForm from '@/components/forms/AddCaseForm';
import AddClientForm from '@/components/forms/AddClientForm';
import AddAppointmentForm from '@/components/forms/AddAppointmentForm';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'case' | 'client' | 'appointment' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // جلب بيانات المستخدم الحالي
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Mock data
  const stats = {
    totalCases: 45,
    activeCases: 23,
    totalClients: 67,
    upcomingAppointments: 8,
    monthlyRevenue: 15000
  };

  const recentCases = [
    {
      id: '1',
      caseNumber: 'CASE-2024-0001',
      title: 'قضية تجارية - شركة الأمل',
      client: 'أحمد محمد',
      status: 'OPEN',
      nextSession: '2024-01-15'
    },
    {
      id: '2',
      caseNumber: 'CASE-2024-0002',
      title: 'قضية مدنية - نزاع عقاري',
      client: 'فاطمة علي',
      status: 'OPEN',
      nextSession: '2024-01-18'
    },
    {
      id: '3',
      caseNumber: 'CASE-2024-0003',
      title: 'قضية جنائية - دفاع',
      client: 'محمد حسن',
      status: 'SUSPENDED',
      nextSession: null
    }
  ];

  const upcomingAppointments = [
    {
      id: '1',
      title: 'استشارة قانونية',
      client: 'سارة أحمد',
      time: '10:00 ص',
      date: 'اليوم'
    },
    {
      id: '2',
      title: 'مراجعة عقد',
      client: 'خالد محمود',
      time: '2:00 م',
      date: 'غداً'
    },
    {
      id: '3',
      title: 'جلسة محكمة',
      client: 'نور الدين',
      time: '11:00 ص',
      date: '15 يناير'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'مفتوحة';
      case 'SUSPENDED':
        return 'معلقة';
      case 'CLOSED':
        return 'مغلقة';
      default:
        return status;
    }
  };

  const handleAddCase = async (data: any) => {
    setIsLoading(true);
    try {
      if (!currentUser?.id) {
        alert('يجب تسجيل الدخول أولاً');
        return;
      }

      const caseData = {
        ...data,
        lawyerId: currentUser.id
      };

      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      const result = await response.json();

      if (result.success) {
        alert('تم إضافة القضية بنجاح');
        setActiveModal(null);
        // يمكن إضافة إعادة تحميل البيانات هنا
      } else {
        alert(result.message || 'حدث خطأ في إضافة القضية');
      }
    } catch (error) {
      console.error('Error adding case:', error);
      alert('حدث خطأ في إضافة القضية');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Adding client:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveModal(null);
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAppointment = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Adding appointment:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveModal(null);
    } catch (error) {
      console.error('Error adding appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً، المحامي أحمد</h2>
          <p className="text-gray-600">إليك نظرة عامة على أنشطة مكتبك اليوم</p>
        </div>

        {/* Stats Cards */}
        <SafeHydration>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي القضايا</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">القضايا النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المواعيد القادمة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                <p className="text-2xl font-bold text-gray-900">
                  <FormattedNumber value={stats.monthlyRevenue} prefix="$" />
                </p>
              </div>
            </div>
          </div>
          </div>
        </SafeHydration>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              onClick={() => setActiveModal('case')}
            >
              <Plus className="h-6 w-6 text-blue-600 ml-3" />
              <span className="text-gray-700 font-medium">إضافة قضية جديدة</span>
            </button>

            <button
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              onClick={() => setActiveModal('client')}
            >
              <Plus className="h-6 w-6 text-green-600 ml-3" />
              <span className="text-gray-700 font-medium">إضافة عميل جديد</span>
            </button>

            <button
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              onClick={() => setActiveModal('appointment')}
            >
              <Plus className="h-6 w-6 text-purple-600 ml-3" />
              <span className="text-gray-700 font-medium">جدولة موعد</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cases */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">القضايا الأخيرة</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{case_.title}</h4>
                      <p className="text-sm text-gray-600">العميل: {case_.client}</p>
                      <p className="text-sm text-gray-500">رقم القضية: {case_.caseNumber}</p>
                    </div>
                    <div className="text-left">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {getStatusText(case_.status)}
                      </span>
                      {case_.nextSession && (
                        <p className="text-sm text-gray-500 mt-1">الجلسة القادمة: {case_.nextSession}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">المواعيد القادمة</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg ml-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <p className="text-sm text-gray-600">العميل: {appointment.client}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-sm text-gray-500">{appointment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'case'}
        onClose={() => setActiveModal(null)}
        title="إضافة قضية جديدة"
        size="xl"
      >
        <AddCaseForm
          onSubmit={handleAddCase}
          onCancel={() => setActiveModal(null)}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'client'}
        onClose={() => setActiveModal(null)}
        title="إضافة عميل جديد"
        size="lg"
      >
        <AddClientForm
          onSubmit={handleAddClient}
          onCancel={() => setActiveModal(null)}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'appointment'}
        onClose={() => setActiveModal(null)}
        title="إضافة موعد جديد"
        size="lg"
      >
        <AddAppointmentForm
          onSubmit={handleAddAppointment}
          onCancel={() => setActiveModal(null)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
