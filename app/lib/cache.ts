/**
 * In-Memory Cache Manager with TTL Support
 * Implements SWR (Stale-While-Revalidate) pattern
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  revalidating?: boolean;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: number; // Additional time to serve stale content while revalidating
}

class CacheManager {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = 30 * 60 * 1000; // 30 minutes default
  private defaultSWR: number = 60 * 60 * 1000; // 60 minutes stale-while-revalidate

  /**
   * Get cached data if available and fresh
   */
  get<T>(key: string, options?: CacheOptions): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const ttl = options?.ttl ?? this.defaultTTL;
    const swr = options?.staleWhileRevalidate ?? this.defaultSWR;
    const age = Date.now() - entry.timestamp;

    // If within TTL, return fresh data
    if (age < ttl) {
      return entry.data as T;
    }

    // If within SWR window, return stale data (caller should revalidate)
    if (age < ttl + swr) {
      return entry.data as T;
    }

    // Data is too old, delete and return null
    this.cache.delete(key);
    return null;
  }

  /**
   * Check if cached data is stale (needs revalidation)
   */
  isStale(key: string, options?: CacheOptions): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;

    const ttl = options?.ttl ?? this.defaultTTL;
    const age = Date.now() - entry.timestamp;

    return age >= ttl;
  }

  /**
   * Check if cache is currently revalidating
   */
  isRevalidating(key: string): boolean {
    const entry = this.cache.get(key);
    return entry?.revalidating ?? false;
  }

  /**
   * Set revalidating flag
   */
  setRevalidating(key: string, revalidating: boolean): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.revalidating = revalidating;
    }
  }

  /**
   * Set cache data
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      revalidating: false,
    });
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate cache keys matching a pattern
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean expired entries (called periodically)
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = this.defaultTTL + this.defaultSWR;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const cacheManager = new CacheManager();

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => cacheManager.cleanup(), 10 * 60 * 1000);
}

export default cacheManager;
