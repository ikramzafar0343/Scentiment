import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';

export function NewArrivals() {
  const location = useLocation();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  
  // Determine Page Context
  const context = useMemo(() => {
    const path = location.pathname;
    if (path.includes('sale') || path.includes('specials')) return 'sale';
    if (path.includes('diffusers') || path.includes('scent-diffusers')) return 'diffusers';
    if (path.includes('oils') || path.includes('fragrance-oils')) return 'oils';
    if (path.includes('sprays') || path.includes('fragrance-room-sprays')) return 'sprays';
    if (path.includes('candles')) return 'candles';
    if (path.includes('perfumes') || path.includes('fragrances')) return 'perfumes';
    return 'new';
  }, [location.pathname]);

  // Page Content Config
  const pageConfig = {
    new: {
      title: "New Arrivals",
      subtitle: "Latest Drops",
      description: "Discover the latest additions to our luxury fragrance collection. Crafted to transform your space.",
      filterCategory: null // Show all, but maybe highlight new?
    },
    sale: {
      title: "Specials",
      subtitle: "Limited Time Offers",
      description: "Exclusive deals on our premium diffusers and fragrances. Limited time only.",
      filterCategory: null
    },
    diffusers: {
      title: "Scent Diffusers",
      subtitle: "Latest Drops",
      description: "Elevate your environment with our state-of-the-art cold-air diffusion technology.",
      filterCategory: 'Diffusers'
    },
    oils: {
      title: "Fragrance Oils",
      subtitle: "Best Sellers",
      description: "100% Pure Fragrance Oils for Scent Diffusers. Safe for Pets & Kids.",
      filterCategory: 'Fragrance Oils'
    },
    sprays: {
      title: "Room Sprays",
      subtitle: "Instant Freshness",
      description: "Transform your space instantly with our luxury room sprays. Inspired by world-class hotels.",
      filterCategory: 'Room Sprays'
    },
    candles: {
      title: "Candles",
      subtitle: "Set The Mood",
      description: "Hand-poured luxury candles featuring our signature hotel-inspired scents.",
      filterCategory: 'Candles'
    },
    perfumes: {
      title: "Perfumes & Cologne",
      subtitle: "Signature Scents",
      description: "Discover our collection of luxury perfumes and colognes. Inspired by iconic designer fragrances.",
      filterCategory: 'Perfumes'
    }
  }[context];

  const [selectedCategory, setSelectedCategory] = useState<string>(
    pageConfig.filterCategory || 'All Products'
  );

  // Available Categories (Unique from Products)
  const categories = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map(p => p.category)));
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Context Filtering (Base Filter)
    if (context === 'sale') {
      result = result.filter(p => p.badge?.includes('OFF') || p.badge === 'SALE');
    } else if (context === 'new') {
      result = result.filter(p => p.isNew);
    } else if (pageConfig.filterCategory) {
      result = result.filter(p => p.category === pageConfig.filterCategory);
    }
    
    // 2. Sidebar Filtering (User Filter)
    // If the page has a fixed category (e.g. Diffusers page), we might want to ignore the "All Products" selection 
    // or treat "All Products" as "All Diffusers".
    // However, to keep it simple: if the user explicitly selects a different category in the sidebar, we respect it 
    // (allowing cross-browsing) OR we could hide the category filter on specific pages.
    // Let's allow filtering if 'All Products' is not selected, otherwise adhere to page context.
    
    if (selectedCategory !== 'All Products' && selectedCategory !== pageConfig.filterCategory) {
       result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // 4. Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = result.reverse(); 
        break;
      default:
        break;
    }

    return result;
  }, [context, pageConfig.filterCategory, selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      <Seo
        title={
          context === 'sale'
            ? 'Sale — Scentiment'
            : context === 'diffusers'
              ? 'Diffusers — Scentiment'
              : context === 'oils'
                ? 'Fragrance Oils — Scentiment'
                : context === 'sprays'
                  ? 'Room Sprays — Scentiment'
                  : context === 'candles'
                    ? 'Candles — Scentiment'
                    : context === 'perfumes'
                      ? 'Perfumes — Scentiment'
                      : 'New Arrivals — Scentiment'
        }
        description={pageConfig.description}
      />
      {/* Hero Section */}
      <div className="relative bg-[#f8f5f2] py-16 lg:py-20 overflow-hidden">
        <div className="container-custom relative z-10 text-center px-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <span className="text-[#d4af37] font-bold tracking-widest uppercase text-xs md:text-sm mb-3 block">
                {pageConfig.subtitle}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 text-gray-900">
                {pageConfig.title}
              </h1>
              <p className="max-w-xl mx-auto text-gray-600 text-lg font-light leading-relaxed">
                {pageConfig.description}
              </p>
           </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />
      </div>

      <div className="container-custom py-12">
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
                Showing <span className="font-bold text-black">{filteredProducts.length}</span> results
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="lg:hidden flex-1 flex items-center gap-2"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>
                
                <div className="flex-1 sm:flex-none flex justify-end">
                   <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
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
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setPriceRange([0, 200]);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Featured Section (for New Arrivals) */}
      {context === 'new' && (
        <section className="py-16 bg-black text-white overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="text-[#d4af37] font-bold tracking-widest uppercase text-xs mb-4 block">Featured Launch</span>
                <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">The Hotel Collection</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  Bring the essence of 5-star luxury into your home. Our newest collection features scents inspired by the world's most iconic hotels.
                </p>
                <Button variant="secondary" className="bg-white text-black hover:bg-gray-200">
                  Shop The Collection
                </Button>
              </div>
              <div className="order-1 md:order-2 relative">
                 <div className="aspect-square bg-white/10 rounded-full blur-3xl absolute inset-0 transform scale-75" />
                 <img 
                   src="https://images.unsplash.com/photo-1605656816944-971cd5c1407f?q=80&w=800&auto=format&fit=crop" 
                   alt="Featured Collection" 
                   className="relative z-10 rounded-sm shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-700"
                 />
              </div>
            </div>
          </div>
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
