import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/store/useCartStore';
import { Seo } from '@/components/seo/Seo';

// Adapted Mock Data for Voyage Collection
const VOYAGE_PRODUCTS: (Product & { 
  originalPrice?: number;
  description?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  saveAmount?: number;
  customButtonText?: string;
  inspiredBy?: string; 
  scents?: string;
  variants?: string[];
  destinationTag?: string; // For filtering by visual tags
})[] = [
  // Discovery Sets
  {
    id: 'miami-discovery',
    name: 'Miami Hotel Discovery Set',
    price: 34.16,
    originalPrice: 51.25,
    category: 'Discovery Sets',
    image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by 1 Hotel® Miami Beach, Delano® Beach Club. Scents: The One, Hot Miami, Ocean Views.',
    rating: 5,
    reviews: 12,
    badge: '33% OFF',
    saveAmount: 17.09,
    customButtonText: 'Add to Cart',
    inspiredBy: 'Miami Hotels',
    scents: 'The One, Hot Miami, Ocean Views',
    destinationTag: 'Miami'
  },
  {
    id: 'coastal-discovery',
    name: 'Coastal Hotel Discovery Set',
    price: 34.16,
    originalPrice: 51.25,
    category: 'Discovery Sets',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Soneva Jani Maldives, Eden Rock St. Barths. Scents: Maldives, St. Barths.',
    rating: 5,
    reviews: 8,
    badge: '33% OFF',
    saveAmount: 17.09,
    customButtonText: 'Add to Cart',
    inspiredBy: 'Coastal Resorts',
    scents: 'Maldives, St. Barths',
    destinationTag: 'Coastal'
  },
  {
    id: 'paris-discovery',
    name: 'Paris Hotel Discovery Set',
    price: 34.16,
    originalPrice: 51.25,
    category: 'Discovery Sets',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Hotel Costes®, Ritz-Carlton® Paris. Scents: French Hotel, Vendôme.',
    rating: 5,
    reviews: 15,
    badge: '33% OFF',
    saveAmount: 17.09,
    customButtonText: 'Add to Cart',
    inspiredBy: 'Parisian Hotels',
    scents: 'French Hotel, Vendôme',
    destinationTag: 'Paris'
  },
  {
    id: 'mediterranean-discovery',
    name: 'Mediterranean Hotel Discovery Set',
    price: 34.16,
    originalPrice: 51.25,
    category: 'Discovery Sets',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Santa Caterina Hotel, Hotel de Paris. Scents: Amalfi Breeze, Monte Carlo.',
    rating: 5,
    reviews: 10,
    badge: '33% OFF',
    saveAmount: 17.09,
    customButtonText: 'Add to Cart',
    inspiredBy: 'Mediterranean Hotels',
    scents: 'Amalfi Breeze, Monte Carlo',
    destinationTag: 'Mediterranean'
  },
  {
    id: 'london-discovery',
    name: 'London Hotel Discovery Set',
    price: 34.16,
    originalPrice: 51.25,
    category: 'Discovery Sets',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by The Connaught, The Lanesborough. Scents: Royal Hall, Hyde Park.',
    rating: 4.8,
    reviews: 6,
    badge: '33% OFF',
    saveAmount: 17.09,
    customButtonText: 'Add to Cart',
    inspiredBy: 'London Hotels',
    scents: 'Royal Hall, Hyde Park',
    destinationTag: 'London'
  },
  {
    id: 'california-discovery',
    name: 'California Hotel Discovery Set',
    price: 34.16,
    originalPrice: 51.25,
    category: 'Discovery Sets',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Nobu Hotel, Pelican Hill Resort. Scents: Malibu, Newport Beach.',
    rating: 5,
    reviews: 9,
    badge: '33% OFF',
    saveAmount: 17.09,
    customButtonText: 'Add to Cart',
    inspiredBy: 'California Hotels',
    scents: 'Malibu, Newport Beach',
    destinationTag: 'California'
  },
  // Individual Bottles (Mediterranean Collection)
  {
    id: 'amalfi-breeze',
    name: 'Amalfi Breeze',
    price: 17.08,
    category: 'Fragrance Oils',
    image: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Santa Caterina. Sicilian Lemon, Pear, Vanilla.',
    rating: 5,
    reviews: 4,
    badge: 'New',
    customButtonText: 'Add to Cart',
    inspiredBy: 'Santa Caterina',
    scents: 'Sicilian Lemon, Pear, Vanilla',
    destinationTag: 'Mediterranean'
  },
  {
    id: 'mallorca',
    name: 'Mallorca',
    price: 17.08,
    category: 'Fragrance Oils',
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Belmond La Residencia. Grapefruit, Rose, Patchouli.',
    rating: 5,
    reviews: 3,
    badge: 'New',
    customButtonText: 'Add to Cart',
    inspiredBy: 'Belmond La Residencia',
    scents: 'Grapefruit, Rose, Patchouli',
    variants: ['20 ml', '50 ml', '120 ml'],
    destinationTag: 'Mediterranean'
  },
  {
    id: 'monte-carlo',
    name: 'Monte Carlo',
    price: 17.08,
    category: 'Fragrance Oils',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Hotel de Paris Monte-Carlo®. Marine, Sage, Vetiver.',
    rating: 5,
    reviews: 2,
    badge: 'New',
    customButtonText: 'Add to Cart',
    inspiredBy: 'Hotel de Paris',
    scents: 'Marine, Sage, Vetiver',
    destinationTag: 'Mediterranean'
  },
  {
    id: 'cote-dazur',
    name: 'Côte d\'Azur',
    price: 17.08,
    category: 'Fragrance Oils',
    image: 'https://images.unsplash.com/photo-1611145367651-6303b46e4040?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Carlton Cannes. Orange, Violet, Mint Leaf.',
    rating: 5,
    reviews: 1,
    badge: 'New',
    customButtonText: 'Add to Cart',
    inspiredBy: 'Carlton Cannes',
    scents: 'Orange, Violet, Mint Leaf',
    destinationTag: 'Mediterranean'
  },
  {
    id: 'palma-capri',
    name: 'Palma Capri',
    price: 17.08,
    category: 'Fragrance Oils',
    image: 'https://images.unsplash.com/photo-1606041011872-596597980b57?auto=format&fit=crop&q=80&w=600&h=600',
    description: 'Inspired by Hotel La Palma® Capri. Frangipani, Sandalwood, Tonka.',
    rating: 5,
    reviews: 2,
    badge: 'New',
    customButtonText: 'Add to Cart',
    inspiredBy: 'Hotel La Palma',
    scents: 'Frangipani, Sandalwood, Tonka',
    destinationTag: 'Mediterranean'
  }
];

const DESTINATIONS = [
  { id: 'all', label: 'All Destinations', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'Paris', label: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'London', label: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'Mediterranean', label: 'Mediterranean', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'Miami', label: 'Miami', image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'California', label: 'California', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'Coastal', label: 'Coastal', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=200&h=200' },
];

export function ScentVoyage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedDestination, setSelectedDestination] = useState('all');

  // Categories
  const categories = useMemo(() => {
    return Array.from(new Set(VOYAGE_PRODUCTS.map(p => p.category)));
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...VOYAGE_PRODUCTS];

    if (selectedCategory !== 'All Products') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (selectedDestination !== 'all') {
      result = result.filter(p => p.destinationTag === selectedDestination);
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
  }, [selectedCategory, selectedDestination, priceRange, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      <Seo
        title="Scent Voyage — Scentiment"
        description="Travel the world through scent. Explore destination-inspired discovery sets and premium fragrance oils."
        canonicalPath="/collection/voyage"
      />
      {/* Premium Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like effect (static for now but high quality) */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop" 
             alt="Luxury Hotel Hallway" 
             className="w-full h-full object-cover brightness-[0.6]"
           />
        </div>
        
        <div className="container-custom relative z-10 text-center px-4">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           >
              <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="h-[1px] w-12 bg-white/60"></div>
                 <span className="text-white/90 font-medium tracking-[0.2em] uppercase text-xs md:text-sm">
                   The World Collection
                 </span>
                 <div className="h-[1px] w-12 bg-white/60"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 text-white tracking-wide">
                Scent Voyage
              </h1>
              <p className="max-w-xl mx-auto text-white/80 text-lg font-light leading-relaxed tracking-wide">
                Embark on a sensory journey to the world's most iconic destinations. 
                Capturing the essence of luxury travel in every drop.
              </p>
           </motion.div>
        </div>
      </div>

      {/* Visual Destination Filter */}
      <section className="py-12 border-b border-gray-100 bg-gray-50/50">
         <div className="container-custom">
            <div className="text-center mb-8">
               <h3 className="font-serif text-2xl text-gray-900 mb-2">Explore by Destination</h3>
               <p className="text-gray-500 text-sm">Select a region to discover its signature scents</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-start lg:justify-center px-4">
               {DESTINATIONS.map((dest) => (
                 <button 
                   key={dest.id}
                   onClick={() => setSelectedDestination(dest.id)}
                   className={`flex flex-col items-center gap-3 min-w-[100px] group transition-all duration-300 ${selectedDestination === dest.id ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
                 >
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${selectedDestination === dest.id ? 'border-black shadow-lg' : 'border-transparent'}`}>
                       <img src={dest.image} alt={dest.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className={`text-xs uppercase tracking-widest font-medium ${selectedDestination === dest.id ? 'text-black' : 'text-gray-500'}`}>
                      {dest.label}
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
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            className="lg:sticky lg:top-24 h-fit hidden lg:block" 
          />
          {/* Note: I kept sidebar hidden on mobile by default but accessible via button, and visible on desktop. 
              Maybe for "Premium" feel we can hide it on desktop too? 
              Let's keep it for functionality but styled minimally.
          */}

          <main className="flex-1">
             {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sticky top-20 z-30 bg-white/95 backdrop-blur-md py-4 sm:py-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 sm:border-none transition-all duration-300">
              <div className="text-sm text-gray-500">
                {selectedDestination !== 'all' && <span className="text-black font-medium mr-1">{DESTINATIONS.find(d => d.id === selectedDestination)?.label}:</span>}
                Showing <span className="font-bold text-black">{filteredProducts.length}</span> scents
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6 font-light text-lg">No scents found in this region.</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setPriceRange([0, 200]);
                    setSelectedDestination('all');
                  }}
                  variant="outline"
                  className="uppercase tracking-widest text-xs"
                >
                  View All Destinations
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Featured Destination (Editorial Style) */}
      <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
           <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop" alt="Santorini" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="text-[#d4af37] font-medium tracking-[0.2em] uppercase text-xs mb-6 block">
              Editor's Pick
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight">
              Summer in <br/><i className="font-light">Santorini</i>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 font-light">
               Experience the crisp Aegean breeze, white-washed architecture, and volcanic earth. 
               Our upcoming Santorini collection brings the essence of the Greek islands to your living room.
            </p>
            <Button variant="secondary" className="bg-white text-black hover:bg-gray-200 border-none px-8 py-4 h-auto text-xs tracking-widest uppercase">
              Join the Waitlist
            </Button>
          </div>
          
          {/* Abstract Visual Element */}
          <div className="hidden md:block w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          
           <div className="text-right hidden md:block">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Launch Date</p>
              <p className="text-2xl font-serif">June 2024</p>
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
