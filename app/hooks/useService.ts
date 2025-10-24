/**
 * Custom hook for fetching a single service by ID with SWR caching
 */

import { useCallback } from 'react';
import { useSWR } from './useSWR';
import type { Service } from './useServices';

export function useService(serviceId: string | null) {
  const fetcher = useCallback(async () => {
    if (!serviceId) return null;

    const res = await fetch(`/api/services/${serviceId}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to load service');
    }
    const data: Service = await res.json();
    return data;
  }, [serviceId]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Service | null>(
    serviceId ? `swr:service:${serviceId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      fallbackData: null,
    }
  );

  return {
    service: data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
