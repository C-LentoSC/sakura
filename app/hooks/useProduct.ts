/**
 * Custom hook for fetching a single product by ID with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product } from './useProducts';

export function useProduct(productId: number | null, language: 'en' | 'ja') {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all products and find the one we need
      const res = await fetch(`/api/products?lang=${language}`);
      if (!res.ok) throw new Error('Failed to load products');
      const data: { products: Product[] } = await res.json();
      const foundProduct = data.products.find((p) => p.id === productId);
      setProduct(foundProduct || null);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId, language]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchProduct,
  };
}
