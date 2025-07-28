'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import { Save, X } from 'lucide-react';

const contractSchema = z.object({
  title: z.string().min(1, 'عنوان العقد مطلوب'),
  contractType: z.enum(['POWER_OF_ATTORNEY', 'LEGAL_CONSULTATION', 'REPRESENTATION', 'OTHER']),
  clientId: z.string().min(1, 'يجب اختيار العميل'),
  amount: z.string().min(1, 'المبلغ مطلوب'),
  startDate: z.string().min(1, 'تاريخ البداية مطلوب'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  terms: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

interface AddContractFormProps {
  onSubmit: (data: ContractFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AddContractForm({ onSubmit, onCancel, isLoading = false }: AddContractFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  // Mock clients data
  const clients = [
    { id: '1', name: 'أحمد محمد علي' },
    { id: '2', name: 'فاطمة علي حسن' },
    { id: '3', name: 'محمد حسن محمود' },
    { id: '4', name: 'سارة أحمد محمد' },
  ];

  const contractTypes = [
    { value: 'POWER_OF_ATTORNEY', label: 'وكالة قانونية' },
    { value: 'LEGAL_CONSULTATION', label: 'استشارة قانونية' },
    { value: 'REPRESENTATION', label: 'تمثيل قانوني' },
    { value: 'OTHER', label: 'أخرى' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان العقد *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل عنوان العقد"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Contract Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع العقد *
          </label>
          <select
            {...register('contractType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر نوع العقد</option>
            {contractTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.contractType && (
            <p className="mt-1 text-sm text-red-600">{errors.contractType.message}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العميل *
          </label>
          <select
            {...register('clientId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر العميل</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المبلغ (جنيه) *
          </label>
          <input
            {...register('amount')}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
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

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ النهاية
          </label>
          <input
            {...register('endDate')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف العقد
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="وصف مختصر للعقد..."
        />
      </div>

      {/* Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الشروط والأحكام
        </label>
        <textarea
          {...register('terms')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="الشروط والأحكام الخاصة بالعقد..."
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
          حفظ العقد
        </Button>
      </div>
    </form>
  );
}
