/**
 * Custom SWR (Stale-While-Revalidate) Hook
 * Cache-first with background revalidation
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

  // Optimistic update (mutate)
  const mutate = useCallback(
    async (newData?: T | ((current: T | undefined) => T), shouldRevalidate = false) => {
      if (!keyRef.current) return;

      // Optimistic update
      if (newData !== undefined) {
        const updatedData = typeof newData === 'function'
          ? (newData as (current: T | undefined) => T)(data)
          : newData;
        setData(updatedData);
        cache.set(keyRef.current, { data: updatedData, timestamp: Date.now() });
        setToStorage(keyRef.current, updatedData);
      }

      // Revalidate if needed
      if (shouldRevalidate) {
        await revalidate(true);
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

      // If cache is stale (> 30 minutes), revalidate
      if (age > 30 * 60 * 1000) {
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
