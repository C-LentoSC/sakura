/**
 * Custom hook for admin categories management with SWR caching
 * Includes optimistic CRUD operations for instant UI updates
 */

import { useCallback } from 'react';
import { useSWR, invalidateCacheByPrefix } from './useSWR';
import type { Category } from './useCategories';

const CACHE_KEY = 'swr:admin-categories';

export function useAdminCategories() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    const data = await res.json();
    return data.categories || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Category[]>(
    CACHE_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      dedupingInterval: 1000,
      fallbackData: [],
    }
  );

  // Helper to invalidate all category caches
  const invalidateCategoryCaches = () => {
    invalidateCacheByPrefix('swr:categories');
  };

  // Optimistic create category
  const createCategory = useCallback(async (categoryData: Record<string, unknown>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticCategory = { id: tempId, ...categoryData, subCategories: [] } as Category;
    
    // Instant UI update
    mutate((current) => [...(current || []), optimisticCategory], false);
    
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      
      if (!res.ok) throw new Error('Failed to create category');
      
      // Invalidate client caches
      invalidateCategoryCaches();
      
      // Background revalidation to get real ID
      mutate(undefined, true);
      return true;
    } catch (error) {
      // Rollback on error
      mutate((current) => (current || []).filter(c => c.id !== tempId), false);
      throw error;
    }
  }, [mutate]);

  // Optimistic update category
  const updateCategory = useCallback(async (id: string, categoryData: Record<string, unknown>) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(c => c.id === id ? { ...c, ...categoryData } : c), 
      false
    );
    
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...categoryData }),
      });
      
      if (!res.ok) throw new Error('Failed to update category');
      
      // Invalidate client caches
      invalidateCategoryCaches();
      
      // Background sync
      mutate(undefined, true);
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic delete category
  const deleteCategory = useCallback(async (id: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => (current || []).filter(c => c.id !== id), false);
    
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete category');
      
      // Invalidate client caches
      invalidateCategoryCaches();
      
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic create subcategory
  const createSubCategory = useCallback(async (categoryId: string, subCategoryData: Record<string, unknown>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticSubCategory = { id: tempId, ...subCategoryData, subSubCategories: [] };
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(c => 
        c.id === categoryId 
          ? { ...c, subCategories: [...(c.subCategories || []), optimisticSubCategory] }
          : c
      ), 
      false
    );
    
    try {
      const res = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subCategoryData, categoryId }),
      });
      
      if (!res.ok) throw new Error('Failed to create subcategory');
      
      // Invalidate client caches
      invalidateCategoryCaches();
      
      mutate(undefined, true);
      return true;
    } catch (error) {
      mutate(undefined, true); // Revalidate to rollback
      throw error;
    }
  }, [mutate]);

  // Optimistic delete subcategory
  const deleteSubCategory = useCallback(async (id: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(c => ({
        ...c,
        subCategories: (c.subCategories || []).filter(s => s.id !== id)
      })), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/subcategories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete subcategory');
      
      // Invalidate client caches
      invalidateCategoryCaches();
      
      return true;
    } catch (error) {
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic delete sub-subcategory
  const deleteSubSubCategory = useCallback(async (id: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(c => ({
        ...c,
        subCategories: (c.subCategories || []).map(s => ({
          ...s,
          subSubCategories: (s.subSubCategories || []).filter(ss => ss.id !== id)
        }))
      })), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/subsubcategories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete sub-subcategory');
      
      // Invalidate client caches
      invalidateCategoryCaches();
      
      return true;
    } catch (error) {
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  return {
    categories: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
    // Optimistic CRUD helpers
    createCategory,
    updateCategory,
    deleteCategory,
    createSubCategory,
    deleteSubCategory,
    deleteSubSubCategory,
  };
}
