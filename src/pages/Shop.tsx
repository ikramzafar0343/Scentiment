import { useState, useMemo } from 'react';
import { useCatalogProductsWithState } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FAQSection } from '@/components/home/FAQSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Section } from '@/components/ui/layout/Section';
import { useProductFilters } from '@/hooks/useProductFilters';
import { DEFAULT_PRICE_RANGE } from '@/lib/constants';
import { useCategoryConfig } from '@/hooks/useCategoryConfig';

export function Shop() {
  const config = useCategoryConfig('shop');
  const { products, loading, error } = useCatalogProductsWithState();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Use the custom hook for filtering and sorting
  const filteredProducts = useProductFilters({
    products,
    filters: {
      selectedCategory,
      priceRange,
      sortBy,
    },
  });

  const handleResetFilters = () => {
    setSelectedCategory('All Products');
    setPriceRange(DEFAULT_PRICE_RANGE);
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
        variant="hero"
        media={{
          type: 'image',
          src: config.getBackgroundImage('landscape_16_9')
        }}
      />

      <PageContainer className="py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters */}
          <FilterSidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sticky top-20 z-30 bg-white/90 backdrop-blur-md py-4 sm:py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                   <SortDropdown 
                     sortBy={sortBy} 
                     onSortChange={(value) => setSortBy(value as typeof sortBy)} 
                   />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--ds-primary)] mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <EmptyState
                description={`Failed to load products: ${error.message}. Please try refreshing the page.`}
                actionLabel="Refresh Page"
                onAction={() => window.location.reload()}
              />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={`${product.id}-${i}`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.55, delay: Math.min(i * 0.04, 0.2), ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                description={config.ui.emptyState.noProducts}
                actionLabel={config.ui.emptyState.clearFilters}
                onAction={handleResetFilters}
              />
            )}
          </main>
        </div>
      </PageContainer>

      {/* Best Sellers Section */}
      {config.ui.sections?.bestSellers && (
        <Section 
          title={config.ui.sections.bestSellers.title} 
          description={config.ui.sections.bestSellers.description} 
          className="bg-[color:var(--ds-surface-alt)]"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.filter((p) => p.rating === 5 && (p.reviews ?? 0) > 500)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={`bs-${product.id}`} product={product} />
              ))}
          </div>
        </Section>
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
