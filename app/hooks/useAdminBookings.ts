/**
 * Custom hook for admin bookings management with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';

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
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bookings');
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

  // Update booking status
  const updateBookingStatus = useCallback(async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error('Failed to update booking');
      
      // Refetch to get fresh data
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }, [fetchBookings]);

  // Delete booking
  const deleteBooking = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete booking');
      
      // Refetch to get fresh data
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }, [fetchBookings]);

  // Create booking
  const createBooking = useCallback(async (bookingData: Omit<AdminBooking, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      if (!res.ok) throw new Error('Failed to create booking');
      
      // Refetch to get fresh data
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }, [fetchBookings]);

  return {
    bookings,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchBookings,
    // CRUD helpers
    updateBookingStatus,
    deleteBooking,
    createBooking,
  };
}
