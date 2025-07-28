'use client';

import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { 
  FileText, 
  User, 
  Calendar, 
  Building, 
  Edit, 
  Trash2, 
  Plus,
  Clock,
  DollarSign
} from 'lucide-react';

interface CaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  case_: {
    id: string;
    caseNumber: string;
    title: string;
    client: string;
    caseType: string;
    status: string;
    court: string;
    opponent: string;
    startDate: string;
    nextSession?: string;
    description: string;
  };
}

export default function CaseDetailsModal({ isOpen, onClose, case_ }: CaseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('details');

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

  const tabs = [
    { id: 'details', name: 'التفاصيل', icon: FileText },
    { id: 'sessions', name: 'الجلسات', icon: Calendar },
    { id: 'documents', name: 'المستندات', icon: FileText },
    { id: 'payments', name: 'المدفوعات', icon: DollarSign },
  ];

  // Mock data for sessions
  const sessions = [
    {
      id: '1',
      date: '2024-01-25',
      time: '10:00',
      type: 'جلسة نظر',
      status: 'scheduled',
      notes: 'جلسة نظر الدعوى'
    },
    {
      id: '2',
      date: '2024-01-10',
      time: '11:00',
      type: 'جلسة مرافعة',
      status: 'completed',
      notes: 'تم تقديم المرافعة'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={case_.title} size="2xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{case_.caseNumber}</h3>
              <p className="text-sm text-gray-600">{getCaseTypeText(case_.caseType)}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(case_.status)}`}>
              {getStatusText(case_.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 ml-2" />
              <span className="text-gray-600">العميل: </span>
              <span className="font-medium">{case_.client}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 text-gray-400 ml-2" />
              <span className="text-gray-600">المحكمة: </span>
              <span className="font-medium">{case_.court}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 ml-2" />
              <span className="text-gray-600">تاريخ البداية: </span>
              <span className="font-medium">{case_.startDate}</span>
            </div>
            {case_.nextSession && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 ml-2" />
                <span className="text-gray-600">الجلسة القادمة: </span>
                <span className="font-medium">{case_.nextSession}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" icon={Edit} size="sm">
            تعديل
          </Button>
          <Button variant="outline" icon={Plus} size="sm">
            إضافة جلسة
          </Button>
          <Button variant="outline" icon={Plus} size="sm">
            إضافة مستند
          </Button>
          <Button variant="danger" icon={Trash2} size="sm">
            حذف القضية
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 ml-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">وصف القضية</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{case_.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">الخصم</h4>
                <p className="text-gray-700">{case_.opponent}</p>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">جلسات القضية</h4>
                <Button icon={Plus} size="sm">إضافة جلسة</Button>
              </div>
              
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">{session.type}</h5>
                        <p className="text-sm text-gray-600">{session.date} - {session.time}</p>
                        <p className="text-sm text-gray-700 mt-1">{session.notes}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.status === 'completed' ? 'مكتملة' : 'مجدولة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">مستندات القضية</h4>
                <Button icon={Plus} size="sm">إضافة مستند</Button>
              </div>
              
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد مستندات مرفقة</p>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">مدفوعات القضية</h4>
                <Button icon={Plus} size="sm">إضافة دفعة</Button>
              </div>
              
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد مدفوعات مسجلة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
