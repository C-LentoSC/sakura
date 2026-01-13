/**
 * Custom hook for fetching services with direct fetch (no caching)
 */

import { useState, useEffect, useCallback } from 'react';

export interface ServiceCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
}

export interface ServiceSubCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
}

export interface ServiceSubSubCategory {
  id: string;
  slug: string;
  nameKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
}

export interface Service {
  id: string;
  nameKey: string;
  descKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  descEn?: string | null;
  descJa?: string | null;
  price: number;
  duration: string;
  image: string;
  order?: number;
  isActive?: boolean;
  category: ServiceCategory;
  subCategory?: ServiceSubCategory;
  subSubCategory?: ServiceSubSubCategory;
}

interface UseServicesOptions {
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  search?: string;
}

export function useServices(options: UseServicesOptions = {}) {
  const { category, subCategory, subSubCategory, search } = options;
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (subCategory && subCategory !== 'all') params.set('subCategory', subCategory);
      if (subSubCategory && subSubCategory !== 'all') params.set('subSubCategory', subSubCategory);
      if (search) params.set('search', search);

      const url = `/api/services${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load services');
      const data: { services: Service[]; total: number } = await res.json();
      setServices(data.services || []);
      setError(undefined);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, subCategory, subSubCategory, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    error,
    isLoading,
    isValidating: false,
    refetch: fetchServices,
  };
}
