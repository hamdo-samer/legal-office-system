'use client';

import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AddCaseForm from '@/components/forms/AddCaseForm';
import CaseDetailsModal from '@/components/forms/CaseDetailsModal';
import Toast from '@/components/Toast';
import { useCases } from '@/hooks/useCases';
import { useToast } from '@/hooks/useToast';

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const { cases, loading, error, addCase } = useCases();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // تصفية القضايا حسب البحث والفلتر

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'APPEALED':
        return 'bg-purple-100 text-purple-800';
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
      case 'APPEALED':
        return 'مستأنفة';
      default:
        return status;
    }
  };

  const getCaseTypeText = (type: string) => {
    switch (type) {
      case 'CIVIL':
        return 'مدنية';
      case 'CRIMINAL':
        return 'جنائية';
      case 'COMMERCIAL':
        return 'تجارية';
      case 'FAMILY':
        return 'أحوال شخصية';
      case 'ADMINISTRATIVE':
        return 'إدارية';
      case 'LABOR':
        return 'عمالية';
      default:
        return 'أخرى';
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.case_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || case_.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddCase = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await addCase(data);
      if (success) {
        setIsAddModalOpen(false);
        showSuccess('تم إضافة القضية بنجاح', `تم إضافة القضية ${data.title} بنجاح`);
      } else {
        showError('خطأ في إضافة القضية', error || 'حدث خطأ أثناء إضافة القضية');
      }
    } catch (err) {
      console.error('Error adding case:', err);
      showError('خطأ في الاتصال', 'حدث خطأ في الاتصال بالخادم');
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
              <FileText className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة القضايا</h1>
            </div>
            
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة قضية جديدة
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
                placeholder="البحث في القضايا..."
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
                <option value="OPEN">مفتوحة</option>
                <option value="SUSPENDED">معلقة</option>
                <option value="CLOSED">مغلقة</option>
                <option value="APPEALED">مستأنفة</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل القضايا...</p>
            </div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </div>
          </Card>
        ) : filteredCases.length > 0 ? (
          /* Cases Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
            <Card key={case_.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{case_.title}</h3>
                    <p className="text-sm text-gray-500">{case_.case_number}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                    {getStatusText(case_.status)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 ml-2" />
                    <span>العميل: {case_.client_name}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 ml-2" />
                    <span>المحكمة: {case_.court}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 ml-2" />
                    <span>النوع: {getCaseTypeText(case_.case_type)}</span>
                  </div>
                  
                  {case_.next_session_date && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 ml-2" />
                      <span>الجلسة القادمة: {case_.next_session_date}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {case_.description}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedCase(case_)}
                    >
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

        ) : (
          /* Empty State */
          <Card className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد قضايا</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على قضايا تطابق معايير البحث</p>
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة قضية جديدة
            </Button>
          </Card>
        )}
      </div>

      {/* Add Case Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة قضية جديدة"
        size="xl"
        preventClose={isLoading}
      >
        <AddCaseForm
          onSubmit={handleAddCase}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailsModal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          case_={selectedCase}
        />
      )}

      {/* Toast Notifications */}
      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}
