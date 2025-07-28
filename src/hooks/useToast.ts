import { useState, useCallback } from 'react';
import { ToastType } from '@/components/Toast';

interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message?: string;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (type: ToastType, title: string, message?: string) => void;
  hideToast: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    setToast({
      show: true,
      type,
      title,
      message,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message);
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast('info', title, message);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
