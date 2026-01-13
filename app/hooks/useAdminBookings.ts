/**
 * Custom hook for admin bookings management with SWR caching
 * Includes optimistic CRUD operations for instant UI updates
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export interface AdminBooking {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string | null;
  status: string;
  createdAt: string;
}

const CACHE_KEY = 'swr:admin-bookings';

export function useAdminBookings() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/bookings');
    if (!res.ok) throw new Error('Failed to load bookings');
    const data = await res.json();
    return data.bookings || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<AdminBooking[]>(
    CACHE_KEY,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      fallbackData: [],
    }
  );

  // Optimistic update booking status
  const updateBookingStatus = useCallback(async (id: string, status: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => 
      (current || []).map(b => b.id === id ? { ...b, status } : b), 
      false
    );
    
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error('Failed to update booking');
      
      // Background sync
      mutate(undefined, true);
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic delete booking
  const deleteBooking = useCallback(async (id: string) => {
    const previousData = data;
    
    // Instant UI update
    mutate((current) => (current || []).filter(b => b.id !== id), false);
    
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete booking');
      return true;
    } catch (error) {
      // Rollback on error
      mutate(previousData, false);
      throw error;
    }
  }, [data, mutate]);

  // Optimistic create booking
  const createBooking = useCallback(async (bookingData: Omit<AdminBooking, 'id' | 'createdAt'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticBooking: AdminBooking = {
      id: tempId,
      ...bookingData,
      createdAt: new Date().toISOString(),
    };
    
    // Instant UI update
    mutate((current) => [optimisticBooking, ...(current || [])], false);
    
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      if (!res.ok) throw new Error('Failed to create booking');
      
      // Background revalidation to get real ID
      mutate(undefined, true);
      return true;
    } catch (error) {
      // Rollback on error
      mutate((current) => (current || []).filter(b => b.id !== tempId), false);
      throw error;
    }
  }, [mutate]);

  return {
    bookings: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
    // Optimistic CRUD helpers
    updateBookingStatus,
    deleteBooking,
    createBooking,
  };
}
