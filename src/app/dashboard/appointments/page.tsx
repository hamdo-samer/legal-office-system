'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AddAppointmentForm from '@/components/forms/AddAppointmentForm';

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const appointments = [
    {
      id: '1',
      title: 'استشارة قانونية',
      client: 'أحمد محمد علي',
      date: '2024-01-25',
      time: '10:00',
      duration: 60,
      status: 'SCHEDULED',
      location: 'المكتب الرئيسي',
      notes: 'استشارة حول قضية تجارية',
      type: 'consultation'
    },
    {
      id: '2',
      title: 'مراجعة عقد',
      client: 'فاطمة علي حسن',
      date: '2024-01-25',
      time: '14:00',
      duration: 45,
      status: 'SCHEDULED',
      location: 'المكتب الرئيسي',
      notes: 'مراجعة عقد شراء عقار',
      type: 'review'
    },
    {
      id: '3',
      title: 'جلسة محكمة',
      client: 'محمد حسن محمود',
      date: '2024-01-26',
      time: '11:00',
      duration: 120,
      status: 'SCHEDULED',
      location: 'محكمة القاهرة المدنية',
      notes: 'جلسة نظر قضية مدنية',
      type: 'court'
    },
    {
      id: '4',
      title: 'لقاء مع العميل',
      client: 'سارة أحمد محمد',
      date: '2024-01-24',
      time: '16:00',
      duration: 30,
      status: 'COMPLETED',
      location: 'المكتب الرئيسي',
      notes: 'مناقشة تطورات القضية',
      type: 'meeting'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RESCHEDULED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'مجدول';
      case 'COMPLETED':
        return 'مكتمل';
      case 'CANCELLED':
        return 'ملغي';
      case 'RESCHEDULED':
        return 'معاد جدولته';
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-purple-100 text-purple-800';
      case 'review':
        return 'bg-indigo-100 text-indigo-800';
      case 'court':
        return 'bg-red-100 text-red-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'استشارة';
      case 'review':
        return 'مراجعة';
      case 'court':
        return 'محكمة';
      case 'meeting':
        return 'اجتماع';
      default:
        return type;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, typeof appointments>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddAppointment = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsAddModalOpen(false);
        // إعادة تحميل الصفحة لإظهار الموعد الجديد
        window.location.reload();
      } else {
        alert(result.message || 'حدث خطأ أثناء إضافة الموعد');
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('حدث خطأ في الاتصال بالخادم');
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
              <Calendar className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة المواعيد</h1>
            </div>
            
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة موعد جديد
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في المواعيد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="SCHEDULED">مجدول</option>
                <option value="COMPLETED">مكتمل</option>
                <option value="CANCELLED">ملغي</option>
                <option value="RESCHEDULED">معاد جدولته</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Calendar Navigation */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
              </h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" size="sm">عرض يومي</Button>
              <Button variant="outline" size="sm">عرض أسبوعي</Button>
              <Button variant="primary" size="sm">عرض شهري</Button>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sticky top-0 bg-gray-50 py-2">
                {formatDate(date)}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {dayAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{appointment.title}</h4>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                              {getTypeText(appointment.type)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 ml-2" />
                          <span>العميل: {appointment.client}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{appointment.time} ({appointment.duration} دقيقة)</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 ml-2" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {appointment.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="ghost" size="sm" icon={Eye}>
                            عرض
                          </Button>
                          <Button variant="ghost" size="sm" icon={Edit}>
                            تعديل
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:text-red-700">
                          حذف
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <Card className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مواعيد</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على مواعيد تطابق معايير البحث</p>
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة موعد جديد
            </Button>
          </Card>
        )}
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة موعد جديد"
        size="lg"
        preventClose={isLoading}
      >
        <AddAppointmentForm
          onSubmit={handleAddAppointment}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
