import { useMemo } from 'react';
import type { Product } from '@/store/useCartStore';
import { sortProducts } from '@/lib/productUtils';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface ProductFilters {
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: SortOption;
  customFilters?: Record<string, any>;
}

export interface UseProductFiltersOptions {
  products: Product[];
  filters: ProductFilters;
  customFilterFn?: (product: Product, filters: ProductFilters) => boolean;
}

export function useProductFilters<TProduct extends Product>({
  products,
  filters,
  customFilterFn,
}: {
  products: TProduct[];
  filters: ProductFilters;
  customFilterFn?: (product: TProduct, filters: ProductFilters) => boolean;
}) {
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply category filter
    if (filters.selectedCategory && filters.selectedCategory !== 'All Products') {
      result = result.filter((p) => p.category === filters.selectedCategory);
    }

    // Apply price filter
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Apply custom filters if provided
    if (customFilterFn) result = result.filter((p) => customFilterFn(p, filters));

    // Apply sorting
    return sortProducts(result, filters.sortBy);
  }, [products, filters, customFilterFn]);

  return filteredProducts;
}
