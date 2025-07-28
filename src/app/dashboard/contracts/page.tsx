'use client';

import { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AddContractForm from '@/components/forms/AddContractForm';

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const contracts = [
    {
      id: '1',
      title: 'وكالة قانونية عامة',
      client: 'أحمد محمد علي',
      contractType: 'POWER_OF_ATTORNEY',
      status: 'ACTIVE',
      amount: 5000,
      startDate: '2024-01-10',
      endDate: '2024-12-31',
      description: 'وكالة قانونية عامة للتصرف في جميع الأمور القانونية'
    },
    {
      id: '2',
      title: 'عقد استشارة قانونية',
      client: 'فاطمة علي حسن',
      contractType: 'LEGAL_CONSULTATION',
      status: 'ACTIVE',
      amount: 3000,
      startDate: '2024-01-05',
      endDate: '2024-06-30',
      description: 'عقد استشارة قانونية شهرية في القضايا المدنية'
    },
    {
      id: '3',
      title: 'عقد تمثيل قانوني',
      client: 'محمد حسن محمود',
      contractType: 'REPRESENTATION',
      status: 'COMPLETED',
      amount: 10000,
      startDate: '2023-12-15',
      endDate: '2024-01-15',
      description: 'عقد تمثيل قانوني في قضية جنائية'
    },
    {
      id: '4',
      title: 'وكالة خاصة للبيع',
      client: 'سارة أحمد محمد',
      contractType: 'POWER_OF_ATTORNEY',
      status: 'DRAFT',
      amount: 2000,
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      description: 'وكالة خاصة لبيع عقار'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'TERMINATED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'DRAFT':
        return 'مسودة';
      case 'COMPLETED':
        return 'مكتمل';
      case 'TERMINATED':
        return 'منتهي';
      default:
        return status;
    }
  };

  const getContractTypeText = (type: string) => {
    switch (type) {
      case 'POWER_OF_ATTORNEY':
        return 'وكالة قانونية';
      case 'LEGAL_CONSULTATION':
        return 'استشارة قانونية';
      case 'REPRESENTATION':
        return 'تمثيل قانوني';
      case 'OTHER':
        return 'أخرى';
      default:
        return type;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddContract = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to add contract
      console.log('Adding contract:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsAddModalOpen(false);
      // TODO: Refresh contracts list
    } catch (error) {
      console.error('Error adding contract:', error);
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
              <FileCheck className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة العقود</h1>
            </div>
            
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة عقد جديد
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
                placeholder="البحث في العقود..."
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
                <option value="ACTIVE">نشط</option>
                <option value="DRAFT">مسودة</option>
                <option value="COMPLETED">مكتمل</option>
                <option value="TERMINATED">منتهي</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
                    <p className="text-sm text-gray-500">{getContractTypeText(contract.contractType)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 ml-2" />
                    <span>العميل: {contract.client}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 ml-2" />
                    <span>القيمة: {contract.amount.toLocaleString()} جنيه</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>من {contract.startDate} إلى {contract.endDate}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {contract.description}
                </p>

                {/* Progress Bar for Active Contracts */}
                {contract.status === 'ACTIVE' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>التقدم</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
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
                    <Button variant="ghost" size="sm" icon={Download}>
                      تحميل
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

        {/* Empty State */}
        {filteredContracts.length === 0 && (
          <Card className="text-center py-12">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عقود</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على عقود تطابق معايير البحث</p>
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة عقد جديد
            </Button>
          </Card>
        )}
      </div>

      {/* Add Contract Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة عقد جديد"
        size="xl"
      >
        <AddContractForm
          onSubmit={handleAddContract}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
