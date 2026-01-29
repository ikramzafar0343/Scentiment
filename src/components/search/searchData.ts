/**
 * @deprecated Use SearchService from @/services/search/search.service instead
 * This file is kept for backward compatibility but will be removed in a future version
 */

import { SearchService } from '@/services/search/search.service';

export const POPULAR_SEARCHES = SearchService.getPopularSearches();

export const loadRecentlyViewed = SearchService.loadRecentlyViewed;
export const rankBestSellers = SearchService.rankBestSellers;
export const filterProductsByQuery = SearchService.filterProductsByQuery;

