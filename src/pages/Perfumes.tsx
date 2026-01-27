import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Sparkles, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/store/useCartStore';
import { PRODUCTS } from '@/lib/data';
import { Seo } from '@/components/seo/Seo';

// Extend Product type for Perfume specific attributes
interface PerfumeProduct extends Product {
  concentration?: string;
  notes?: string[];
  gender?: 'Unisex' | 'Feminine' | 'Masculine';
  scentProfile?: string;
}

// Enhance existing perfume products with specific data
const PERFUME_PRODUCTS: PerfumeProduct[] = PRODUCTS.filter(p => p.category === 'Perfumes').map(p => ({
  ...p,
  concentration: p.name.includes('Extrait') ? 'Extrait de Parfum' : 'Eau de Parfum',
  gender: p.name.includes('Women') || p.name.includes('Love') || p.name.includes('Cherry') ? 'Feminine' : 
          p.name.includes('Savage') || p.name.includes('Oud') ? 'Masculine' : 'Unisex',
  scentProfile: p.name.includes('Santal') || p.name.includes('Oud') ? 'Woody' : 
                p.name.includes('Cherry') || p.name.includes('Sky') ? 'Fruity/Fresh' : 
                p.name.includes('Brilliance') || p.name.includes('Diamond') ? 'Amber/Floral' : 'Floral',
  notes: p.description?.replace('Inspired by ', '').split('. ')[1]?.split(', ') || []
}));

const SCENT_PROFILES = [
  { id: 'all', label: 'All Profiles' },
  { id: 'Woody', label: 'Woody & Earthy' },
  { id: 'Fruity/Fresh', label: 'Fresh & Fruity' },
  { id: 'Amber/Floral', label: 'Amber & Floral' },
  { id: 'Floral', label: 'Floral' },
];

export function Perfumes() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProfile, setSelectedProfile] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Categories for Sidebar (Gender/Type)
  const categories = ['All Products', 'Unisex', 'Feminine', 'Masculine'];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...PERFUME_PRODUCTS];

    // Filter by Scent Profile (Visual Filter)
    if (selectedProfile !== 'all') {
      result = result.filter(p => p.scentProfile === selectedProfile);
    }

    // Filter by Sidebar Category (Gender)
    if (selectedCategory !== 'All Products') {
      result = result.filter(p => p.gender === selectedCategory);
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
  }, [selectedProfile, selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      <Seo
        title="Perfumes — Scentiment"
        description="Luxury perfumes inspired by iconic designer fragrances. Shop by scent profile and find your signature scent."
        canonicalPath="/perfumes"
      />
      {/* Luxury Hero Section */}
      <div className="relative h-[65vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop" 
             alt="Luxury Perfume" 
             className="w-full h-full object-cover brightness-[0.4]"
           />
        </div>
        
        <div className="container-custom relative z-10 text-center px-4">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, ease: "easeOut" }}
           >
              <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-sm">
                 <Sparkles className="w-3 h-3 text-yellow-200" />
                 <span className="text-white/90 text-[10px] font-medium tracking-widest uppercase">
                   Designer Inspired
                 </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-medium mb-6 text-white tracking-tight">
                Fine Fragrance
              </h1>
              <p className="max-w-xl mx-auto text-white/80 text-lg font-light leading-relaxed tracking-wide mb-8">
                Discover your signature scent. Luxury perfumes inspired by the world's most iconic designer fragrances, without the markup.
              </p>
              <Button className="bg-white text-black hover:bg-gray-100 border-none px-8 h-12 text-xs tracking-widest uppercase">
                 Find Your Scent
              </Button>
           </motion.div>
        </div>
      </div>

      {/* Scent Profile Filter */}
      <section className="py-12 border-b border-gray-100 bg-white">
         <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <h3 className="font-serif text-2xl text-gray-900">Olfactory Notes</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                  {SCENT_PROFILES.map((profile) => (
                    <button 
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile.id)}
                      className={`
                        whitespace-nowrap px-6 py-2.5 rounded-sm border text-xs uppercase tracking-widest transition-all duration-300
                        ${selectedProfile === profile.id 
                          ? 'bg-black text-white border-black' 
                          : 'bg-transparent text-gray-500 border-gray-200 hover:border-black hover:text-black'}
                      `}
                    >
                        {profile.label}
                    </button>
                  ))}
                </div>
            </div>
         </div>
      </section>

      <div className="container-custom py-16 lg:py-24">
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
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>
                
                <div className="flex-1 sm:flex-none flex justify-end">
                   <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
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
                         {product.gender} • {product.concentration}
                       </p>
                       <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {product.notes?.slice(0, 3).map((note, idx) => (
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
              <div className="text-center py-32 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6 font-light text-lg">No perfumes found matching your criteria.</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setPriceRange([0, 200]);
                    setSelectedProfile('all');
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

      {/* Scent Concentration Guide */}
      <section className="py-24 bg-black text-white overflow-hidden relative">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="container-custom relative z-10">
            <div className="text-center mb-16">
               <span className="text-[#d4af37] font-medium tracking-[0.2em] uppercase text-xs mb-4 block">Know Your Scent</span>
               <h2 className="text-3xl md:text-5xl font-serif font-medium">Fragrance Concentrations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-serif mb-2 text-white">Eau de Toilette</div>
                  <div className="text-[#d4af37] text-sm font-bold mb-4">5-15% Oil Concentration</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Light, fresh, and perfect for daily wear. Typically lasts 3-4 hours on the skin.
                  </p>
               </div>
               <div className="p-8 border border-white/20 bg-white/10 backdrop-blur-sm rounded-sm scale-105 shadow-2xl relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                     Our Standard
                  </div>
                  <div className="text-3xl font-serif mb-2 text-white">Eau de Parfum</div>
                  <div className="text-[#d4af37] text-sm font-bold mb-4">15-20% Oil Concentration</div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                     Rich, long-lasting, and intense. The gold standard for luxury fragrance, lasting 6-8 hours.
                  </p>
               </div>
               <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-serif mb-2 text-white">Extrait de Parfum</div>
                  <div className="text-[#d4af37] text-sm font-bold mb-4">20-40% Oil Concentration</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     The purest and most potent form. incredibly long-lasting sillage that stays for 12+ hours.
                  </p>
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
