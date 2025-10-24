/**
 * Custom hook for admin categories management with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';
import type { Category } from './useCategories';

export function useAdminCategories() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    const data = await res.json();
    return data.categories || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Category[]>(
    'swr:admin-categories',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      fallbackData: [],
    }
  );

  return {
    categories: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
