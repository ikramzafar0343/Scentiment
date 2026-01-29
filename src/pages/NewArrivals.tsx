import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { useProductFilters, type SortOption } from '@/hooks/useProductFilters';
import { DEFAULT_PRICE_RANGE } from '@/lib/constants';
import { useCategoryConfig } from '@/hooks/useCategoryConfig';
import type { CategoryPageKey } from '@/configs/category/category.schema';

export function NewArrivals() {
  const location = useLocation();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  
  // Determine Page Context
  const context = useMemo(() => {
    const path = location.pathname;
    const rules: Array<{ id: CategoryPageKey; match: (p: string) => boolean }> = [
      { id: 'sale', match: (p) => p.includes('sale') || p.includes('specials') },
      { id: 'diffusers', match: (p) => p.includes('diffusers') || p.includes('scent-diffusers') },
      { id: 'oils', match: (p) => p.includes('oils') || p.includes('fragrance-oils') },
      { id: 'sprays', match: (p) => p.includes('sprays') || p.includes('fragrance-room-sprays') },
      { id: 'candles', match: (p) => p.includes('candles') },
      { id: 'perfumes', match: (p) => p.includes('perfumes') || p.includes('fragrances') },
    ];
    return rules.find((r) => r.match(path))?.id ?? 'new';
  }, [location.pathname]);

  const config = useCategoryConfig(context);
  const filterCategory = config.filterCategory || null;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    filterCategory || 'All Products'
  );

  const products = useCatalogProducts();
  
  // Available Categories (Unique from Products)
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const filteredProducts = useProductFilters({
    products,
    filters: { selectedCategory, priceRange, sortBy },
    customFilterFn: (product) => {
      const respectsContext = selectedCategory === 'All Products' || selectedCategory === filterCategory;

      const baseFilters: Record<CategoryPageKey, () => boolean> = {
        sale: () => Boolean(product.badge?.includes('OFF') || product.badge === 'SALE'),
        new: () => Boolean(product.isNew),
        diffusers: () => (filterCategory ? product.category === filterCategory : true),
        oils: () => (filterCategory ? product.category === filterCategory : true),
        sprays: () => (filterCategory ? product.category === filterCategory : true),
        candles: () => (filterCategory ? product.category === filterCategory : true),
        perfumes: () => (filterCategory ? product.category === filterCategory : true),
        shop: () => true,
        voyage: () => true,
      };

      return respectsContext ? baseFilters[context]() : true;
    },
  });

  return (
    <div className="page-surface">
      <Seo
        title={config.metadata.seo.title}
        description={config.metadata.seo.description}
        canonicalPath={config.metadata.seo.canonicalPath}
      />

      <PageHeader
        eyebrow={config.metadata.header.eyebrow}
        title={config.metadata.header.title}
        description={config.metadata.header.description}
        variant="hero"
        media={{
          type: 'image',
          src: config.getBackgroundImage('landscape_16_9')
        }}
      />

      <PageContainer className="py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <FilterSidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            className="lg:sticky lg:top-24 h-fit"
          />

          <main className="flex-1">
             {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sticky top-20 z-30 bg-white/90 backdrop-blur-md py-4 sm:py-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 sm:border-none">
              <div className="text-sm text-gray-500">
                {config.ui.toolbar.showingResults} <span className="font-bold text-black">{filteredProducts.length}</span> results
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="lg:hidden flex-1 flex items-center gap-2"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> {config.ui.toolbar.filtersButton}
                </Button>
                
                <div className="flex-1 sm:flex-none flex justify-end">
                   <SortDropdown sortBy={sortBy} onSortChange={(value) => setSortBy(value as SortOption)} />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={`${product.id}-${i}`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.55, delay: Math.min(i * 0.04, 0.2), ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <ProductCard 
                      product={{
                        ...product,
                        badge: context === 'new' && !product.badge ? 'NEW' : product.badge
                      }} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                description={config.ui.emptyState.noProducts}
                actionLabel={config.ui.emptyState.clearFilters}
                onAction={() => {
                  setSelectedCategory('All Products');
                  setPriceRange(DEFAULT_PRICE_RANGE);
                }}
              />
            )}
          </main>
        </div>
      </PageContainer>

      {/* Featured Section (for New Arrivals) */}
      {context === 'new' && config.featuredContent && (
        <section className="relative overflow-hidden hero-gradient py-16">
          <PageContainer>
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="ui-eyebrow text-white/75">{config.featuredContent.subtitle}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{config.featuredContent.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                  {config.featuredContent.description}
                </p>
                <div className="mt-7">
                  <Button variant="secondary" className="h-12 px-8 text-xs uppercase tracking-widest">
                    {config.featuredContent.ctaLabel}
                  </Button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-white/70 to-white/10 blur-xl" />
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
                    <img
                      src={config.resolveDestinationImage(config.featuredContent.imagePrompt, 'square')}
                      alt="Featured collection"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* Why Choose Us */}
      <FeaturesSection />

      {/* FAQ */}
      <FAQSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
