/**
 * Custom hook for fetching service categories with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export interface SubSubCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  _count?: {
    services: number;
  };
}

export interface SubCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  subSubCategories: SubSubCategory[];
  _count?: {
    services: number;
  };
}

export interface Category {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  subCategories: SubCategory[];
  _count?: {
    services: number;
  };
}

export function useCategories() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    const data: { categories: Category[] } = await res.json();
    return data.categories;
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Category[]>(
    'swr:categories:all',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds (categories change less frequently)
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
