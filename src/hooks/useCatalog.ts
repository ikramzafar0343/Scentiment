import { useState, useEffect, useCallback } from 'react';
import { catalogService } from '@/services/catalog/catalog.service';
import type { CatalogProduct } from '@/features/catalog/types';

// Global refresh trigger to force all hooks to refresh
let refreshTrigger = 0;
const refreshListeners = new Set<() => void>();

export function triggerCatalogRefresh() {
  refreshTrigger++;
  refreshListeners.forEach(listener => listener());
}

// Backward compatible version - returns just products array
export function useCatalogProducts(): CatalogProduct[] {
  const { products } = useCatalogProductsWithState();
  return products;
}

// Full version with loading, error, and refresh
export function useCatalogProductsWithState(): { products: CatalogProduct[]; loading: boolean; error: Error | null; refresh: () => Promise<void> } {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.getProducts(true); // Force refresh
      setProducts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    const listener = () => {
      if (!cancelled) {
        setRefreshKey(prev => prev + 1);
      }
    };
    
    refreshListeners.add(listener);
    
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await catalogService.getProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          console.error('Failed to load products:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
      refreshListeners.delete(listener);
    };
  }, [refreshKey]);

  return { products, loading, error, refresh };
}

