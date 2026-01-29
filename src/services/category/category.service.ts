/**
 * Service layer for Category pages content
 * Provides access to category page configuration data
 */

import { CATEGORY_PAGES_CONFIG } from '@/configs/category/category.config';
import type { CategoryPagesConfig, CategoryPageKey } from '@/configs/category/category.schema';
import { aiImageUrl } from '@/lib/images';

export class CategoryService {
  /**
   * Get complete category pages configuration
   */
  static getCategoryPagesConfig(): CategoryPagesConfig {
    return CATEGORY_PAGES_CONFIG;
  }

  /**
   * Get configuration for a specific category page
   */
  static getCategoryPageConfig(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key];
  }

  /**
   * Get SEO metadata for a category page
   */
  static getCategorySEO(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].metadata.seo;
  }

  /**
   * Get header content for a category page
   */
  static getCategoryHeader(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].metadata.header;
  }

  /**
   * Get background image URL for a category page
   */
  static getCategoryBackgroundImage(key: CategoryPageKey, size: 'landscape_16_9' | 'square' = 'landscape_16_9'): string {
    const prompt = CATEGORY_PAGES_CONFIG[key].metadata.backgroundImagePrompt;
    return aiImageUrl(prompt, size);
  }

  /**
   * Get UI labels for category pages
   */
  static getCategoryUI(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].ui;
  }

  /**
   * Get filter options for a category page
   */
  static getCategoryFilters(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].filters;
  }

  /**
   * Get featured content for a category page
   */
  static getCategoryFeaturedContent(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].featuredContent;
  }

  /**
   * Get guide content for a category page
   */
  static getCategoryGuideContent(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].guideContent;
  }

  /**
   * Get concentration guide for perfumes page
   */
  static getCategoryConcentrationGuide(key: CategoryPageKey) {
    return CATEGORY_PAGES_CONFIG[key].concentrationGuide;
  }

  /**
   * Resolve destination image URL from prompt
   */
  static resolveDestinationImage(prompt: string, size: 'square' | 'landscape_16_9' = 'square'): string {
    return aiImageUrl(prompt, size);
  }
}
