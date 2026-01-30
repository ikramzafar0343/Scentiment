/**
 * Service layer for Search functionality
 * Provides access to search configuration and utility functions
 */

import { SEARCH_CONFIG } from '@/configs/search/search.config';
import type { SearchConfig } from '@/configs/search/search.schema';
import type { SearchProduct } from '@/components/search/types';

export class SearchService {
  /**
   * Get complete search configuration
   */
  static getSearchConfig(): SearchConfig {
    return SEARCH_CONFIG;
  }

  /**
   * Get popular search terms
   */
  static getPopularSearches(): string[] {
    return SEARCH_CONFIG.popularSearches;
  }

  /**
   * Get search UI labels
   */
  static getUILabels() {
    return SEARCH_CONFIG.ui.labels;
  }

  /**
   * Get search placeholder text
   */
  static getPlaceholder(): string {
    return SEARCH_CONFIG.ui.placeholder;
  }

  /**
   * Get search limits
   */
  static getLimits() {
    return SEARCH_CONFIG.limits;
  }

  /**
   * Load recently viewed products from localStorage
   */
  static loadRecentlyViewed(products: SearchProduct[]): SearchProduct[] {
    try {
      const raw = window.localStorage.getItem('aromazur-recently-viewed');
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      const map = new Map(products.map((p) => [p.id, p] as const));
      const limit = SEARCH_CONFIG.limits.maxRecentlyViewed;
      return ids.map((id) => map.get(id)).filter(Boolean).slice(0, limit) as SearchProduct[];
    } catch {
      return [];
    }
  }

  /**
   * Rank products by reviews and rating to find best sellers
   */
  static rankBestSellers(products: SearchProduct[]): SearchProduct[] {
    const limit = SEARCH_CONFIG.limits.maxBestSellers;
    return [...products]
      .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0) || (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit);
  }

  /**
   * Filter products by search query
   */
  static filterProductsByQuery(products: SearchProduct[], query: string): SearchProduct[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const limit = SEARCH_CONFIG.limits.maxResults;
    return products
      .filter((p) => `${p.name} ${p.category} ${p.description ?? ''}`.toLowerCase().includes(q))
      .slice(0, limit);
  }
}
