import { aiImageUrl } from '@/lib/images';
import type { CatalogProduct, CatalogProductSeed } from '@/features/catalog/types';

export function adaptCatalogProduct(seed: CatalogProductSeed): CatalogProduct {
  const image =
    seed.imageUrl ??
    (seed.imagePrompt ? aiImageUrl(seed.imagePrompt) : aiImageUrl('premium fragrance product photography'));

  const flashSale = seed.flashSale
    ? {
        code: seed.flashSale.code,
        endTime: new Date(Date.now() + seed.flashSale.durationHours * 60 * 60 * 1000).toISOString(),
      }
    : undefined;

  return {
    ...seed,
    image,
    flashSale,
  };
}

