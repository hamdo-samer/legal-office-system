'use client';

import { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  User,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AddInvoiceForm from '@/components/forms/AddInvoiceForm';

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-202401-001',
      title: 'استشارة قانونية - يناير 2024',
      client: 'أحمد محمد علي',
      amount: 3000,
      taxAmount: 450,
      totalAmount: 3450,
      dueDate: '2024-02-10',
      issueDate: '2024-01-10',
      status: 'PENDING',
      description: 'استشارة قانونية شهرية'
    },
    {
      id: '2',
      invoiceNumber: 'INV-202401-002',
      title: 'أتعاب قضية مدنية',
      client: 'فاطمة علي حسن',
      amount: 5000,
      taxAmount: 750,
      totalAmount: 5750,
      dueDate: '2024-01-30',
      issueDate: '2024-01-05',
      status: 'PAID',
      description: 'أتعاب تمثيل في قضية مدنية'
    },
    {
      id: '3',
      invoiceNumber: 'INV-202401-003',
      title: 'وكالة قانونية',
      client: 'محمد حسن محمود',
      amount: 2000,
      taxAmount: 300,
      totalAmount: 2300,
      dueDate: '2024-01-15',
      issueDate: '2023-12-15',
      status: 'OVERDUE',
      description: 'رسوم إعداد وكالة قانونية'
    },
    {
      id: '4',
      invoiceNumber: 'INV-202401-004',
      title: 'مراجعة عقود',
      client: 'سارة أحمد محمد',
      amount: 1500,
      taxAmount: 225,
      totalAmount: 1725,
      dueDate: '2024-02-20',
      issueDate: '2024-01-20',
      status: 'PENDING',
      description: 'مراجعة وتدقيق عقود تجارية'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'مدفوعة';
      case 'PENDING':
        return 'في الانتظار';
      case 'OVERDUE':
        return 'متأخرة';
      case 'CANCELLED':
        return 'ملغية';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === 'OVERDUE' || (status === 'PENDING' && new Date(dueDate) < new Date());
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPending = invoices.filter(inv => inv.status === 'PENDING').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.totalAmount, 0);

  const handleAddInvoice = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to add invoice
      console.log('Adding invoice:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsAddModalOpen(false);
      // TODO: Refresh invoices list
    } catch (error) {
      console.error('Error adding invoice:', error);
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
              <Receipt className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة الفواتير</h1>
            </div>
            
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة فاتورة جديدة
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg ml-4">
                <Receipt className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mounted ? `${totalPending.toLocaleString()} جنيه` : '0 جنيه'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg ml-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">متأخرة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mounted ? `${totalOverdue.toLocaleString()} جنيه` : '0 جنيه'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg ml-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">مدفوعة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mounted ? `${totalPaid.toLocaleString()} جنيه` : '0 جنيه'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في الفواتير..."
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
                <option value="PENDING">في الانتظار</option>
                <option value="PAID">مدفوعة</option>
                <option value="OVERDUE">متأخرة</option>
                <option value="CANCELLED">ملغية</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Invoices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{invoice.title}</h3>
                    <p className="text-sm text-gray-500">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                    {isOverdue(invoice.dueDate, invoice.status) && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 ml-2" />
                    <span>العميل: {invoice.client}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>تاريخ الاستحقاق: {invoice.dueDate}</span>
                  </div>
                </div>

                {/* Amount Details */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المبلغ الأساسي:</span>
                    <span className="font-medium">
                      {mounted ? `${invoice.amount.toLocaleString()} جنيه` : `${invoice.amount} جنيه`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الضريبة:</span>
                    <span className="font-medium">
                      {mounted ? `${invoice.taxAmount.toLocaleString()} جنيه` : `${invoice.taxAmount} جنيه`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-1">
                    <span>الإجمالي:</span>
                    <span className="text-blue-600">
                      {mounted ? `${invoice.totalAmount.toLocaleString()} جنيه` : `${invoice.totalAmount} جنيه`}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {invoice.description}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="ghost" size="sm" icon={Eye}>
                      عرض
                    </Button>
                    <Button variant="ghost" size="sm" icon={Download}>
                      تحميل
                    </Button>
                    {invoice.status === 'PENDING' && (
                      <Button variant="ghost" size="sm" icon={Send}>
                        إرسال
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="ghost" size="sm" icon={Edit}>
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:text-red-700">
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <Card className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على فواتير تطابق معايير البحث</p>
            <Button
              icon={Plus}
              iconPosition="right"
              onClick={() => setIsAddModalOpen(true)}
            >
              إضافة فاتورة جديدة
            </Button>
          </Card>
        )}
      </div>

      {/* Add Invoice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة فاتورة جديدة"
        size="xl"
      >
        <AddInvoiceForm
          onSubmit={handleAddInvoice}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
