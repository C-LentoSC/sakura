/**
 * Custom hook for admin categories management with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Category } from './useCategories';

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
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

  // Create category
  const createCategory = useCallback(async (categoryData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      
      if (!res.ok) throw new Error('Failed to create category');
      
      // Refetch to get fresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }, [fetchCategories]);

  // Update category
  const updateCategory = useCallback(async (id: string, categoryData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...categoryData }),
      });
      
      if (!res.ok) throw new Error('Failed to update category');
      
      // Refetch to get fresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }, [fetchCategories]);

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete category');
      
      // Refetch to get fresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }, [fetchCategories]);

  // Create subcategory
  const createSubCategory = useCallback(async (categoryId: string, subCategoryData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subCategoryData, categoryId }),
      });
      
      if (!res.ok) throw new Error('Failed to create subcategory');
      
      // Refetch to get fresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error creating subcategory:', error);
      throw error;
    }
  }, [fetchCategories]);

  // Delete subcategory
  const deleteSubCategory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subcategories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete subcategory');
      
      // Refetch to get fresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  }, [fetchCategories]);

  // Delete sub-subcategory
  const deleteSubSubCategory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subsubcategories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete sub-subcategory');
      
      // Refetch to get fresh data
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error deleting sub-subcategory:', error);
      throw error;
    }
  }, [fetchCategories]);

  return {
    categories,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchCategories,
    // CRUD helpers
    createCategory,
    updateCategory,
    deleteCategory,
    createSubCategory,
    deleteSubCategory,
    deleteSubSubCategory,
  };
}
