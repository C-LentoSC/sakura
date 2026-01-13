/**
 * Custom SWR (Stale-While-Revalidate) Hook
 * Cache-first with background revalidation and optimistic updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface SWRConfig<T> {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number; // Deduplication interval in ms
  fallbackData?: T;
}

interface SWRResponse<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T | ((current: T | undefined) => T), revalidate?: boolean) => Promise<void>;
}

// In-memory cache for client-side
const cache = new Map<string, { data: unknown; timestamp: number }>();
const revalidationPromises = new Map<string, Promise<unknown>>();

// Global mutate function for cross-component updates
const subscribers = new Map<string, Set<(data: unknown) => void>>();

// Storage helpers
const getFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    // Cache for 30 minutes
    if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
      return parsed.data;
    }
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

const setToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

export function useSWR<T>(
  key: string | null,
  fetcher: (() => Promise<T>) | null,
  config?: SWRConfig<T>
): SWRResponse<T> {
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    dedupingInterval = 2000,
    fallbackData,
  } = config || {};

  const [data, setData] = useState<T | undefined>(() => {
    if (!key) return fallbackData;
    // Try memory cache first
    const cached = cache.get(key);
    if (cached) return cached.data as T;
    // Try localStorage
    const stored = getFromStorage<T>(key);
    if (stored) {
      cache.set(key, { data: stored, timestamp: Date.now() });
      return stored;
    }
    return fallbackData;
  });

  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(!data);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetcherRef = useRef(fetcher);
  const keyRef = useRef(key);

  useEffect(() => {
    fetcherRef.current = fetcher;
    keyRef.current = key;
  }, [fetcher, key]);

  // Subscribe to global updates for this key
  useEffect(() => {
    if (!key) return;
    
    const handleUpdate = (newData: unknown) => {
      setData(newData as T);
    };
    
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key)!.add(handleUpdate);
    
    return () => {
      subscribers.get(key)?.delete(handleUpdate);
    };
  }, [key]);

  // Revalidation function
  const revalidate = useCallback(async (silently = false) => {
    if (!keyRef.current || !fetcherRef.current) return;

    const currentKey = keyRef.current;
    const currentFetcher = fetcherRef.current;

    // Deduplication: if already revalidating, return existing promise
    const existingPromise = revalidationPromises.get(currentKey);
    if (existingPromise) return existingPromise;

    if (!silently) setIsLoading(true);
    setIsValidating(true);
    setError(undefined);

    const promise = (async () => {
      try {
        const freshData = await currentFetcher();

        // Only update if key hasn't changed
        if (keyRef.current === currentKey) {
          setData(freshData);
          cache.set(currentKey, { data: freshData, timestamp: Date.now() });
          setToStorage(currentKey, freshData);
          setError(undefined);
          
          // Notify all subscribers
          subscribers.get(currentKey)?.forEach(cb => cb(freshData));
        }

        return freshData;
      } catch (err) {
        if (keyRef.current === currentKey) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
        throw err;
      } finally {
        if (keyRef.current === currentKey) {
          setIsLoading(false);
          setIsValidating(false);
        }
        revalidationPromises.delete(currentKey);
      }
    })();

    revalidationPromises.set(currentKey, promise);
    return promise;
  }, []);

  // Optimistic update (mutate) - INSTANT UI update
  const mutate = useCallback(
    async (newData?: T | ((current: T | undefined) => T), shouldRevalidate = true) => {
      if (!keyRef.current) return;

      // Optimistic update - INSTANT
      if (newData !== undefined) {
        const updatedData = typeof newData === 'function'
          ? (newData as (current: T | undefined) => T)(data)
          : newData;
        setData(updatedData);
        cache.set(keyRef.current, { data: updatedData, timestamp: Date.now() });
        setToStorage(keyRef.current, updatedData);
        
        // Notify all subscribers for cross-component sync
        subscribers.get(keyRef.current)?.forEach(cb => cb(updatedData));
      }

      // Background revalidation - NON-BLOCKING
      if (shouldRevalidate) {
        // Don't await - let it run in background
        revalidate(true).catch(console.error);
      }
    },
    [data, revalidate]
  );

  // Initial fetch and revalidation
  useEffect(() => {
    if (!key || !fetcher) return;

    // If we have cached data, revalidate in background
    if (data) {
      const cached = cache.get(key);
      const age = cached ? Date.now() - cached.timestamp : Infinity;

      // If cache is stale (> 5 minutes), revalidate
      if (age > 5 * 60 * 1000) {
        revalidate(true);
      } else if (age > dedupingInterval) {
        // If cache is older than deduping interval, revalidate silently
        setTimeout(() => revalidate(true), 0);
      }
    } else {
      // No cached data, fetch immediately
      revalidate(false);
    }
  }, [key, fetcher, dedupingInterval, data, revalidate]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus || !key) return;

    const onFocus = () => {
      const cached = cache.get(key);
      const age = cached ? Date.now() - cached.timestamp : Infinity;
      if (age > dedupingInterval) {
        revalidate(true);
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [key, revalidateOnFocus, dedupingInterval, revalidate]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect || !key) return;

    const onOnline = () => revalidate(true);

    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [key, revalidateOnReconnect, revalidate]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    if (!key) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData(parsed.data);
          cache.set(key, { data: parsed.data, timestamp: parsed.timestamp });
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

// Helper: Clear all cache
export function clearCache() {
  cache.clear();
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('swr:')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Helper: Invalidate specific cache key
export function invalidateCache(key: string) {
  cache.delete(key);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// Helper: Global mutate for optimistic updates from anywhere
export function globalMutate<T>(key: string, data: T | ((current: T | undefined) => T)) {
  const cached = cache.get(key);
  const currentData = cached?.data as T | undefined;
  const newData = typeof data === 'function' ? (data as (current: T | undefined) => T)(currentData) : data;
  
  cache.set(key, { data: newData, timestamp: Date.now() });
  setToStorage(key, newData);
  
  // Notify subscribers
  subscribers.get(key)?.forEach(cb => cb(newData));
}

// Helper: Get current cache value
export function getCacheValue<T>(key: string): T | undefined {
  return cache.get(key)?.data as T | undefined;
}
