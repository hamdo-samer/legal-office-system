import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ar, tr, enUS } from 'date-fns/locale';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: Date | string, locale: string = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeMap = { ar, tr, en: enUS };
  
  return format(dateObj, 'PPP', { locale: localeMap[locale as keyof typeof localeMap] });
}

export function formatDateTime(date: Date | string, locale: string = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeMap = { ar, tr, en: enUS };
  
  return format(dateObj, 'PPP p', { locale: localeMap[locale as keyof typeof localeMap] });
}

export function formatRelativeTime(date: Date | string, locale: string = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeMap = { ar, tr, en: enUS };
  
  if (isToday(dateObj)) {
    return locale === 'ar' ? 'اليوم' : locale === 'tr' ? 'Bugün' : 'Today';
  }
  
  if (isTomorrow(dateObj)) {
    return locale === 'ar' ? 'غداً' : locale === 'tr' ? 'Yarın' : 'Tomorrow';
  }
  
  if (isYesterday(dateObj)) {
    return locale === 'ar' ? 'أمس' : locale === 'tr' ? 'Dün' : 'Yesterday';
  }
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: localeMap[locale as keyof typeof localeMap] 
  });
}

// String utilities
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CASE-${year}-${random}`;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
}

export function isPdfFile(filename: string): boolean {
  return getFileExtension(filename).toLowerCase() === 'pdf';
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Currency utilities
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'ar'): string {
  const localeMap = {
    ar: 'ar-SA',
    tr: 'tr-TR',
    en: 'en-US'
  };
  
  return new Intl.NumberFormat(localeMap[locale as keyof typeof localeMap], {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Color utilities for status
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Case Status
    OPEN: 'bg-blue-100 text-blue-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    APPEALED: 'bg-purple-100 text-purple-800',
    
    // Appointment Status
    SCHEDULED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RESCHEDULED: 'bg-orange-100 text-orange-800',
    
    // Invoice Status
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    
    // Contract Status
    DRAFT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    TERMINATED: 'bg-red-100 text-red-800'
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// Search utilities
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

// Local storage utilities
export function setLocalStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getLocalStorage(key: string): any {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// URL utilities
export function createQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
