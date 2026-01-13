/**
 * Custom hook for admin services management with SWR caching
 * Includes optimistic CRUD operations for instant UI updates
 */

import { useCallback } from 'react';
import { useSWR, invalidateCacheByPrefix } from './useSWR';
import type { Service } from './useServices';

const CACHE_KEY = 'swr:admin:services';

export function useAdminServices() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to load services');
    const data = await res.json();
    return data.services || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Service[]>(
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

  // Optimistic create service
  const createService = useCallback(async (serviceData: Record<string, unknown>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticService = { 
      id: tempId, 
      ...serviceData,
      isActive: serviceData.isActive ?? true,
    } as Service;
    
    // Instant UI update
    mutate((current) => [...(current || []), optimisticService], false);
    
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create service');
      }
      
      // Invalidate client-side caches to show fresh data
      invalidateCacheByPrefix('swr:services');
      
      // Background revalidation to get real ID
      mutate(undefined, true);
      
      return true;
    } catch (error) {
      // Rollback on error
      mutate((current) => (current || []).filter(s => s.id !== tempId), false);
      throw error;
    }
  }, [mutate]);

  // Optimistic update service
  const updateService = useCallback(async (id: string, serviceData: Record<string, unknown>) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(s => s.id === id ? { ...s, ...serviceData } : s), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update service');
      }
      
      // Invalidate client-side caches
      invalidateCacheByPrefix('swr:services');
      
      // Background sync
      mutate(undefined, true);
      
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic toggle active status
  const toggleServiceActive = useCallback(async (id: string, isActive: boolean) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(s => s.id === id ? { ...s, isActive } : s), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      
      if (!res.ok) throw new Error('Failed to toggle service status');
      
      // Invalidate client-side caches
      invalidateCacheByPrefix('swr:services');
      
      // Background sync
      mutate(undefined, true);
      
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic delete service
  const deleteService = useCallback(async (id: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => (current || []).filter(s => s.id !== id), false);
    
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete service');
      
      // Invalidate client-side caches
      invalidateCacheByPrefix('swr:services');
      
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  return {
    services: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
    // Optimistic CRUD helpers
    createService,
    updateService,
    toggleServiceActive,
    deleteService,
  };
}
