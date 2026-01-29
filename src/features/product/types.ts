import type { Product } from '@/store/useCartStore';

export type CatalogProduct = Product & {
  description?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  saveAmount?: number | null;
  badge?: string;
  variants?: string[];
};

