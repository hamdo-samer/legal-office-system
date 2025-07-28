'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import Button from './Button';

interface FileUploadProps {
  onUpload: (file: File, metadata: any) => Promise<boolean>;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  category?: string;
  clientId?: string;
  caseId?: string;
  className?: string;
}

export default function FileUpload({
  onUpload,
  acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain'],
  maxSize = 10,
  category = 'general',
  clientId,
  caseId,
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    // التحقق من نوع الملف
    if (!acceptedTypes.includes(file.type)) {
      setError('نوع الملف غير مدعوم');
      return;
    }

    // التحقق من حجم الملف
    if (file.size > maxSize * 1024 * 1024) {
      setError(`حجم الملف كبير جداً (الحد الأقصى ${maxSize}MB)`);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const metadata = {
        category: selectedCategory,
        description,
        clientId,
        caseId
      };

      const success = await onUpload(selectedFile, metadata);
      
      if (success) {
        // إعادة تعيين النموذج
        setSelectedFile(null);
        setDescription('');
        setSelectedCategory(category);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDescription('');
    setSelectedCategory(category);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* منطقة رفع الملفات */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept={acceptedTypes.join(',')}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-3">
            <File className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={handleCancel}
            >
              إزالة الملف
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">اسحب الملف هنا أو</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                اختر ملف
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              الأنواع المدعومة: PDF, Word, صور, نصوص (حد أقصى {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {/* رسالة خطأ */}
      {error && (
        <div className="flex items-center space-x-2 space-x-reverse text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* معلومات إضافية */}
      {selectedFile && (
        <div className="space-y-4">
          {/* التصنيف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصنيف المستند
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">عام</option>
              <option value="contract">عقد</option>
              <option value="court_document">مستند محكمة</option>
              <option value="evidence">دليل</option>
              <option value="correspondence">مراسلات</option>
              <option value="invoice">فاتورة</option>
            </select>
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف المستند
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل وصف للمستند (اختياري)"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleUpload}
              loading={isUploading}
              icon={Upload}
              iconPosition="right"
            >
              رفع الملف
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
