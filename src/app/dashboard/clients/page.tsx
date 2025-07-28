'use client';

import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AddClientForm from '@/components/forms/AddClientForm';
import EditClientForm from '@/components/forms/EditClientForm';
import Toast from '@/components/Toast';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/useToast';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const { clients, loading, error, addClient, updateClient, deleteClient, getClient } = useClients();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // تصفية العملاء حسب البحث والفلتر

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'INACTIVE':
        return 'غير نشط';
      default:
        return status;
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.phone.includes(searchQuery);
    const matchesFilter = filterType === 'all' || client.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddClient = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await addClient(data);
      if (success) {
        setIsAddModalOpen(false);
        showSuccess('تم إضافة العميل بنجاح', `تم إضافة ${data.name} إلى قائمة العملاء`);
      } else {
        showError('خطأ في إضافة العميل', error || 'حدث خطأ أثناء إضافة العميل');
      }
    } catch (err) {
      console.error('Error adding client:', err);
      showError('خطأ في الاتصال', 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // تعديل عميل
  const handleEditClient = async (clientId: string) => {
    const client = await getClient(clientId);
    if (client) {
      setSelectedClient(client);
      setIsEditModalOpen(true);
    }
  };

  // حفظ تعديل العميل
  const handleUpdateClient = async (data: any) => {
    if (!selectedClient) return;

    setIsLoading(true);
    try {
      const success = await updateClient(selectedClient.id, data);
      if (success) {
        setIsEditModalOpen(false);
        setSelectedClient(null);
        showSuccess('تم تحديث العميل بنجاح', `تم تحديث بيانات ${data.name} بنجاح`);
      } else {
        showError('خطأ في تحديث العميل', error || 'حدث خطأ أثناء تحديث العميل');
      }
    } catch (err) {
      console.error('Error updating client:', err);
      showError('خطأ في الاتصال', 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // حذف عميل
  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (confirm(`هل أنت متأكد من حذف العميل "${clientName}"؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      setIsLoading(true);
      try {
        const success = await deleteClient(clientId);
        if (success) {
          showSuccess('تم حذف العميل بنجاح', `تم حذف ${clientName} من قائمة العملاء`);
        } else {
          showError('خطأ في حذف العميل', error || 'حدث خطأ أثناء حذف العميل');
        }
      } catch (err) {
        console.error('Error deleting client:', err);
        showError('خطأ في الاتصال', 'حدث خطأ في الاتصال بالخادم');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
            </div>
            
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة عميل جديد
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
                placeholder="البحث في العملاء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع العملاء</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center ml-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">عميل منذ {client.created_at ? new Date(client.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {getStatusText(client.status)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 ml-2" />
                    <span>{client.email}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 ml-2" />
                    <span>{client.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 ml-2" />
                    <span>{client.address}</span>
                  </div>
                </div>

                {/* Cases Stats */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{client.cases_count || 0}</p>
                      <p className="text-xs text-gray-600">إجمالي القضايا</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleEditClient(client.id.toString())}
                    >
                      عرض
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEditClient(client.id.toString())}
                    >
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" icon={FileText}>
                      القضايا
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClient(client.id.toString(), client.name)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && filteredClients.length === 0 && (
          <Card className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد عملاء</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على عملاء يطابقون معايير البحث</p>
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة عميل جديد
            </Button>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل العملاء...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة عميل جديد"
        size="lg"
        preventClose={isLoading}
      >
        <AddClientForm
          onSubmit={handleAddClient}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        title="تعديل بيانات العميل"
        size="lg"
        preventClose={isLoading}
      >
        {selectedClient && (
          <EditClientForm
            client={selectedClient}
            onSubmit={handleUpdateClient}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedClient(null);
            }}
            isLoading={isLoading}
          />
        )}
      </Modal>

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
