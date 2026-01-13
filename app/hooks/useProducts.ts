/**
 * Custom hook for fetching products with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?lang=${language}`);
      if (!res.ok) throw new Error('Failed to load products');
      const data: { products: Product[] } = await res.json();
      setProducts(data.products || []);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchProducts,
  };
}
