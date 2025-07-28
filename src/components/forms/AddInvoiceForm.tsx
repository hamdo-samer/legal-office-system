'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import { Save, X, Calculator } from 'lucide-react';

const invoiceSchema = z.object({
  title: z.string().min(1, 'عنوان الفاتورة مطلوب'),
  clientId: z.string().min(1, 'يجب اختيار العميل'),
  amount: z.string().min(1, 'المبلغ الأساسي مطلوب'),
  taxRate: z.string().optional(),
  dueDate: z.string().min(1, 'تاريخ الاستحقاق مطلوب'),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface AddInvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AddInvoiceForm({ onSubmit, onCancel, isLoading = false }: AddInvoiceFormProps) {
  const [amount, setAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(15); // Default 15% tax

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const watchedAmount = watch('amount');
  const watchedTaxRate = watch('taxRate');

  // Calculate totals
  const baseAmount = parseFloat(watchedAmount || '0') || 0;
  const taxAmount = (baseAmount * (parseFloat(watchedTaxRate || '0') || 0)) / 100;
  const totalAmount = baseAmount + taxAmount;

  // Mock clients data
  const clients = [
    { id: '1', name: 'أحمد محمد علي' },
    { id: '2', name: 'فاطمة علي حسن' },
    { id: '3', name: 'محمد حسن محمود' },
    { id: '4', name: 'سارة أحمد محمد' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الفاتورة *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل عنوان الفاتورة"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
            المبلغ الأساسي (جنيه) *
          </label>
          <input
            {...register('amount')}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Tax Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            معدل الضريبة (%)
          </label>
          <input
            {...register('taxRate')}
            type="number"
            step="0.01"
            defaultValue="15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="15"
          />
        </div>

        {/* Due Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ الاستحقاق *
          </label>
          <input
            {...register('dueDate')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Calculator className="h-5 w-5 text-gray-600 ml-2" />
          <h3 className="text-lg font-medium text-gray-900">ملخص الحساب</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">المبلغ الأساسي:</span>
            <span className="font-medium">{baseAmount.toFixed(2)} جنيه</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">الضريبة ({parseFloat(watchedTaxRate || '0') || 0}%):</span>
            <span className="font-medium">{taxAmount.toFixed(2)} جنيه</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
            <span>الإجمالي:</span>
            <span className="text-blue-600">{totalAmount.toFixed(2)} جنيه</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف الخدمة
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="وصف الخدمة المقدمة..."
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ملاحظات
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أي ملاحظات إضافية..."
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
          حفظ الفاتورة
        </Button>
      </div>
    </form>
  );
}
