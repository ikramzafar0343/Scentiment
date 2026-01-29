import { useEffect } from 'react';
import type { CatalogProduct } from './types';

export function useRecentlyViewed(product: CatalogProduct | null) {
  useEffect(() => {
    if (!product) return;
    try {
      const key = 'scentiment-recently-viewed';
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      const next = [product.id, ...parsed.filter((id) => id !== product.id)].slice(0, 6);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      return;
    }
  }, [product]);
}

