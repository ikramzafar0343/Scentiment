import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SlidersHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Section } from '@/components/ui/layout/Section';
import { useProductFilters, type SortOption } from '@/hooks/useProductFilters';
import { DEFAULT_PRICE_RANGE } from '@/lib/constants';
import { useCategoryConfig } from '@/hooks/useCategoryConfig';
import { useCatalogProducts } from '@/hooks/useCatalog';

export function ScentVoyage() {
  const config = useCategoryConfig('voyage');
  const allProducts = useCatalogProducts();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedDestination, setSelectedDestination] = useState('all');

  // Filter products for Voyage collection (Discovery Sets or specific categories)
  const VOYAGE_PRODUCTS = useMemo(() => {
    return allProducts.filter(p => 
      p.category === 'Discovery Sets' || 
      p.name.toLowerCase().includes('discovery') ||
      p.name.toLowerCase().includes('voyage')
    ).map(p => ({
      ...p,
      destinationTag: (p as any).destinationTag || 'all',
    }));
  }, [allProducts]);

  // Categories
  const categories = useMemo(() => {
    return Array.from(new Set(VOYAGE_PRODUCTS.map(p => p.category)));
  }, [VOYAGE_PRODUCTS]);

  // Resolve destination images
  const destinations = useMemo(() => {
    return (config.filters?.destinations || []).map(dest => ({
      ...dest,
      image: config.resolveDestinationImage(dest.imagePrompt || '', 'square')
    }));
  }, [config]);

  const filteredProducts = useProductFilters({
    products: VOYAGE_PRODUCTS,
    filters: { selectedCategory, priceRange, sortBy },
    customFilterFn: (product) =>
      selectedDestination === 'all'
        ? true
        : (product as { destinationTag?: string }).destinationTag === selectedDestination,
  });

  const handleResetFilters = () => {
    setSelectedCategory('All Products');
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedDestination('all');
  };

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
      />

      {config.ui.sections?.exploreByDestination && (
      <Section
          title={config.ui.sections.exploreByDestination.title}
          description={config.ui.sections.exploreByDestination.description}
        className="bg-[color:var(--ds-surface-alt)]"
      >
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide justify-start lg:justify-center">
            {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => setSelectedDestination(dest.id)}
              className={`group flex min-w-[104px] flex-col items-center gap-3 transition-all duration-200 ${
                selectedDestination === dest.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`h-20 w-20 overflow-hidden rounded-full border transition-all duration-200 ${
                  selectedDestination === dest.id
                    ? 'border-gray-900 shadow-md'
                    : 'border-black/10 group-hover:border-black/20'
                }`}
              >
                <img
                  src={dest.image}
                  alt={dest.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${
                  selectedDestination === dest.id ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {dest.label}
              </span>
            </button>
          ))}
        </div>
      </Section>
      )}

      <PageContainer className="py-16 lg:py-20">
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
            className="lg:sticky lg:top-24 h-fit hidden lg:block" 
          />

          <main className="flex-1">
             {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sticky top-20 z-30 bg-white/95 backdrop-blur-md py-4 sm:py-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 sm:border-none transition-all duration-300">
              <div className="text-sm text-gray-500">
                {selectedDestination !== 'all' && <span className="text-black font-medium mr-1">{destinations.find(d => d.id === selectedDestination)?.label}:</span>}
                {config.ui.toolbar.showingResults} <span className="font-bold text-black">{filteredProducts.length}</span> scents
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={`${product.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MapPin className="w-12 h-12 text-gray-300 mx-auto" />}
                description={config.ui.emptyState.noProducts}
                actionLabel={config.ui.emptyState.viewAllDestinations}
                onAction={handleResetFilters}
                className="py-32 rounded-sm border border-dashed border-gray-200"
              />
            )}
          </main>
        </div>
      </PageContainer>

      {/* Featured Destination (Editorial Style) */}
      {config.featuredContent && (
      <section className="relative overflow-hidden hero-gradient py-20">
        <div className="absolute inset-0 opacity-15">
          <img
              src={config.resolveDestinationImage(config.featuredContent.imagePrompt, 'landscape_16_9')}
              alt="Featured destination"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <PageContainer className="relative">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <div className="max-w-xl">
                <div className="ui-eyebrow text-white/80">{config.featuredContent.subtitle}</div>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                  {config.featuredContent.title.includes('Santorini') ? (
                    <>
                Summer in <span className="font-serif italic">Santorini</span>
                    </>
                  ) : (
                    config.featuredContent.title
                  )}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  {config.featuredContent.description}
              </p>
              <div className="mt-7">
                <Button variant="secondary" className="h-12 px-8 text-xs uppercase tracking-widest">
                    {config.featuredContent.ctaLabel}
                </Button>
              </div>
            </div>

            <div className="hidden md:block h-64 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />

            <div className="hidden text-right md:block">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/70">Launch date</div>
              <div className="mt-2 text-2xl font-semibold text-white">June 2024</div>
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
