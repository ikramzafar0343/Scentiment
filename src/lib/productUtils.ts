import type { SortOption } from '@/hooks/useProductFilters';

const SORT_FUNCTIONS: Record<SortOption, (a: { price: number }, b: { price: number }) => number> = {
  'featured': () => 0, // Keep original order
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'newest': () => 0, // Will be handled by reversing
};

export function sortProducts<TProduct extends { price: number }>(
  products: TProduct[],
  sortBy: SortOption
): TProduct[] {
  const sorted = [...products];
  
  if (sortBy === 'newest') {
    return sorted.reverse();
  }
  
  const sortFn = SORT_FUNCTIONS[sortBy] || SORT_FUNCTIONS.featured;
  return sorted.sort(sortFn);
}
