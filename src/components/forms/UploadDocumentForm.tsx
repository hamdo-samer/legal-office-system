'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import { Save, X, Upload, File, Trash2 } from 'lucide-react';

const documentSchema = z.object({
  title: z.string().min(1, 'عنوان المستند مطلوب'),
  category: z.enum(['legal_document', 'contract', 'identification', 'evidence', 'report']),
  caseId: z.string().optional(),
  clientId: z.string().optional(),
  description: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface UploadDocumentFormProps {
  onSubmit: (data: DocumentFormData & { files: File[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function UploadDocumentForm({ onSubmit, onCancel, isLoading = false }: UploadDocumentFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
  });

  // Mock data
  const cases = [
    { id: '1', title: 'قضية تجارية - شركة الأمل' },
    { id: '2', title: 'قضية مدنية - نزاع عقاري' },
    { id: '3', title: 'قضية جنائية - دفاع' },
  ];

  const clients = [
    { id: '1', name: 'أحمد محمد علي' },
    { id: '2', name: 'فاطمة علي حسن' },
    { id: '3', name: 'محمد حسن محمود' },
    { id: '4', name: 'سارة أحمد محمد' },
  ];

  const categories = [
    { value: 'legal_document', label: 'مستند قانوني' },
    { value: 'contract', label: 'عقد' },
    { value: 'identification', label: 'هوية' },
    { value: 'evidence', label: 'دليل' },
    { value: 'report', label: 'تقرير' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFormSubmit = (data: DocumentFormData) => {
    if (selectedFiles.length === 0) {
      alert('يرجى اختيار ملف واحد على الأقل');
      return;
    }
    onSubmit({ ...data, files: selectedFiles });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الملفات *
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">اضغط لاختيار الملفات أو اسحبها هنا</p>
          <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (حد أقصى 10MB لكل ملف)</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">الملفات المحددة:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-gray-500 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان المستند *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل عنوان المستند"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            فئة المستند *
          </label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر الفئة</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Case */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            القضية (اختياري)
          </label>
          <select
            {...register('caseId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر القضية</option>
            {cases.map((case_) => (
              <option key={case_.id} value={case_.id}>
                {case_.title}
              </option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العميل (اختياري)
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
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف المستند
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="وصف مختصر للمستند..."
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
          disabled={selectedFiles.length === 0}
        >
          رفع المستندات
        </Button>
      </div>
    </form>
  );
}
