/**
 * Custom hook for fetching products with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export type Product = {
  id: number;
  name: string;
  nameEn: string;
  nameJa: string;
  category: string;
  description: string;
  descEn: string;
  descJa: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock: boolean;
  badge: string | null;
  badgeType: string | null;
};

interface UseProductsOptions {
  language: 'en' | 'ja';
}

export function useProducts({ language }: UseProductsOptions) {
  const fetcher = useCallback(async () => {
    const res = await fetch(`/api/products?lang=${language}`);
    if (!res.ok) throw new Error('Failed to load products');
    const data: { products: Product[] } = await res.json();
    return data.products;
  }, [language]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Product[]>(
    `swr:products:${language}`,
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
    products: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
