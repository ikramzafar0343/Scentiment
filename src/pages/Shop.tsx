import { useState, useMemo, useEffect } from 'react';
import { PRODUCTS } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FAQSection } from '@/components/home/FAQSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Seo } from '@/components/seo/Seo';

export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map(p => p.category)));
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'All Products') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products are ordered by newness or have a date (using ID or index as proxy for now)
        // For now, let's just reverse the original list as a "newest" proxy if no date field
        // Creating a new array to avoid mutating the original PRODUCTS reference in recursive renders if not carefully handled
        result = result.reverse(); 
        break;
      case 'featured':
      default:
        // Default order
        break;
    }

    return result;
  }, [selectedCategory, priceRange, sortBy]);

  // Scroll to top on category change (optional, maybe annoying if just filtering, let's keep it for now)
  useEffect(() => {
     // Optional: window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  return (
    <div className="bg-white min-h-screen">
      <Seo
        title="Shop — Scentiment"
        description="Shop premium fragrances, diffusers, oils, room sprays, candles, and perfumes. Filter by category and price, then add to cart instantly."
        canonicalPath="/shop"
      />
      {/* Hero Section */}
      <div className="relative bg-[#f8f5f2] py-16 lg:py-24 overflow-hidden">
        <div className="container-custom relative z-10 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 text-gray-900">
                The Collection
              </h1>
              <p className="max-w-xl mx-auto text-gray-600 text-lg font-light leading-relaxed">
                Discover our curated selection of premium fragrances, diffusers, and candles designed to elevate your space.
              </p>
           </motion.div>
        </div>
        {/* Background Pattern or Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />
      </div>

      <div className="container-custom py-12 lg:py-16">
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
                    <ProductCard product={product} />
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

      {/* Best Sellers Section */}
      <section className="py-20 bg-[#f8f8f8]">
        <div className="container-custom">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-serif font-medium mb-4">Best Sellers</h2>
             <p className="text-gray-600">Our most loved scents, chosen by you.</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.filter(p => p.rating === 5 && p.reviews > 500).slice(0, 4).map((product) => (
                <ProductCard key={`bs-${product.id}`} product={product} />
              ))}
           </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <FeaturesSection />

      {/* FAQ */}
      <FAQSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
