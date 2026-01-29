import { useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/store/useCartStore';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { Seo } from '@/components/seo/Seo';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Section } from '@/components/ui/layout/Section';
import { useProductFilters } from '@/hooks/useProductFilters';
import { CANDLE_PRICE_RANGE } from '@/lib/constants';
import { useCategoryConfig } from '@/hooks/useCategoryConfig';

// Extend Product type for Candles specific attributes
interface CandleProduct extends Product {
  burnTime?: string;
  waxType?: string;
  scentFamily?: string;
  mood?: string;
}

export function Candles() {
  const config = useCategoryConfig('candles');
  const allProducts = useCatalogProducts();
  
  // Enhance existing candle products with specific data
  const CANDLE_PRODUCTS: CandleProduct[] = allProducts.filter(p => p.category === 'Candles').map(p => ({
  ...p,
  burnTime: '50-60 Hours',
  waxType: 'Soy Blend',
  scentFamily: p.name.includes('Santal') || p.name.includes('One') ? 'Woody' : 
               p.name.includes('Ocean') || p.name.includes('Breeze') ? 'Fresh' : 
               p.name.includes('Cherry') || p.name.includes('Love') ? 'Fruity' : 
               p.name.includes('Day') || p.name.includes('Tea') ? 'Floral' : 'Oriental',
  mood: p.name.includes('Santal') || p.name.includes('One') ? 'Relaxing' : 
        p.name.includes('Ocean') ? 'Energizing' : 
        p.name.includes('Secret') || p.name.includes('Love') ? 'Romantic' : 'Cozy'
}));

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>(CANDLE_PRICE_RANGE);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Categories for Sidebar (Standard + Moods if we want)
  const categories = config.filters?.categories || ['All Products'];
  const scentFamilies = config.filters?.scentFamilies || [];

  // Use the custom hook for filtering and sorting
  const filteredProducts = useProductFilters({
    products: CANDLE_PRODUCTS,
    filters: {
      selectedCategory,
      priceRange,
      sortBy,
    },
    customFilterFn: (product) => {
      if (selectedFamily !== 'all') {
        return (product as CandleProduct).scentFamily === selectedFamily;
      }
      return true;
    },
  });

  const handleResetFilters = () => {
    setSelectedCategory('All Products');
    setPriceRange(CANDLE_PRICE_RANGE);
    setSelectedFamily('all');
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

      {config.ui.sections?.findYourScent && (
        <Section 
          title={config.ui.sections.findYourScent.title} 
          description={config.ui.sections.findYourScent.description} 
          className="bg-[color:var(--ds-surface-alt)]"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {scentFamilies.map((family) => (
            <button
              key={family.id}
              onClick={() => setSelectedFamily(family.id)}
              className={`
                relative inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200
                ${
                  selectedFamily === family.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                    : 'bg-white text-gray-600 border-black/10 hover:border-black/20 hover:shadow-sm'
                }
              `}
            >
              {family.id !== 'all' ? <span className={`h-2.5 w-2.5 rounded-full ${family.color}`} /> : null}
              <span>{family.label}</span>
            </button>
            ))}
          </div>
        </Section>
      )}

      <PageContainer className="py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <FilterSidebar 
            categories={categories} // Passing Moods as categories
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
                <span className="font-serif italic text-lg mr-2 text-black">
                  {selectedFamily === 'all' ? 'All Candles' : `${selectedFamily} Collection`}
                </span>
                <span className="text-xs text-gray-400">({filteredProducts.length} items)</span>
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
                    {/* Extra details for premium feel */}
                    <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {(product as CandleProduct).burnTime}</span>
                       <span>|</span>
                       <span>{(product as CandleProduct).scentFamily}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Flame className="w-12 h-12 text-gray-300 mx-auto" />}
                description={config.ui.emptyState.noProducts}
                actionLabel={config.ui.emptyState.resetCollection}
                onAction={handleResetFilters}
                className="py-32 rounded-sm border border-dashed border-gray-200"
              />
            )}
          </main>
        </div>
      </PageContainer>

      {config.guideContent && (
        <section className="bg-[color:var(--ds-surface-alt)] py-20">
          <PageContainer>
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
                  <img
                    src={config.resolveDestinationImage('photorealistic premium candle care scene, luxury candle jar, wick trimmer, warm soft light, cozy editorial styling, high detail, 35mm', 'square')}
                    alt="Candle care"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="ui-eyebrow">{config.guideContent.subtitle}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  {config.guideContent.title} <span className="font-serif italic text-gray-700">rituals</span>
                </h2>
                <div className="mt-6 space-y-5 text-gray-600">
                  {config.guideContent.items.map((item) => (
                    <div key={item.number} className="flex gap-4">
                      <div className="text-sm font-semibold text-gray-400">{item.number}</div>
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-wide text-gray-900">{item.title}</div>
                        <p className="mt-1 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {config.guideContent.ctaLabel && (
                  <div className="mt-8">
                    <Button variant="outline" className="px-8 text-xs uppercase tracking-widest">
                      {config.guideContent.ctaLabel}
                    </Button>
                  </div>
                )}
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
