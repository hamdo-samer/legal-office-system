'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import { Save, X } from 'lucide-react';

const caseSchema = z.object({
  title: z.string().min(1, 'عنوان القضية مطلوب'),
  caseNumber: z.string().min(1, 'رقم القضية مطلوب'),
  caseType: z.enum(['CIVIL', 'CRIMINAL', 'COMMERCIAL', 'FAMILY', 'ADMINISTRATIVE', 'LABOR', 'OTHER']),
  clientName: z.string().min(1, 'اسم العميل مطلوب'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().optional(),
  court: z.string().optional(),
  opponent: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1, 'تاريخ البداية مطلوب'),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface AddCaseFormProps {
  onSubmit: (data: CaseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AddCaseForm({ onSubmit, onCancel, isLoading = false }: AddCaseFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
  });



  const caseTypes = [
    { value: 'CIVIL', label: 'مدنية' },
    { value: 'CRIMINAL', label: 'جنائية' },
    { value: 'COMMERCIAL', label: 'تجارية' },
    { value: 'FAMILY', label: 'أحوال شخصية' },
    { value: 'ADMINISTRATIVE', label: 'إدارية' },
    { value: 'LABOR', label: 'عمالية' },
    { value: 'OTHER', label: 'أخرى' },
  ];

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Case Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القضية *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل عنوان القضية"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Case Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم القضية *
          </label>
          <input
            {...register('caseNumber')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="CASE-2024-0001"
          />
          {errors.caseNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.caseNumber.message}</p>
          )}
        </div>

        {/* Case Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع القضية *
          </label>
          <select
            {...register('caseType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر نوع القضية</option>
            {caseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.caseType && (
            <p className="mt-1 text-sm text-red-600">{errors.caseType.message}</p>
          )}
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم العميل *
            </label>
            <input
              {...register('clientName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم العميل"
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هاتف العميل
            </label>
            <input
              {...register('clientPhone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="رقم الهاتف"
            />
            {errors.clientPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.clientPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              بريد العميل الإلكتروني
            </label>
            <input
              {...register('clientEmail')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="البريد الإلكتروني"
            />
            {errors.clientEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.clientEmail.message}</p>
            )}
          </div>
        </div>

        {/* Court */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المحكمة
          </label>
          <input
            {...register('court')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="اسم المحكمة"
          />
        </div>

        {/* Opponent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الخصم
          </label>
          <input
            {...register('opponent')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="اسم الخصم"
          />
        </div>

        {/* Start Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ البداية *
          </label>
          <input
            {...register('startDate')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف القضية
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل وصف مفصل للقضية..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          icon={X}
          iconPosition="right"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          icon={Save}
          iconPosition="right"
        >
          حفظ القضية
        </Button>
        </div>
      </form>
    </div>
  );
}
