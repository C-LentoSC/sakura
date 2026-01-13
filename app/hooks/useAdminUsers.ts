/**
 * Custom hook for admin users management with SWR caching
 * Includes optimistic CRUD operations for instant UI updates
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: string;
  _count?: {
    sessions: number;
  };
}

const CACHE_KEY = 'swr:admin-users';

export function useAdminUsers() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to load users');
    const data = await res.json();
    return data.users || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<AdminUser[]>(
    CACHE_KEY,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      fallbackData: [],
    }
  );

  // Optimistic update user role
  const updateUserRole = useCallback(async (id: string, role: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(u => u.id === id ? { ...u, role } : u), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      
      if (!res.ok) throw new Error('Failed to update user');
      
      // Background sync
      mutate(undefined, true);
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic delete user
  const deleteUser = useCallback(async (id: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => (current || []).filter(u => u.id !== id), false);
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete user');
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic update user
  const updateUser = useCallback(async (id: string, userData: Partial<AdminUser>) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(u => u.id === id ? { ...u, ...userData } : u), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!res.ok) throw new Error('Failed to update user');
      
      mutate(undefined, true);
      return true;
    } catch (error) {
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  return {
    users: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
    // Optimistic CRUD helpers
    updateUserRole,
    deleteUser,
    updateUser,
  };
}
