/**
 * Schema definitions for Search functionality
 * All search-related content is data-driven and backend-ready
 */

export interface SearchConfig {
  popularSearches: string[];
  ui: {
    placeholder: string;
    labels: {
      popularSearches: string;
      results: string;
      recentlyViewed: string;
      bestSeller: string;
      noResults: string;
      noProducts: string;
    };
  };
  limits: {
    maxResults: number;
    maxRecentlyViewed: number;
    maxBestSellers: number;
  };
}
