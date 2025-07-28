import { useState, useEffect, useCallback } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  national_id?: string;
  address?: string;
  date_of_birth?: string;
  notes?: string;
  status: string;
  cases_count: number;
  created_at: string;
  updated_at: string;
}

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  refreshClients: () => Promise<void>;
  addClient: (clientData: any) => Promise<boolean>;
  updateClient: (id: string, clientData: any) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
  getClient: (id: string) => Promise<Client | null>;
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/clients');
      const result = await response.json();
      
      if (result.success) {
        setClients(result.data);
      } else {
        setError(result.message || 'خطأ في تحميل العملاء');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addClient = useCallback(async (clientData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      const result = await response.json();

      if (result.success) {
        // إضافة العميل الجديد إلى القائمة المحلية
        setClients(prev => [result.data, ...prev]);
        return true;
      } else {
        setError(result.message || 'خطأ في إضافة العميل');
        return false;
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Error adding client:', err);
      return false;
    }
  }, []);

  const refreshClients = useCallback(async () => {
    await fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // تحديث عميل
  const updateClient = async (id: string, clientData: any): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      const result = await response.json();

      if (result.success) {
        // تحديث العميل في القائمة المحلية
        setClients(prev => prev.map(client =>
          client.id.toString() === id ? result.data : client
        ));
        return true;
      } else {
        setError(result.message || 'فشل في تحديث العميل');
        return false;
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      return false;
    }
  };

  // حذف عميل
  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // إزالة العميل من القائمة المحلية
        setClients(prev => prev.filter(client => client.id.toString() !== id));
        return true;
      } else {
        setError(result.message || 'فشل في حذف العميل');
        return false;
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      return false;
    }
  };

  // الحصول على عميل محدد
  const getClient = async (id: string): Promise<Client | null> => {
    try {
      setError(null);
      const response = await fetch(`/api/clients/${id}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'فشل في الحصول على العميل');
        return null;
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      return null;
    }
  };

  return {
    clients,
    loading,
    error,
    refreshClients,
    addClient,
    updateClient,
    deleteClient,
    getClient
  };
}
