import { aiImageUrl } from '@/lib/images';
import { PRODUCT_SEED, SAMPLE_PRODUCT_IMAGE_PROMPT } from '@/data/catalog/products.seed';
import { adaptCatalogProduct } from '@/services/catalog/catalog.adapter';
import { catalogService } from '@/services/catalog/catalog.service';

/**
 * Backwards-compatible exports.
 * NOTE: Source of truth lives in `src/data/catalog` + `src/services/catalog`.
 * 
 * WARNING: PRODUCTS is now async. Use useCatalogProducts() hook in components instead.
 */
export const SAMPLE_PRODUCT_IMAGE = aiImageUrl(SAMPLE_PRODUCT_IMAGE_PROMPT);

// Fallback to seed data for synchronous access (legacy support)
export const PRODUCTS = PRODUCT_SEED.map(adaptCatalogProduct);

// Async function to get products from API
export async function getProducts() {
  return catalogService.getProducts();
}
