import type { Product } from '@/store/useCartStore';

/**
 * API-ready catalog product model used across pages.
 * Extends cart Product with display fields used throughout the UI.
 */
export type CatalogProduct = Product & {
  description?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  saveAmount?: number | null;
  badge?: string;
  variants?: string[];
  customButtonText?: string;
};

/**
 * Seed/raw format used by configs/services (backend-ready).
 * Avoids computed runtime values inside components.
 */
export type CatalogProductSeed = Omit<CatalogProduct, 'image' | 'flashSale'> & {
  imagePrompt?: string;
  imageUrl?: string;
  flashSale?: {
    code: string;
    /** hours from "now" to match existing behavior */
    durationHours: number;
  };
};

