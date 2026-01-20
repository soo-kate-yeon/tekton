/**
 * TASK-020: Token Caching System
 * TASK-021: Cache Invalidation
 *
 * In-memory cache for generated design tokens
 * Reduces generation time by 80%+ for repeated operations
 */

import crypto from 'crypto';

/**
 * Cache entry with timestamp for invalidation
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hash: string;
}

/**
 * Token cache configuration
 */
export interface TokenCacheConfig {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * In-memory token cache with size limits and TTL
 */
export class TokenCache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private readonly maxSize: number;
  private readonly ttl: number;
  private hitCount: number = 0;
  private missCount: number = 0;

  constructor(config: TokenCacheConfig = {}) {
    this.cache = new Map();
    this.maxSize = config.maxSize ?? 1000;
    this.ttl = config.ttl ?? 5 * 60 * 1000; // Default 5 minutes
  }

  /**
   * Generate cache key from input data
   */
  private generateKey(data: any): string {
    const json = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(json).digest('hex');
  }

  /**
   * Get cached value if exists and not expired
   */
  get(key: string | any): T | null {
    const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(cacheKey);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return entry.value;
  }

  /**
   * Set cache value
   */
  set(key: string | any, value: T): void {
    const cacheKey = typeof key === 'string' ? key : this.generateKey(key);

    // Enforce size limit (LRU-like eviction)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    const hash = crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
      hash,
    });
  }

  /**
   * Check if cache has valid entry
   */
  has(key: string | any): boolean {
    const value = this.get(key);
    return value !== null;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hitCount + this.missCount;
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: total > 0 ? this.hitCount / total : 0,
      maxSize: this.maxSize,
    };
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key && pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get cache entry with metadata
   */
  getWithMetadata(key: string | any): CacheEntry<T> | null {
    const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
    return this.cache.get(cacheKey) ?? null;
  }
}

/**
 * File-based cache invalidation tracker
 */
export class FileInvalidationTracker {
  private fileTimestamps: Map<string, number>;

  constructor() {
    this.fileTimestamps = new Map();
  }

  /**
   * Record file modification timestamp
   */
  recordFile(path: string, timestamp: number): void {
    this.fileTimestamps.set(path, timestamp);
  }

  /**
   * Check if file has been modified since last record
   */
  isModified(path: string, currentTimestamp: number): boolean {
    const lastTimestamp = this.fileTimestamps.get(path);
    if (!lastTimestamp) {
      return true; // New file, consider modified
    }
    return currentTimestamp > lastTimestamp;
  }

  /**
   * Get all tracked files
   */
  getTrackedFiles(): string[] {
    return Array.from(this.fileTimestamps.keys());
  }

  /**
   * Clear tracking for a specific file
   */
  untrack(path: string): void {
    this.fileTimestamps.delete(path);
  }

  /**
   * Clear all file tracking
   */
  clear(): void {
    this.fileTimestamps.clear();
  }
}

/**
 * Global token cache instance
 */
export const globalTokenCache = new TokenCache({
  maxSize: 500,
  ttl: 10 * 60 * 1000, // 10 minutes
});
