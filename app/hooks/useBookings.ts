/**
 * Custom hook for fetching user bookings with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';

export interface Booking {
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
  service?: {
    id: string;
    nameKey: string;
    nameEn?: string | null;
    nameJa?: string | null;
    price: number;
    duration: string;
    image: string;
  };
}

export function useBookings() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/my-bookings');
    if (!res.ok) throw new Error('Failed to load bookings');
    const data = await res.json();
    return data.bookings || [];
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Booking[]>(
    'swr:my-bookings',
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
