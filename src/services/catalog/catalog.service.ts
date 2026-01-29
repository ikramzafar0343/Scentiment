import type { CatalogProduct } from '@/features/catalog/types';
import { PRODUCT_SEED } from '@/data/catalog/products.seed';
import { adaptCatalogProduct } from './catalog.adapter';
import { apiService } from '@/services/api/api.service';

/**
 * API-ready service. Fetches from backend, falls back to seed data if API fails.
 */
export const catalogService = {
  async getProducts(forceRefresh = false): Promise<CatalogProduct[]> {
    try {
      // Try to fetch from API with optional cache busting
      // Note: getProducts signature is (page = 1, limit = 100, token?: string, cacheBust = false)
      const products = await apiService.getProducts(1, 100, undefined, forceRefresh);
      
      // Transform API products to CatalogProduct format
      return products.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || '',
        category: product.category,
        description: product.description,
        rating: product.rating,
        reviews: product.reviews || 0,
        badge: product.badge,
        isNew: product.isNew || false,
        variants: product.variants || [],
        customButtonText: product.customButtonText,
        flashSale: product.flashSale ? {
          code: product.flashSale.code,
          endTime: product.flashSale.endTime,
        } : undefined,
        saveAmount: product.originalPrice ? product.originalPrice - product.price : undefined,
      })) as CatalogProduct[];
    } catch (error) {
      console.warn('Failed to fetch products from API, using seed data:', error);
      // Fallback to seed data
      return PRODUCT_SEED.map(adaptCatalogProduct);
    }
  },
};

