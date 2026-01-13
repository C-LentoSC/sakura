/**
 * Custom hook for fetching service categories with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data: { categories: Category[] } = await res.json();
      setCategories(data.categories || []);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchCategories,
  };
}
