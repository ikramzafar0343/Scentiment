/**
 * Search configuration
 * All hardcoded search UI content extracted from components
 */

import type { SearchConfig } from './search.schema';

export const SEARCH_CONFIG: SearchConfig = {
  popularSearches: [
    'the one',
    'day dream',
    'vanilla',
    'car',
    'lavender',
    'ocean breeze',
    'oil',
    'cleaner',
    'santal'
  ],
  ui: {
    placeholder: 'Find your scent',
    labels: {
      popularSearches: 'Popular searches',
      results: 'Results',
      recentlyViewed: 'Recently viewed',
      bestSeller: 'Best seller',
      noResults: 'No results found.',
      noProducts: 'No products.'
    }
  },
  limits: {
    maxResults: 8,
    maxRecentlyViewed: 1,
    maxBestSellers: 1
  }
};
