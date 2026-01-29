import { PRODUCTS } from '@/lib/data';
import { slugify } from '@/lib/utils';
import type { CatalogProduct } from './types';

export function getCatalogProducts() {
  return PRODUCTS as unknown as CatalogProduct[];
}

export function getProductBySlug(slug: string | undefined) {
  if (!slug) return null;
  const candidates = getCatalogProducts();
  const direct = candidates.find((p) => p.id === slug);
  if (direct) return direct;
  return candidates.find((p) => slugify(p.name) === slug) ?? null;
}

export function extractCoverage(text: string | undefined) {
  if (!text) return null;
  const match = text.match(/covers?\s+(?:up to\s+)?([0-9,]+)\s*(?:sq\s*ft|sqft)/i);
  if (!match?.[1]) return null;
  return `${match[1]} sqft`;
}

export function getProductImages(product: CatalogProduct | null) {
  if (!product) return [];
  const images = [product.image];
  return images.concat([product.image, product.image, product.image].slice(0, 4));
}

export function getRelatedProducts(product: CatalogProduct | null) {
  if (!product) return [];
  return getCatalogProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
}

