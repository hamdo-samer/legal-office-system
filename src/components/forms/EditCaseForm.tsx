'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import Button from '@/components/Button';

interface Case {
  id: string;
  title: string;
  case_number: string;
  case_type: string;
  status: string;
  client_id: string;
  court?: string;
  opponent?: string;
  start_date?: string;
  next_session?: string;
  description?: string;
  notes?: string;
}

interface Client {
  id: string;
  name: string;
}

interface EditCaseFormProps {
  case_: Case;
  clients: Client[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditCaseForm({
  case_,
  clients,
  onSubmit,
  onCancel,
  isLoading = false
}: EditCaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      title: case_.title,
      case_number: case_.case_number,
      case_type: case_.case_type,
      status: case_.status,
      client_id: case_.client_id,
      court: case_.court || '',
      opponent: case_.opponent || '',
      start_date: case_.start_date || '',
      next_session: case_.next_session || '',
      description: case_.description || '',
      notes: case_.notes || ''
    }
  });

  useEffect(() => {
    reset({
      title: case_.title,
      case_number: case_.case_number,
      case_type: case_.case_type,
      status: case_.status,
      client_id: case_.client_id,
      court: case_.court || '',
      opponent: case_.opponent || '',
      start_date: case_.start_date || '',
      next_session: case_.next_session || '',
      description: case_.description || '',
      notes: case_.notes || ''
    });
  }, [case_, reset]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* عنوان القضية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القضية *
          </label>
          <input
            type="text"
            {...register('title', { 
              required: 'عنوان القضية مطلوب',
              minLength: { value: 3, message: 'العنوان يجب أن يكون أكثر من 3 أحرف' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل عنوان القضية"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* رقم القضية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم القضية *
          </label>
          <input
            type="text"
            {...register('case_number', { 
              required: 'رقم القضية مطلوب'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل رقم القضية"
          />
          {errors.case_number && (
            <p className="mt-1 text-sm text-red-600">{errors.case_number.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نوع القضية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع القضية *
            </label>
            <select
              {...register('case_type', { required: 'نوع القضية مطلوب' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر نوع القضية</option>
              <option value="CIVIL">مدنية</option>
              <option value="COMMERCIAL">تجارية</option>
              <option value="CRIMINAL">جنائية</option>
              <option value="FAMILY">أحوال شخصية</option>
              <option value="ADMINISTRATIVE">إدارية</option>
              <option value="LABOR">عمالية</option>
            </select>
            {errors.case_type && (
              <p className="mt-1 text-sm text-red-600">{errors.case_type.message}</p>
            )}
          </div>

          {/* حالة القضية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حالة القضية *
            </label>
            <select
              {...register('status', { required: 'حالة القضية مطلوبة' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر حالة القضية</option>
              <option value="OPEN">مفتوحة</option>
              <option value="SUSPENDED">معلقة</option>
              <option value="CLOSED">مغلقة</option>
              <option value="APPEALED">مستأنفة</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* العميل */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العميل *
          </label>
          <select
            {...register('client_id', { required: 'العميل مطلوب' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر العميل</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* المحكمة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المحكمة
            </label>
            <input
              type="text"
              {...register('court')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم المحكمة"
            />
          </div>

          {/* الخصم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الخصم
            </label>
            <input
              type="text"
              {...register('opponent')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم الخصم"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* تاريخ بداية القضية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ بداية القضية
            </label>
            <input
              type="date"
              {...register('start_date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* الجلسة القادمة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الجلسة القادمة
            </label>
            <input
              type="date"
              {...register('next_session')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* وصف القضية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف القضية
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل وصف مفصل للقضية"
          />
        </div>

        {/* ملاحظات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل أي ملاحظات إضافية"
          />
        </div>
      </form>

      {/* الأزرار */}
      <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          icon={X}
          iconPosition="right"
        >
          إلغاء
        </Button>
        <Button
          loading={isLoading}
          icon={Save}
          iconPosition="right"
          onClick={handleSubmit(onSubmit)}
        >
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}
