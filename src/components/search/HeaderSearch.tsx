import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import { PRODUCTS } from '@/lib/data';
import { slugify } from '@/lib/utils';
import { SearchOverlay } from './SearchOverlay';
import { filterProductsByQuery, loadRecentlyViewed, rankBestSellers } from './searchData';
import type { SearchProduct } from './types';

export function HeaderSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const products = useMemo(() => PRODUCTS as unknown as SearchProduct[], []);

  const recentlyViewed = useMemo(
    () => (isOpen ? loadRecentlyViewed(products)[0] : undefined),
    [isOpen, products]
  );

  const bestSeller = useMemo(() => rankBestSellers(products)[0], [products]);
  const results = useMemo(() => filterProductsByQuery(products, query), [products, query]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const handleClearQuery = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const handleSelectProduct = useCallback(
    (p: SearchProduct) => {
      setIsOpen(false);
      setQuery('');
      navigate(`/products/${slugify(p.name)}`, { state: { product: p } });
    },
    [navigate]
  );

  return (
    <>
      <button
        className="w-full h-full flex items-center justify-center"
        aria-label="Search"
        onClick={handleOpen}
        type="button"
      >
        <HiSearch className="w-4 h-4 text-black" />
      </button>

      <SearchOverlay
        isOpen={isOpen}
        query={query}
        onQueryChange={setQuery}
        onClearQuery={handleClearQuery}
        onClose={handleClose}
        results={results}
        recentlyViewed={recentlyViewed}
        bestSeller={bestSeller}
        onSelectProduct={handleSelectProduct}
        inputRef={inputRef}
      />
    </>
  );
}

