import { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiSearch, HiX } from 'react-icons/hi';
import { formatPrice } from '@/lib/utils';
import type { SearchProduct } from './types';
import { useSearchConfig } from '@/hooks/useSearchConfig';

function SearchChip({ value, onSelect }: { value: string; onSelect: (value: string) => void }) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);
  return (
    <button
      type="button"
      className="ui-focus-ring rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-800 hover:bg-gray-200"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

function SearchResultItem({
  product,
  onSelect
}: {
  product: SearchProduct;
  onSelect: (product: SearchProduct) => void;
}) {
  const handleClick = useCallback(() => onSelect(product), [onSelect, product]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className="ui-focus-ring group flex items-center gap-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-left hover:bg-white"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-16 w-16 rounded-xl object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {product.category}
        </div>
        <div className="mt-1 truncate text-sm font-semibold text-gray-900">{product.name}</div>
        <div className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</div>
      </div>
    </button>
  );
}

function FeaturedProductCard({
  product,
  title,
  underline,
  noProductsLabel,
  onSelect
}: {
  product: SearchProduct | undefined;
  title: string;
  underline?: boolean;
  noProductsLabel: string;
  onSelect: (product: SearchProduct) => void;
}) {
  const hasProduct = Boolean(product);
  const handleSelect = useCallback(() => {
    if (product) onSelect(product);
  }, [onSelect, product]);

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-900">{title}</div>
      {underline ? <div className="mt-2 h-px w-40 bg-gray-900" /> : null}
      <div className="mt-6">
        {hasProduct ? (
          <button
            type="button"
            onClick={handleSelect}
            className="ui-focus-ring group flex w-full items-center gap-5 rounded-2xl border border-black/10 bg-white/70 p-5 text-left hover:bg-white"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gray-50">
              {product?.badge ? (
                <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white">
                  {product.badge}
                </div>
              ) : null}
              <img
                src={product?.image}
                alt={product?.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-gray-900">{product?.name}</div>
              <div className="mt-1 text-xs text-gray-500">{product?.description ?? 'View product'}</div>
            </div>
          </button>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white/70 px-5 py-6 text-sm text-gray-600">
            {noProductsLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchOverlay({
  isOpen,
  query,
  onQueryChange,
  onClearQuery,
  onClose,
  results,
  recentlyViewed,
  bestSeller,
  onSelectProduct,
  inputRef
}: {
  isOpen: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onClearQuery: () => void;
  onClose: () => void;
  results: SearchProduct[];
  recentlyViewed: SearchProduct | undefined;
  bestSeller: SearchProduct | undefined;
  onSelectProduct: (product: SearchProduct) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { popularSearches, ui } = useSearchConfig();
  
  const handleSelectTerm = useCallback(
    (value: string) => {
      onQueryChange(value);
      inputRef.current?.focus();
    },
    [inputRef, onQueryChange]
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container-custom pt-24 pb-10">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder={ui.placeholder}
                  className="ui-focus-ring h-12 w-full rounded-full bg-gray-100 pl-12 pr-12 text-sm text-gray-900 placeholder:text-gray-500"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    className="ui-focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-700 hover:bg-gray-200"
                    onClick={onClearQuery}
                  >
                    <HiX className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                className="ui-focus-ring rounded-full p-2 text-gray-700 hover:bg-gray-100"
                aria-label="Close search"
                onClick={onClose}
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            {query ? (
              <div className="mt-8">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">{ui.labels.results}</div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {results.length ? (
                    results.map((p) => (
                      <SearchResultItem key={p.id} product={p} onSelect={onSelectProduct} />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-black/10 bg-white/70 px-5 py-6 text-sm text-gray-600">
                      {ui.labels.noResults}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <div className="text-sm font-medium text-gray-900">{ui.labels.popularSearches}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {popularSearches.map((t) => (
                    <SearchChip key={t} value={t} onSelect={handleSelectTerm} />
                  ))}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
                  <FeaturedProductCard
                    title={ui.labels.recentlyViewed}
                    underline
                    product={recentlyViewed}
                    noProductsLabel={ui.labels.noProducts}
                    onSelect={onSelectProduct}
                  />
                  <FeaturedProductCard 
                    title={ui.labels.bestSeller} 
                    product={bestSeller} 
                    noProductsLabel={ui.labels.noProducts}
                    onSelect={onSelectProduct} 
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

