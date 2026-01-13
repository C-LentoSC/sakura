/**
 * Custom hook for fetching user bookings with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/my-bookings', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchBookings,
  };
}
