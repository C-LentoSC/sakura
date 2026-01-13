/**
 * Custom hook for fetching a single service by ID with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';
import type { Service } from './useServices';

export function useService(serviceId: string | null) {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchService = useCallback(async () => {
    if (!serviceId) {
      setService(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/services/${serviceId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setService(null);
          setError(undefined);
          return;
        }
        throw new Error('Failed to load service');
      }
      const data: Service = await res.json();
      setService(data);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setService(null);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return {
    service,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchService,
  };
}
