import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, ChevronLeft, ChevronRight, BarChart2, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock Data for the Voyage Collection Carousel
const VOYAGE_COLLECTION = [
  {
    id: 'miami-discovery',
    name: 'Miami Hotel Discovery Set',
    inspiredBy: 'Inspired by 1 Hotel® Miami Beach, Delano® Beach Club, Confidante Hotel',
    scents: 'The One, Hot Miami, Ocean Views',
    price: 34.16,
    originalPrice: 51.25,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1594035910387-fea477942698?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    type: 'set'
  },
  {
    id: 'coastal-discovery',
    name: 'Coastal Hotel Discovery Set',
    inspiredBy: 'Inspired by Soneva Jani Maldives, Eden Rock St. Barths, Montage Laguna Beach & more',
    scents: 'Maldives, St. Barths, The Laguna Hotel & more',
    price: 34.16,
    originalPrice: 51.25,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    hasTopToggle: true,
    type: 'set'
  },
  {
    id: 'paris-discovery',
    name: 'Paris Hotel Discovery Set',
    inspiredBy: 'Inspired by Hotel Costes®, Ritz-Carlton® Paris, Le Bristol Paris',
    scents: 'French Hotel, Vendôme, Crown Jewel',
    price: 34.16,
    originalPrice: 51.25,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    type: 'set'
  },
  {
    id: 'mediterranean-discovery',
    name: 'Mediterranean Hotel Discovery Set',
    inspiredBy: 'Inspired by Santa Caterina Hotel, Hotel de Paris Monte-Carlo, Carlton Cannes, a Regent Hotel and more',
    scents: 'Amalfi Breeze, Monte Carlo, Côte d\'Azur & more',
    price: 34.16,
    originalPrice: 51.25,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1523293188086-b589b9e5aadf?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    type: 'set'
  },
  {
    id: 'london-discovery',
    name: 'London Hotel Discovery Set',
    inspiredBy: 'Inspired by The Connaught, The Lanesborough, Rosewood London and more',
    scents: 'Royal Hall, Hyde Park, Tea Room & more',
    price: 34.16,
    originalPrice: 51.25,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    type: 'set'
  },
  {
    id: 'california-discovery',
    name: 'California Hotel Discovery Set',
    inspiredBy: 'Inspired by Nobu Hotel, Pelican Hill Resort, Montage Laguna Beach',
    scents: 'Malibu, Newport Beach, The Laguna Hotel',
    price: 34.16,
    originalPrice: 51.25,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1585232351009-3114ff160ac1?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    type: 'set'
  }
];

const MEDITERRANEAN_COLLECTION = [
  {
    id: 'hotel-scent-voyage',
    name: 'Hotel Scent Voyage Discovery Sets',
    inspiredBy: 'Inspired by 5-Star Hotels Around the World',
    price: 34.16,
    originalPrice: 85.42,
    discount: '60% OFF',
    image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=600&h=600',
    bottleImage: 'https://images.unsplash.com/photo-1594035910387-fea477942698?auto=format&fit=crop&q=80&w=400',
    badge: 'Best-Seller',
    type: 'set'
  },
  {
    id: 'amalfi-breeze',
    name: 'Amalfi Breeze',
    inspiredBy: 'Inspired by Santa Caterina',
    scents: 'Sicilian Lemon, Pear, Vanilla',
    price: 17.08,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=600&h=600', // Lemon bg
    bottleImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    intensity: 'Medium',
    type: 'bottle'
  },
  {
    id: 'mallorca',
    name: 'Mallorca',
    inspiredBy: 'Inspired by Belmond La Residencia (Deià)',
    scents: 'Grapefruit, Rose, Patchouli',
    price: 17.08,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&q=80&w=600&h=600', // Grapefruit bg
    bottleImage: 'https://images.unsplash.com/photo-1523293188086-b589b9e5aadf?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    intensity: 'Medium',
    type: 'bottle',
    variants: ['20 ml', '50 ml', '120 ml', '500 ml']
  },
  {
    id: 'monte-carlo',
    name: 'Monte Carlo',
    inspiredBy: 'Inspired by Hotel de Paris Monte-Carlo®',
    scents: 'Marine, Sage, Vetiver',
    price: 17.08,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600&h=600', // Wine/Sage bg
    bottleImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    intensity: 'Medium',
    rating: 5,
    reviews: 2,
    type: 'bottle'
  },
  {
    id: 'cote-dazur',
    name: 'Côte d\'Azur',
    inspiredBy: 'Inspired by Carlton Cannes, a Regent Hotel®',
    scents: 'Orange, Violet, Mint Leaf',
    price: 17.08,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1611145367651-6303b46e4040?auto=format&fit=crop&q=80&w=600&h=600', // Orange bg
    bottleImage: 'https://images.unsplash.com/photo-1585232351009-3114ff160ac1?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    intensity: 'Medium',
    rating: 5,
    reviews: 1,
    type: 'bottle'
  },
  {
    id: 'palma-capri',
    name: 'Palma Capri',
    inspiredBy: 'Inspired by Hotel La Palma® Capri',
    scents: 'Frangipani, Sandalwood, Tonka',
    price: 17.08,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1606041011872-596597980b57?auto=format&fit=crop&q=80&w=600&h=600', // Floral bg
    bottleImage: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=400',
    badge: 'New',
    intensity: 'Medium',
    rating: 5,
    reviews: 2,
    type: 'bottle'
  }
];

export function ScentVoyage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const medScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 350; // approximate card width
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left: Image */}
        <div className="relative h-[400px] lg:h-full w-full bg-gray-200 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200"
            alt="London Street Scene"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gradient for better text contrast if needed, but per design it's clean image */}
        </div>
        {/* Right: Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 bg-[#fafafa]">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-gray-900 leading-tight">
              Travel the World Through Scent
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              Our newest collection is inspired by iconic luxury hotels across Europe, United Kingdom, and coastal destinations. Bring five-star ambiance, elevated comfort, and unforgettable atmosphere into your home.
            </p>
            <Button className="bg-transparent text-black border-none p-0 hover:bg-transparent hover:text-gray-600 font-bold text-base flex items-center gap-2 group uppercase tracking-wide">
              Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Discovery Sets Carousel */}
      <section className="py-20 bg-white relative">
        <div className="container-custom">
          {/* Carousel Controls */}
          <button 
            onClick={() => scroll(scrollContainerRef, 'left')} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white shadow-md rounded-full flex items-center justify-center transition-all lg:hidden"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll(scrollContainerRef, 'right')} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white shadow-md rounded-full flex items-center justify-center transition-all lg:hidden"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {VOYAGE_COLLECTION.map((item) => (
              <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer">
                {/* Image Area */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {/* Background Scenery */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Bottles - Photo Card Style */}
                  <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                    <div className="w-[60%] aspect-[3/4] relative shadow-xl rounded-sm overflow-hidden border border-white/80 bg-white">
                      <img 
                        src={item.bottleImage} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                    {item.badge}
                  </div>
                  <button className="absolute top-4 right-4 text-gray-900 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Add To Cart Overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-[#1a1a1a] text-white hover:bg-black uppercase tracking-widest text-xs py-3">
                      Add To Cart
                    </Button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-2">
                  <h3 className="font-medium text-base text-gray-900">{item.name}</h3>
                  <p className="text-[11px] text-gray-500 leading-tight">{item.inspiredBy}</p>
                  <p className="text-[11px] text-gray-400 italic">{item.scents}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-sm text-gray-900">€{String(item.price).replace('.', ',')} EUR</span>
                    <span className="text-xs text-gray-400 line-through">€{String(item.originalPrice).replace('.', ',')}</span>
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{item.discount}</span>
                  </div>

                  {item.hasTopToggle && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-1 text-[10px] border border-gray-300 rounded hover:border-black transition-colors">Top 3</button>
                      <button className="flex-1 py-1 text-[10px] border border-gray-300 rounded hover:border-black transition-colors">Top 5</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full hover:bg-black transition-colors uppercase tracking-widest text-xs font-bold">
              View Full Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Mediterranean Escape Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left: Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 bg-[#fafafa]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-gray-900 leading-tight">
              Mediterranean Escape
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              Sun-soaked elegance inspired by coastal hotels in Italy, Monaco, Mallorca, and Cannes. These scents capture warm breezes, relaxed luxury, and the effortless charm of seaside living.
            </p>
            <Button className="bg-transparent text-black border-none p-0 hover:bg-transparent hover:text-gray-600 font-bold text-base flex items-center gap-2 group uppercase tracking-wide">
              Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Right: Image */}
        <div className="relative h-[400px] lg:h-full w-full bg-gray-200 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200"
            alt="Mediterranean Amalfi Coast"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay bottle image - Photo Card Style */}
          <div className="absolute inset-0 flex items-center justify-center translate-y-12">
             <div className="w-[280px] aspect-[3/4] relative shadow-2xl rounded-sm overflow-hidden border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1594035910387-fea477942698?auto=format&fit=crop&q=80&w=600" 
                 alt="Amalfi Breeze" 
                 className="w-full h-full object-cover"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Mediterranean Collection Carousel */}
      <section className="py-20 bg-white relative">
        <div className="container-custom">
          {/* Carousel Controls */}
          <button 
            onClick={() => scroll(medScrollRef, 'left')} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white shadow-md rounded-full flex items-center justify-center transition-all lg:hidden"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll(medScrollRef, 'right')} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white shadow-md rounded-full flex items-center justify-center transition-all lg:hidden"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={medScrollRef}
            className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {MEDITERRANEAN_COLLECTION.map((item) => (
              <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer">
                {/* Image Area */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {/* Background Scenery/Ingredient */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Bottle - Photo Card Style */}
                  <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                    <div className="w-[60%] aspect-[3/4] relative shadow-xl rounded-sm overflow-hidden border border-white/80 bg-white">
                      <img 
                        src={item.bottleImage} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                    {item.badge}
                  </div>
                  <button className="absolute top-4 right-4 text-gray-900 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Add To Cart Overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-[#1a1a1a] text-white hover:bg-black uppercase tracking-widest text-xs py-3">
                      View Full Collection
                    </Button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-2">
                  <h3 className="font-medium text-base text-gray-900">{item.name}</h3>
                  <p className="text-[11px] text-gray-500 leading-tight">{item.inspiredBy}</p>
                  <p className="text-[11px] text-gray-400 italic">{item.scents}</p>
                  
                  {item.intensity && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                       <BarChart2 className="w-3 h-3" />
                       <span className="font-medium">{item.intensity}</span>
                       <Info className="w-3 h-3 text-gray-400 ml-1" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">From</span>
                    <span className="font-bold text-sm text-gray-900">€{String(item.price).replace('.', ',')} EUR</span>
                    {item.originalPrice && (
                       <>
                         <span className="text-xs text-gray-400 line-through">€{String(item.originalPrice).replace('.', ',')}</span>
                         <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{item.discount}</span>
                       </>
                    )}
                  </div>

                  {item.variants && (
                    <div className="flex gap-2 mt-3">
                      {item.variants.slice(0, 3).map(v => (
                         <button key={v} className="flex-1 py-1 text-[10px] border border-gray-300 rounded hover:border-black transition-colors">{v}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full hover:bg-black transition-colors uppercase tracking-widest text-xs font-bold">
              View Full Collection
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
