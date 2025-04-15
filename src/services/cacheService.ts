import { DescriptionLanguage } from '@/contexts/GameContext';

/**
 * Interface for cache item
 */
interface CacheItem<T> {
  value: T;
  expiresAt: number; // Timestamp when this item expires
}

/**
 * Cache key format: "{word}:{language}"
 */
const formatCacheKey = (word: string, language: DescriptionLanguage): string => {
  return `${word.toLowerCase()}:${language}`;
};

/**
 * Cache service for storing word descriptions
 */
class DescriptionCacheService {
  private cache: Map<string, CacheItem<string>> = new Map();
  private defaultTtlMs: number; // Time to live in milliseconds

  constructor(ttlMinutes = 30) { // Default TTL: 30 minutes
    this.defaultTtlMs = ttlMinutes * 60 * 1000;
  }

  /**
   * Add an item to the cache
   * @param word The word to cache
   * @param language The language of the description
   * @param description The description to cache
   * @param ttlMs Optional custom TTL in milliseconds
   */
  add(word: string, language: DescriptionLanguage, description: string, ttlMs?: number): void {
    const key = formatCacheKey(word, language);
    const expiresAt = Date.now() + (ttlMs || this.defaultTtlMs);
    
    this.cache.set(key, {
      value: description,
      expiresAt
    });
    
    console.log(`Cache: Added ${key}`);
  }

  /**
   * Get an item from the cache
   * @param word The word to look up
   * @param language The language of the description
   * @returns The cached description or null if not found or expired
   */
  get(word: string, language: DescriptionLanguage): string | null {
    const key = formatCacheKey(word, language);
    const item = this.cache.get(key);
    
    // Check if item exists and is not expired
    if (item && item.expiresAt > Date.now()) {
      console.log(`Cache: Hit for ${key}`);
      return item.value;
    }
    
    // If item is expired, remove it
    if (item) {
      console.log(`Cache: Expired for ${key}`);
      this.cache.delete(key);
    } else {
      console.log(`Cache: Miss for ${key}`);
    }
    
    return null;
  }

  /**
   * Check if an item exists in the cache and is not expired
   * @param word The word to check
   * @param language The language of the description
   * @returns True if the item exists and is not expired
   */
  has(word: string, language: DescriptionLanguage): boolean {
    const key = formatCacheKey(word, language);
    const item = this.cache.get(key);
    
    if (item && item.expiresAt > Date.now()) {
      return true;
    }
    
    // Clean up expired item
    if (item) {
      this.cache.delete(key);
    }
    
    return false;
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    console.log('Cache: Cleared all entries');
  }

  /**
   * Get the number of items in the cache
   */
  size(): number {
    // Clean up expired items first to get accurate count
    this.cleanExpired();
    return this.cache.size;
  }

  /**
   * Clean up expired items
   */
  cleanExpired(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt <= now) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`Cache: Cleaned up ${expiredCount} expired entries`);
    }
  }
}

// Create a singleton instance
const descriptionCache = new DescriptionCacheService();

export default descriptionCache; 