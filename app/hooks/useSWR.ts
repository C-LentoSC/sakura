/**
 * Custom SWR (Stale-While-Revalidate) Hook
 * Cache-first with background revalidation and optimistic updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface SWRConfig<T> {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  revalidateOnMount?: boolean; // Always revalidate on mount
  dedupingInterval?: number; // Deduplication interval in ms
  fallbackData?: T;
  cacheTime?: number; // Cache validity time in ms (default 2 min)
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

// Track if initial fetch has been done per key
const initialFetchDone = new Map<string, boolean>();

// Track revalidation callbacks for each key (for cache invalidation)
const revalidationCallbacks = new Map<string, () => void>();

// Storage helpers - shorter cache time for freshness
const STORAGE_CACHE_TIME = 2 * 60 * 1000; // 2 minutes

const getFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    // Cache for 2 minutes only
    if (Date.now() - parsed.timestamp < STORAGE_CACHE_TIME) {
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
    revalidateOnFocus = false, // Changed: disable by default to reduce flicker
    revalidateOnReconnect = true,
    revalidateOnMount = true, // Always fetch fresh on mount
    dedupingInterval = 2000,
    fallbackData,
    cacheTime = 2 * 60 * 1000, // 2 minutes default
  } = config || {};

  // Initialize state from cache (sync, no flicker)
  const [data, setData] = useState<T | undefined>(() => {
    if (!key) return fallbackData;
    // Try memory cache first
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data as T;
    }
    // Try localStorage
    const stored = getFromStorage<T>(key);
    if (stored) {
      cache.set(key, { data: stored, timestamp: Date.now() });
      return stored;
    }
    return fallbackData;
  });

  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!key) return false;
    // Only show loading if we don't have any cached data
    const cached = cache.get(key);
    const stored = getFromStorage<T>(key);
    return !cached && !stored && !fallbackData;
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetcherRef = useRef(fetcher);
  const keyRef = useRef(key);
  const mountedRef = useRef(true);

  useEffect(() => {
    fetcherRef.current = fetcher;
    keyRef.current = key;
  }, [fetcher, key]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

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

        // Only update if component is still mounted and key hasn't changed
        if (mountedRef.current && keyRef.current === currentKey) {
          setData(freshData);
          cache.set(currentKey, { data: freshData, timestamp: Date.now() });
          setToStorage(currentKey, freshData);
          setError(undefined);
          
          // Notify all subscribers
          subscribers.get(currentKey)?.forEach(cb => cb(freshData));
        }

        return freshData;
      } catch (err) {
        if (mountedRef.current && keyRef.current === currentKey) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
        throw err;
      } finally {
        if (mountedRef.current && keyRef.current === currentKey) {
          setIsLoading(false);
          setIsValidating(false);
        }
        revalidationPromises.delete(currentKey);
      }
    })();

    revalidationPromises.set(currentKey, promise);
    return promise;
  }, []);

  // Register revalidation callback for cache invalidation (after revalidate is defined)
  useEffect(() => {
    if (!key) return;
    
    revalidationCallbacks.set(key, () => {
      revalidate(false);
    });
    
    return () => {
      revalidationCallbacks.delete(key);
    };
  }, [key, revalidate]);

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

  // Initial fetch and revalidation - SIMPLIFIED to prevent double fetch
  useEffect(() => {
    if (!key || !fetcher) return;

    // Check if we should fetch
    const cached = cache.get(key);
    const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
    const hasFreshCache = cacheAge < dedupingInterval;

    // If we already have fresh cache, skip initial fetch
    if (hasFreshCache && initialFetchDone.get(key)) {
      return;
    }

    // Mark as done to prevent duplicate fetches
    initialFetchDone.set(key, true);

    // If we have cached data, revalidate silently in background
    // If no cached data, show loading state
    if (revalidateOnMount || !data) {
      revalidate(!!data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only depend on key, not data or fetcher to prevent re-runs

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
  initialFetchDone.clear();
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
  initialFetchDone.delete(key);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
  // Trigger revalidation
  const revalidateCallback = revalidationCallbacks.get(key);
  if (revalidateCallback) {
    revalidateCallback();
  }
}

// Helper: Invalidate cache by prefix (e.g., 'swr:services' to clear all services cache)
export function invalidateCacheByPrefix(prefix: string) {
  const keysToInvalidate: string[] = [];
  
  // Clear memory cache
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
      initialFetchDone.delete(key);
      keysToInvalidate.push(key);
    }
  }
  // Clear localStorage
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
        if (!keysToInvalidate.includes(key)) {
          keysToInvalidate.push(key);
        }
      }
    });
  }
  
  // Trigger revalidation for all affected keys
  keysToInvalidate.forEach(key => {
    const revalidateCallback = revalidationCallbacks.get(key);
    if (revalidateCallback) {
      revalidateCallback();
    }
  });
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
