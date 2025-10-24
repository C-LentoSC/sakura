/**
 * Custom hook for admin users management with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: string;
  _count?: {
    sessions: number;
  };
}

export function useAdminUsers() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to load users');
    const data = await res.json();
    return data.users || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<AdminUser[]>(
    'swr:admin-users',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      fallbackData: [],
    }
  );

  return {
    users: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
