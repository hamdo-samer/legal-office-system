'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import Button from '@/components/Button';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  national_id?: string;
  address?: string;
  date_of_birth?: string;
  notes?: string;
}

interface EditClientFormProps {
  client: Client;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditClientForm({
  client,
  onSubmit,
  onCancel,
  isLoading = false
}: EditClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      nationalId: client.national_id || '',
      address: client.address || '',
      dateOfBirth: client.date_of_birth || '',
      notes: client.notes || ''
    }
  });

  useEffect(() => {
    reset({
      name: client.name,
      email: client.email,
      phone: client.phone,
      nationalId: client.national_id || '',
      address: client.address || '',
      dateOfBirth: client.date_of_birth || '',
      notes: client.notes || ''
    });
  }, [client, reset]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم الكامل *
          </label>
          <input
            type="text"
            {...register('name', { 
              required: 'الاسم مطلوب',
              minLength: { value: 2, message: 'الاسم يجب أن يكون أكثر من حرفين' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل الاسم الكامل"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'البريد الإلكتروني مطلوب',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'البريد الإلكتروني غير صحيح'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل البريد الإلكتروني"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            {...register('phone', { 
              required: 'رقم الهاتف مطلوب',
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: 'رقم الهاتف غير صحيح'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل رقم الهاتف"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* الرقم القومي */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الرقم القومي
          </label>
          <input
            type="text"
            {...register('nationalId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل الرقم القومي"
          />
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان
          </label>
          <textarea
            {...register('address')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل العنوان"
          />
        </div>

        {/* تاريخ الميلاد */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ الميلاد
          </label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* ملاحظات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات
          </label>
          <textarea
            {...register('notes')}
            rows={4}
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
