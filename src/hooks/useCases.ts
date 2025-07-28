import { useState, useEffect, useCallback } from 'react';

interface Case {
  id: number;
  case_number: string;
  title: string;
  case_type: string;
  status: string;
  client_id: number;
  lawyer_id: number;
  court?: string;
  opponent?: string;
  description?: string;
  start_date: string;
  end_date?: string;
  next_session_date?: string;
  client_name: string;
  lawyer_name: string;
  created_at: string;
  updated_at: string;
}

interface UseCasesReturn {
  cases: Case[];
  loading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
  addCase: (caseData: any) => Promise<boolean>;
}

export function useCases(): UseCasesReturn {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cases');
      const result = await response.json();
      
      if (result.success) {
        setCases(result.data);
      } else {
        setError(result.message || 'خطأ في تحميل القضايا');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCase = useCallback(async (caseData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      const result = await response.json();

      if (result.success) {
        // إضافة القضية الجديدة إلى القائمة المحلية
        setCases(prev => [result.data, ...prev]);
        return true;
      } else {
        setError(result.message || 'خطأ في إضافة القضية');
        return false;
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Error adding case:', err);
      return false;
    }
  }, []);

  const refreshCases = useCallback(async () => {
    await fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    refreshCases,
    addCase,
  };
}
