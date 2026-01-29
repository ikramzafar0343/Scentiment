/**
 * Hook for accessing Category page configuration
 * Provides typed access to all category page content
 */

import { useMemo } from 'react';
import { CategoryService } from '@/services/category/category.service';
import type { CategoryPageKey } from '@/configs/category/category.schema';

export function useCategoryConfig(key: CategoryPageKey) {
  return useMemo(() => {
    const config = CategoryService.getCategoryPageConfig(key);

    return {
      ...config,
      // Helper to resolve background images
      getBackgroundImage: (size: 'landscape_16_9' | 'square' = 'landscape_16_9') => {
        return CategoryService.getCategoryBackgroundImage(key, size);
      },
      // Helper to resolve destination images
      resolveDestinationImage: (prompt: string, size: 'square' | 'landscape_16_9' = 'square') => {
        return CategoryService.resolveDestinationImage(prompt, size);
      },
    };
  }, [key]);
}
