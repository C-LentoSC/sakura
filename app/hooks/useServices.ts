/**
 * Custom hook for fetching services with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export interface ServiceCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
}

export interface ServiceSubCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
}

export interface ServiceSubSubCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
}

export interface Service {
  id: string;
  nameKey: string;
  descKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  descEn?: string | null;
  descJa?: string | null;
  price: number;
  duration: string;
  image: string;
  order?: number;
  isActive?: boolean;
  category: ServiceCategory;
  subCategory?: ServiceSubCategory;
  subSubCategory?: ServiceSubSubCategory;
}

interface UseServicesOptions {
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  search?: string;
}

export function useServices(options: UseServicesOptions = {}) {
  const { category, subCategory, subSubCategory, search } = options;

  const fetcher = useCallback(async () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subCategory && subCategory !== 'all') params.set('subCategory', subCategory);
    if (subSubCategory && subSubCategory !== 'all') params.set('subSubCategory', subSubCategory);
    if (search) params.set('search', search);

    const url = `/api/services${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load services');
    const data: { services: Service[]; total: number } = await res.json();
    return data.services;
  }, [category, subCategory, subSubCategory, search]);

  // Create cache key based on params (exclude search for caching)
  const cacheKey = `swr:services:${category || 'all'}:${subCategory || 'all'}:${subSubCategory || 'all'}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Service[]>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false, // Reduce flicker
      revalidateOnReconnect: true,
      revalidateOnMount: true, // Always get fresh data
      dedupingInterval: 1000,
      cacheTime: 60 * 1000, // 1 minute cache
      fallbackData: [],
    }
  );

  return {
    services: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
