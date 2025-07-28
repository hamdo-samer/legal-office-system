'use client';

import { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  Image,
  File,
  User
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import FileUpload from '@/components/FileUpload';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast, showSuccess, showError, hideToast } = useToast();

  // Mock data
  const documents = [
    {
      id: '1',
      title: 'مذكرة دفاع - قضية تجارية',
      fileName: 'defense_memo_001.pdf',
      fileType: 'pdf',
      fileSize: 2048576, // 2MB
      uploadedAt: '2024-01-20',
      caseId: 'CASE-2024-0001',
      caseName: 'قضية تجارية - شركة الأمل',
      category: 'legal_document'
    },
    {
      id: '2',
      title: 'وكالة قانونية عامة',
      fileName: 'power_of_attorney_002.pdf',
      fileType: 'pdf',
      fileSize: 1536000, // 1.5MB
      uploadedAt: '2024-01-18',
      contractId: 'CONTRACT-2024-0001',
      contractName: 'وكالة قانونية عامة',
      category: 'contract'
    },
    {
      id: '3',
      title: 'صورة من الهوية الشخصية',
      fileName: 'client_id_003.jpg',
      fileType: 'jpg',
      fileSize: 512000, // 512KB
      uploadedAt: '2024-01-15',
      clientId: 'CLIENT-001',
      clientName: 'أحمد محمد علي',
      category: 'identification'
    },
    {
      id: '4',
      title: 'عقد البيع الأصلي',
      fileName: 'original_contract_004.pdf',
      fileType: 'pdf',
      fileSize: 3072000, // 3MB
      uploadedAt: '2024-01-12',
      caseId: 'CASE-2024-0002',
      caseName: 'قضية مدنية - نزاع عقاري',
      category: 'evidence'
    },
    {
      id: '5',
      title: 'تقرير الخبير القانوني',
      fileName: 'expert_report_005.docx',
      fileType: 'docx',
      fileSize: 1024000, // 1MB
      uploadedAt: '2024-01-10',
      caseId: 'CASE-2024-0001',
      caseName: 'قضية تجارية - شركة الأمل',
      category: 'report'
    }
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'legal_document':
        return 'مستند قانوني';
      case 'contract':
        return 'عقد';
      case 'identification':
        return 'هوية';
      case 'evidence':
        return 'دليل';
      case 'report':
        return 'تقرير';
      default:
        return 'أخرى';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal_document':
        return 'bg-blue-100 text-blue-800';
      case 'contract':
        return 'bg-green-100 text-green-800';
      case 'identification':
        return 'bg-purple-100 text-purple-800';
      case 'evidence':
        return 'bg-orange-100 text-orange-800';
      case 'report':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  // رفع ملف جديد
  const handleFileUpload = async (file: File, metadata: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', metadata.category);
      formData.append('description', metadata.description);
      if (metadata.clientId) formData.append('clientId', metadata.clientId);
      if (metadata.caseId) formData.append('caseId', metadata.caseId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('تم رفع الملف بنجاح', `تم رفع ${file.name} بنجاح`);
        setIsUploadModalOpen(false);
        // إعادة تحميل المستندات
        return true;
      } else {
        showError('خطأ في رفع الملف', result.message || 'حدث خطأ أثناء رفع الملف');
        return false;
      }
    } catch (err) {
      showError('خطأ في الاتصال', 'حدث خطأ في الاتصال بالخادم');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // حذف مستند
  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    if (confirm(`هل أنت متأكد من حذف المستند "${documentName}"؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          showSuccess('تم حذف المستند بنجاح', `تم حذف ${documentName} بنجاح`);
          // إعادة تحميل المستندات
        } else {
          showError('خطأ في حذف المستند', result.message || 'حدث خطأ أثناء حذف المستند');
        }
      } catch (err) {
        showError('خطأ في الاتصال', 'حدث خطأ في الاتصال بالخادم');
      }
    }
  };

  // تنزيل مستند
  const handleDownloadDocument = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // useEffect(() => {
  //   fetchDocuments();
  // }, []);

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || document.category === filterType;
    return matchesSearch && matchesFilter;
  });



  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة المستندات</h1>
            </div>
            
            <div className="flex space-x-2 space-x-reverse">
              <Button
                variant="outline"
                icon={Upload}
                iconPosition="right"
                onClick={() => setIsUploadModalOpen(true)}
              >
                رفع ملف
              </Button>
              <Button icon={Plus} iconPosition="right">
                إضافة مجلد
              </Button>
            </div>
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
                placeholder="البحث في المستندات..."
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
                <option value="all">جميع الفئات</option>
                <option value="legal_document">مستندات قانونية</option>
                <option value="contract">عقود</option>
                <option value="identification">هويات</option>
                <option value="evidence">أدلة</option>
                <option value="report">تقارير</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    {getFileIcon(document.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{document.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{document.fileName}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                    {getCategoryText(document.category)}
                  </span>
                </div>

                {/* File Details */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">حجم الملف:</span>
                    <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">تاريخ الرفع:</span>
                    <span className="font-medium">{document.uploadedAt}</span>
                  </div>
                </div>

                {/* Related Info */}
                <div className="space-y-2 text-sm">
                  {document.caseName && (
                    <div className="flex items-center text-gray-600">
                      <FileText className="h-4 w-4 ml-2" />
                      <span>القضية: {document.caseName}</span>
                    </div>
                  )}
                  
                  {document.contractName && (
                    <div className="flex items-center text-gray-600">
                      <FileText className="h-4 w-4 ml-2" />
                      <span>العقد: {document.contractName}</span>
                    </div>
                  )}
                  
                  {document.clientName && (
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 ml-2" />
                      <span>العميل: {document.clientName}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => window.open(`/uploads/${document.fileName}` || '#', '_blank')}
                    >
                      عرض
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownloadDocument(`/uploads/${document.fileName}`, document.fileName)}
                    >
                      تحميل
                    </Button>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="ghost" size="sm" icon={Edit}>
                      تعديل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteDocument(document.id, document.title)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستندات</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على مستندات تطابق معايير البحث</p>
            <div className="flex justify-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                icon={Upload}
                iconPosition="right"
                onClick={() => setIsUploadModalOpen(true)}
              >
                رفع ملف
              </Button>
              <Button icon={Plus} iconPosition="right">
                إضافة مجلد
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="رفع مستندات جديدة"
        size="xl"
      >
        <FileUpload
          onUpload={handleFileUpload}
          category="general"
          className="p-4"
        />
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
