/**
 * Hook for accessing Search configuration
 * Provides typed access to all search-related content and utilities
 */

import { useMemo } from 'react';
import { SearchService } from '@/services/search/search.service';

export function useSearchConfig() {
  return useMemo(() => {
    const config = SearchService.getSearchConfig();
    
    return {
      ...config,
      // Expose service methods for convenience
      loadRecentlyViewed: SearchService.loadRecentlyViewed,
      rankBestSellers: SearchService.rankBestSellers,
      filterProductsByQuery: SearchService.filterProductsByQuery,
    };
  }, []);
}
