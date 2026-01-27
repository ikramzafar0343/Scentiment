import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/store/useCartStore';
import { PRODUCTS } from '@/lib/data';
import { Seo } from '@/components/seo/Seo';

// Extend Product type for Candles specific attributes
interface CandleProduct extends Product {
  burnTime?: string;
  waxType?: string;
  scentFamily?: string;
  mood?: string;
}

// Enhance existing candle products with specific data
const CANDLE_PRODUCTS: CandleProduct[] = PRODUCTS.filter(p => p.category === 'Candles').map(p => ({
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

const SCENT_FAMILIES = [
  { id: 'all', label: 'All Scents', color: 'bg-gray-100' },
  { id: 'Woody', label: 'Woody', color: 'bg-[#8B5A2B]' },
  { id: 'Fresh', label: 'Fresh', color: 'bg-[#A0C4FF]' },
  { id: 'Floral', label: 'Floral', color: 'bg-[#FFB7B2]' },
  { id: 'Oriental', label: 'Oriental', color: 'bg-[#D4AF37]' },
];

export function Candles() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedFamily, setSelectedFamily] = useState('all');
  // We can use the category filter from Sidebar for "Mood" or keep it standard
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Categories for Sidebar (Standard + Moods if we want)
  const categories = ['All Products', 'Relaxing', 'Energizing', 'Romantic', 'Cozy'];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...CANDLE_PRODUCTS];

    // Filter by Scent Family (Visual Filter)
    if (selectedFamily !== 'all') {
      result = result.filter(p => p.scentFamily === selectedFamily);
    }

    // Filter by Sidebar Category (acting as Mood filter here for variety)
    if (selectedCategory !== 'All Products') {
      result = result.filter(p => p.mood === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.reverse(); 
        break;
      default:
        break;
    }

    return result;
  }, [selectedFamily, selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      <Seo
        title="Candles — Scentiment"
        description="Hand-poured luxury candles crafted to transform your space with warmth, elegance, and unforgettable fragrance."
        canonicalPath="/candles"
      />
      {/* Cinematic Hero Section */}
      <div className="relative h-[60vh] lg:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Placeholder for a video or high-end cozy image */}
           <img 
             src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=2000&auto=format&fit=crop" 
             alt="Luxury Candle Ambience" 
             className="w-full h-full object-cover brightness-[0.5]"
           />
        </div>
        
        <div className="container-custom relative z-10 text-center px-4">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, ease: "easeOut" }}
           >
              <span className="text-orange-100/90 font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">
                Hand-Poured Luxury
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-light mb-8 text-white tracking-wide">
                The Candle Collection
              </h1>
              <p className="max-w-xl mx-auto text-white/90 text-lg font-light leading-relaxed tracking-wide">
                Illuminate your senses. Our soy-blend candles are crafted to transform your space with warmth, elegance, and unforgettable fragrance.
              </p>
           </motion.div>
        </div>
      </div>

      {/* Scent Family Visual Filter */}
      <section className="py-12 border-b border-gray-100 bg-[#fffbf7]">
         <div className="container-custom">
            <div className="text-center mb-10">
               <h3 className="font-serif text-2xl text-gray-900 mb-2">Find Your Scent</h3>
               <p className="text-gray-500 text-sm">Explore our fragrances by olfactory family</p>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center px-4">
               {SCENT_FAMILIES.map((family) => (
                 <button 
                   key={family.id}
                   onClick={() => setSelectedFamily(family.id)}
                   className={`
                     relative flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300
                     ${selectedFamily === family.id 
                       ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' 
                       : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:shadow-md'}
                   `}
                 >
                    {family.id !== 'all' && (
                      <span className={`w-3 h-3 rounded-full ${family.color}`}></span>
                    )}
                    <span className="text-xs uppercase tracking-widest font-medium">
                      {family.label}
                    </span>
                 </button>
               ))}
            </div>
         </div>
      </section>

      <div className="container-custom py-16 lg:py-24">
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
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>
                
                <div className="flex-1 sm:flex-none flex justify-end">
                   <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
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
                       <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {product.burnTime}</span>
                       <span>|</span>
                       <span>{product.scentFamily}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                <Flame className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6 font-light text-lg">No candles found matching your mood.</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setPriceRange([0, 100]);
                    setSelectedFamily('all');
                  }}
                  variant="outline"
                  className="uppercase tracking-widest text-xs"
                >
                  Reset Collection
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Editorial Section: Candle Care */}
      <section className="py-24 bg-[#f4f1ea] text-gray-900 overflow-hidden relative">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative">
                <div className="absolute -top-10 -left-10 w-full h-full border border-gray-400/30 rounded-full rounded-tr-none z-0"></div>
                <img 
                   src="https://images.unsplash.com/photo-1602825266977-166168e92822?q=80&w=800&auto=format&fit=crop" 
                   alt="Candle Care" 
                   className="relative z-10 w-full h-auto shadow-xl rounded-sm"
                />
             </div>
             
             <div className="order-1 md:order-2">
                <span className="text-gray-500 font-medium tracking-[0.2em] uppercase text-xs mb-6 block">
                  The Art of Wax
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8 leading-tight">
                  Candle Care <br/><i className="font-light text-gray-600">Rituals</i>
                </h2>
                <ul className="space-y-6 text-gray-600 font-light">
                  <li className="flex gap-4">
                    <span className="text-2xl font-serif opacity-30">01</span>
                    <div>
                      <strong className="block text-gray-900 text-sm uppercase tracking-wide mb-1">Trim the Wick</strong>
                      <p>Always trim the wick to 1/4 inch before every burn to ensure an even, smoke-free flame.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-2xl font-serif opacity-30">02</span>
                    <div>
                      <strong className="block text-gray-900 text-sm uppercase tracking-wide mb-1">The First Burn</strong>
                      <p>Allow the wax to melt to the edges of the jar during the first burn to prevent tunneling.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-2xl font-serif opacity-30">03</span>
                    <div>
                      <strong className="block text-gray-900 text-sm uppercase tracking-wide mb-1">Safety First</strong>
                      <p>Never leave a burning candle unattended and keep away from drafts, pets, and children.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-10">
                   <Button variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white uppercase tracking-widest text-xs px-8">
                     Shop Accessories
                   </Button>
                </div>
             </div>
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
