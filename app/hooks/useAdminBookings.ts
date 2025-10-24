/**
 * Custom hook for admin bookings management with SWR caching
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

export function useAdminBookings() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/bookings');
    if (!res.ok) throw new Error('Failed to load bookings');
    const data = await res.json();
    return data.bookings || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<AdminBooking[]>(
    'swr:admin-bookings',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      fallbackData: [],
    }
  );

  return {
    bookings: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
