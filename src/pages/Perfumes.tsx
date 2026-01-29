import { useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/store/useCartStore';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { Seo } from '@/components/seo/Seo';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Section } from '@/components/ui/layout/Section';
import { useProductFilters } from '@/hooks/useProductFilters';
import { DEFAULT_PRICE_RANGE } from '@/lib/constants';
import { useCategoryConfig } from '@/hooks/useCategoryConfig';

// Extend Product type for Perfume specific attributes
interface PerfumeProduct extends Product {
  concentration?: string;
  notes?: string[];
  gender?: 'Unisex' | 'Feminine' | 'Masculine';
  scentProfile?: string;
}

export function Perfumes() {
  const config = useCategoryConfig('perfumes');
  const allProducts = useCatalogProducts();
  
  // Enhance existing perfume products with specific data
  const PERFUME_PRODUCTS: PerfumeProduct[] = allProducts.filter(p => p.category === 'Perfumes').map(p => ({
  ...p,
  concentration: p.name.includes('Extrait') ? 'Extrait de Parfum' : 'Eau de Parfum',
  gender: p.name.includes('Women') || p.name.includes('Love') || p.name.includes('Cherry') ? 'Feminine' : 
          p.name.includes('Savage') || p.name.includes('Oud') ? 'Masculine' : 'Unisex',
  scentProfile: p.name.includes('Santal') || p.name.includes('Oud') ? 'Woody' : 
                p.name.includes('Cherry') || p.name.includes('Sky') ? 'Fruity/Fresh' : 
                p.name.includes('Brilliance') || p.name.includes('Diamond') ? 'Amber/Floral' : 'Floral',
  notes: p.description?.replace('Inspired by ', '').split('. ')[1]?.split(', ') || []
}));

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [selectedProfile, setSelectedProfile] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Categories for Sidebar (Gender/Type)
  const categories = config.filters?.categories || ['All Products'];
  const scentProfiles = config.filters?.scentProfiles || [];

  // Use the custom hook for filtering and sorting
  const filteredProducts = useProductFilters({
    products: PERFUME_PRODUCTS,
    filters: {
      selectedCategory,
      priceRange,
      sortBy,
    },
    customFilterFn: (product) => {
      if (selectedProfile !== 'all') {
        return (product as PerfumeProduct).scentProfile === selectedProfile;
      }
      return true;
    },
  });

  const handleResetFilters = () => {
    setSelectedCategory('All Products');
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedProfile('all');
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

      {config.ui.sections?.olfactoryNotes && (
        <Section 
          id="scent-profiles" 
          title={config.ui.sections.olfactoryNotes.title} 
          description={config.ui.sections.olfactoryNotes.description} 
          align="left"
        >
          <div className="flex max-w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {scentProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              className={`
                whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200
                ${
                  selectedProfile === profile.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-white text-gray-600 border-black/10 hover:border-black/20 hover:text-gray-900'
                }
              `}
            >
              {profile.label}
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
                <span className="font-serif italic text-lg mr-2 text-black">
                  {selectedProfile === 'all' ? 'All Fragrances' : `${selectedProfile}`}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={`${product.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group"
                  >
                    <ProductCard product={product} />
                    
                    {/* Premium Details Below Card */}
                    <div className="mt-4 text-center">
                       <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                         {(product as PerfumeProduct).gender} • {(product as PerfumeProduct).concentration}
                       </p>
                       <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {(product as PerfumeProduct).notes?.slice(0, 3).map((note: string, idx: number) => (
                             <span key={idx} className="text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-sm">
                               {note}
                             </span>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Droplets className="w-12 h-12 text-gray-300 mx-auto" />}
                description={config.ui.emptyState.noProducts}
                actionLabel={config.ui.emptyState.resetCollection}
                onAction={handleResetFilters}
                className="py-32 rounded-sm border border-dashed border-gray-200"
              />
            )}
          </main>
        </div>
      </PageContainer>

      {/* Scent Concentration Guide */}
      {config.concentrationGuide && (
        <section className="relative overflow-hidden bg-gray-950 py-20 text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <PageContainer className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="ui-eyebrow text-white/70">{config.concentrationGuide.subtitle}</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{config.concentrationGuide.title}</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
              {config.concentrationGuide.items.map((item) => (
                <div 
                  key={item.name}
                  className={`rounded-xl border p-7 backdrop-blur-sm transition-colors ${
                    item.isStandard 
                      ? 'relative border-white/20 bg-white/10 shadow-2xl' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {item.isStandard && (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--ds-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                      Our standard
                    </div>
                  )}
                  <div className={`font-semibold text-white ${item.isStandard ? 'text-2xl' : 'text-xl'}`}>{item.name}</div>
                  <div className="mt-3 text-sm font-bold text-[color:var(--ds-gold)]">{item.concentration}</div>
                  <p className={`mt-3 text-sm leading-relaxed ${item.isStandard ? 'text-white/80' : 'text-white/70'}`}>
                    {item.description}
                  </p>
                </div>
              ))}
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
