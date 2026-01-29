/**
 * Schema definitions for Category pages content
 * All category page content is data-driven and backend-ready
 */

export type CategoryPageKey = 'shop' | 'new' | 'sale' | 'diffusers' | 'oils' | 'sprays' | 'candles' | 'perfumes' | 'voyage';

export interface CategoryPageMetadata {
  seo: {
    title: string;
    description: string;
    canonicalPath?: string;
  };
  header: {
    eyebrow?: string;
    title: string;
    description: string;
  };
  backgroundImagePrompt: string;
}

export interface CategoryPageUIContent {
  toolbar: {
    showingResults: string;
    filtersButton: string;
  };
  emptyState: {
    noProducts: string;
    clearFilters: string;
    resetCollection: string;
    viewAllDestinations: string;
  };
  sections?: {
    bestSellers?: {
      title: string;
      description: string;
    };
    findYourScent?: {
      title: string;
      description: string;
    };
    olfactoryNotes?: {
      title: string;
      description: string;
    };
    exploreByDestination?: {
      title: string;
      description: string;
    };
  };
}

export interface CategoryFilterOption {
  id: string;
  label: string;
  color?: string;
  imagePrompt?: string;
}

export interface CategoryPageConfig {
  metadata: CategoryPageMetadata;
  ui: CategoryPageUIContent;
  filterCategory?: string | null; // Category to filter products by (null means no category filter)
  filters?: {
    scentFamilies?: CategoryFilterOption[];
    scentProfiles?: CategoryFilterOption[];
    destinations?: CategoryFilterOption[];
    categories?: string[];
  };
  featuredContent?: {
    title: string;
    subtitle?: string;
    description: string;
    ctaLabel: string;
    imagePrompt: string;
  };
  guideContent?: {
    title: string;
    subtitle?: string;
    items: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    ctaLabel?: string;
  };
  concentrationGuide?: {
    title: string;
    subtitle?: string;
    items: Array<{
      name: string;
      concentration: string;
      description: string;
      isStandard?: boolean;
    }>;
  };
}

export interface CategoryPagesConfig {
  shop: CategoryPageConfig;
  new: CategoryPageConfig;
  sale: CategoryPageConfig;
  diffusers: CategoryPageConfig;
  oils: CategoryPageConfig;
  sprays: CategoryPageConfig;
  candles: CategoryPageConfig;
  perfumes: CategoryPageConfig;
  voyage: CategoryPageConfig;
}
