/**
 * Custom hook for fetching a single product by ID with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';
import type { Product } from './useProducts';

export function useProduct(productId: number | null, language: 'en' | 'ja') {
  const fetcher = useCallback(async () => {
    if (!productId) return null;

    // Fetch all products and find the one we need (reuses existing cache)
    const res = await fetch(`/api/products?lang=${language}`);
    if (!res.ok) throw new Error('Failed to load products');
    const data: { products: Product[] } = await res.json();
    const product = data.products.find((p) => p.id === productId);
    return product || null;
  }, [productId, language]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Product | null>(
    productId ? `swr:product:${productId}:${language}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      fallbackData: null,
    }
  );

  return {
    product: data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
