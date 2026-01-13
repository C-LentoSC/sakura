/**
 * Custom hook for admin services management with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Service } from './useServices';

export function useAdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to load services');
      const data = await res.json();
      setServices(data.services || []);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Create service
  const createService = useCallback(async (serviceData: Record<string, unknown>) => {
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
      
      // Refetch to get fresh data
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }, [fetchServices]);

  // Update service
  const updateService = useCallback(async (id: string, serviceData: Record<string, unknown>) => {
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
      
      // Refetch to get fresh data
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }, [fetchServices]);

  // Toggle active status
  const toggleServiceActive = useCallback(async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      
      if (!res.ok) throw new Error('Failed to toggle service status');
      
      // Refetch to get fresh data
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error toggling service status:', error);
      throw error;
    }
  }, [fetchServices]);

  // Delete service
  const deleteService = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete service');
      
      // Refetch to get fresh data
      await fetchServices();
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }, [fetchServices]);

  return {
    services,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchServices,
    // CRUD helpers
    createService,
    updateService,
    toggleServiceActive,
    deleteService,
  };
}
