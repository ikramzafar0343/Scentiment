export const PRODUCT_CATEGORIES = [
  'Diffusers',
  'Diffuser Oils',
  'Room Sprays',
  'Candles',
  'Perfumes',
  'Scent Voyage',
] as const;

export const PRODUCT_BADGES = ['SALE', 'NEW', 'BESTSELLER', 'LIMITED'] as const;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
] as const;

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 2000];

export const CANDLE_PRICE_RANGE: [number, number] = [0, 500];
