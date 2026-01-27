import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck, Leaf, ChevronLeft, ChevronRight, Pause, Play, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCTS, REVIEWS, SAMPLE_PRODUCT_IMAGE } from '@/lib/data';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const HERO_ITEMS = [
  {
    title: 'DIFFUSER\nHVAC 2',
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    title: 'DIFFUSER\nPRO 2',
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    title: 'DIFFUSER\nAIR 2',
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    title: 'DIFFUSER\nMINI 2',
    image: SAMPLE_PRODUCT_IMAGE,
  },
];

const VIDEO_REVIEWS = [
  {
    id: 1,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-opening-a-gift-box-40746-large.mp4',
    product: 'Diffuser Air 2',
    coverage: 'Up to 1,000 sqft.',
    price: 59.99,
    originalPrice: 200,
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    id: 2,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-cream-on-her-face-39626-large.mp4',
    product: 'Diffuser Mini 2 LE',
    coverage: 'Up to 500 sqft.',
    price: 29.99,
    originalPrice: 100,
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    id: 3,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-glass-of-wine-40747-large.mp4',
    product: 'Diffuser Air 2',
    coverage: 'Up to 1,000 sqft.',
    price: 59.99,
    originalPrice: 200,
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    id: 4,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-perfume-40748-large.mp4',
    product: 'Diffuser Mini 2 LE',
    coverage: 'Up to 500 sqft.',
    price: 29.99,
    originalPrice: 100,
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    id: 5,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-opening-present-40749-large.mp4',
    product: 'Diffuser Air 2',
    coverage: 'Up to 1,000 sqft.',
    price: 59.99,
    originalPrice: 200,
    image: SAMPLE_PRODUCT_IMAGE,
  },
  {
    id: 6,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smelling-a-flower-40750-large.mp4',
    product: 'Diffuser Mini 2 LE',
    coverage: 'Up to 500 sqft.',
    price: 29.99,
    originalPrice: 100,
    image: SAMPLE_PRODUCT_IMAGE,
  },
];

export function Home() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(2);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHeroPaused) return;

    const interval = setInterval(() => {
      setHeroProgress((prev) => {
        if (prev >= 100) {
          setCurrentHeroIndex((curr) => (curr + 1) % HERO_ITEMS.length);
          return 0;
        }
        return prev + 1; // Approx 5 seconds total (100 * 50ms)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isHeroPaused, currentHeroIndex]);

  // Video Scroll Handler for "Center Big" effect
  useEffect(() => {
    const handleVideoScroll = () => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
        
        const cards = Array.from(container.children) as HTMLElement[];
        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;

        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - containerCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        setActiveVideoIndex(closestIndex);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleVideoScroll);
      // Initial center
      handleVideoScroll();
      
      // Scroll to center initial item (index 2)
      const cardWidth = 300; // Approx card width + gap
      container.scrollLeft = (cardWidth * 2) - (container.clientWidth / 2) + (cardWidth / 2);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleVideoScroll);
      }
    };
  }, []);

  const nextHeroSlide = () => {
    setCurrentHeroIndex((curr) => (curr + 1) % HERO_ITEMS.length);
    setHeroProgress(0);
  };

  const prevHeroSlide = () => {
    setCurrentHeroIndex((curr) => (curr - 1 + HERO_ITEMS.length) % HERO_ITEMS.length);
    setHeroProgress(0);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll by one card width approx
      const scrollAmount = 320; 
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Grid Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-0.5 bg-white">
        {/* Main Hero Banner */}
        <div className="relative h-[600px] lg:h-[700px] lg:col-span-2 overflow-hidden group">
          <div className="absolute inset-0">
            {/* Carousel Images */}
            <motion.div
              animate={{ x: `-${currentHeroIndex * 100}%` }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="flex h-full"
            >
              {HERO_ITEMS.map((item, index) => (
                <div key={index} className="relative min-w-full h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-2 z-20">
            {HERO_ITEMS.map((_, index) => (
              <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                {index === currentHeroIndex && (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isHeroPaused ? `${heroProgress}%` : '100%' }}
                    transition={{ duration: isHeroPaused ? 0 : 5, ease: 'linear' }}
                    className="h-full bg-white"
                  />
                )}
                {index < currentHeroIndex && <div className="h-full w-full bg-white" />}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute top-8 right-8 flex items-center gap-2 text-white z-20">
            <button 
              onClick={prevHeroSlide}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextHeroSlide}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsHeroPaused(!isHeroPaused)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isHeroPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentHeroIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 right-12 md:right-24 -translate-y-1/2 text-right text-white z-10"
            >
              <p 
                className="font-serif italic text-2xl md:text-3xl mb-2 text-white/90"
                style={{ fontFamily: 'cursive' }}
              >
                New!
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight tracking-wide whitespace-pre-line">
                {HERO_ITEMS[currentHeroIndex].title}
              </h1>
              <div>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-black uppercase tracking-widest px-8 py-6 text-sm"
                >
                  Shop Now
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-[600px] lg:h-[700px]">
          {/* Item 1: Diffuser Oils */}
          <Link to="/category/oils" className="relative bg-[#1e293b] flex flex-col items-center justify-center text-white overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors" />
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-bold block mb-2">$4</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Diffuser Oils</span>
            </div>
          </Link>

          {/* Item 2: Candles */}
          <Link to="/category/candles" className="relative bg-[#1e293b] flex flex-col items-center justify-center text-white overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors" />
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-bold block mb-2">$8</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Candles</span>
            </div>
          </Link>

          {/* Item 3: Room Sprays */}
          <Link to="/category/sprays" className="relative bg-[#1e293b] flex flex-col items-center justify-center text-white overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors" />
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-bold block mb-2">$16</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Room Sprays</span>
            </div>
          </Link>

          {/* Item 4: Designer Fragrances */}
          <Link to="/category/perfumes" className="relative bg-[#1e293b] flex flex-col items-center justify-center text-white overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors" />
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-bold block mb-2">$24</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest max-w-[120px] mx-auto leading-tight">Designer Fragrances</span>
            </div>
            {/* Scroll Indicator for grid (optional, matching screenshot look) */}
            <button className="absolute right-4 bottom-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm">
               <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Video Reviews Section */}
      <section className="py-16 bg-white overflow-hidden border-b border-gray-100">
        <div className="relative">
          {/* Scroll Controls */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Video List */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-12 px-[50%] scrollbar-hide snap-x snap-mandatory items-center py-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {VIDEO_REVIEWS.map((review, index) => {
              const isActive = index === activeVideoIndex;
              return (
                <div 
                  key={review.id}
                  className={`relative rounded-2xl overflow-hidden snap-center group cursor-pointer transition-all duration-500 ease-out flex-shrink-0
                    ${isActive ? 'w-[320px] h-[550px] shadow-2xl scale-110 z-10 my-0' : 'w-[280px] h-[480px] opacity-60 scale-90 grayscale-[0.5] my-0'}`}
                >
                  <video
                    src={review.video}
                    className="absolute inset-0 w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    autoPlay
                  />
                  <div className={`absolute inset-0 bg-black/10 transition-colors ${isActive ? 'group-hover:bg-black/20' : ''}`} />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button className="w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors">
                      <VolumeX className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors">
                      <Pause className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Card Overlay - Visible on ALL items, but styled differently for active */}
                  <div className={`absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg transition-all duration-300 z-20 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100 scale-90 origin-bottom'}`}>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={review.image} alt={review.product} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm mb-1 inline-block">SALE</span>
                            <h3 className="font-bold text-sm leading-tight">{review.product}</h3>
                            <p className="text-[10px] text-gray-500">{review.coverage}</p>
                          </div>
                        </div>
                        <div className="mt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-500">From</span>
                            <span className="font-bold text-sm">${review.price}</span>
                            <span className="text-xs text-gray-400 line-through">${review.originalPrice}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] font-bold text-red-600">WITH CODE: STORM</span>
                          </div>
                        </div>
                      </div>
                      <button className="self-end w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <span className="text-lg leading-none mb-0.5">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Luxury Hotel Fragrance Oils */}
            <Link to="/category/oils" className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800" 
                  alt="Luxury Hotel Fragrance Oils" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Scent Your Home Like a 5-Star Hotel</p>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">Luxury Hotel Fragrance Oils</h3>
              </div>
            </Link>

            {/* Card 2: Designer Scents */}
            <Link to="/category/perfumes" className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800" 
                  alt="Designer Scents" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Bring the Designer Fragrance Home</p>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">Designer Scents</h3>
              </div>
            </Link>

            {/* Card 3: Hotel Scent Voyage */}
            <Link to="/collection/voyage" className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800" 
                  alt="Hotel Scent Voyage" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Travel the World Through Scent</p>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">Hotel Scent Voyage</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Value Props */}
      <section className="py-12 border-b border-gray-100 bg-gray-50/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <Truck className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-sm mb-2">Free Shipping</h3>
              <p className="text-gray-500 text-sm">On all US orders over $100</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <Leaf className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-sm mb-2">Clean Ingredients</h3>
              <p className="text-gray-500 text-sm">Safe for pets and kids</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-bold uppercase tracking-wide text-sm mb-2">Satisfaction Guarantee</h3>
              <p className="text-gray-500 text-sm">30-day money back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
              <p className="text-gray-500 max-w-lg">Discover our most loved fragrances, curated to transform your space into a sanctuary.</p>
            </div>
            <a href="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wide hover:text-gray-600 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" className="w-full">View All Products</Button>
          </div>
        </div>
      </section>

      {/* Promotional Banner - Explore New Arrivals */}
      <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1605651202724-9b4dc807198f?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container-custom relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#d4af37] font-bold tracking-widest uppercase text-sm mb-2 block">Latest Drops</span>
            <h2 className="text-4xl md:text-5xl font-bold italic mb-6 leading-tight">Explore New Arrivals</h2>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Discover our newest fragrances, crafted to elevate your home with the season's finest scents.
              Experience the art of luxury home ambiance.
            </p>
            <Link to="/shop">
              <Button className="bg-white text-black hover:bg-gray-200 border-none">
                Explore Collection
              </Button>
            </Link>
          </div>
          <div className="relative">
             <div className="aspect-square bg-white/5 backdrop-blur-sm p-8 rounded-full flex items-center justify-center border border-white/10">
                <img 
                  src={SAMPLE_PRODUCT_IMAGE} 
                  alt="New Arrivals" 
                  className="rounded-lg shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500 max-w-[80%]"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <motion.div 
                key={review.id}
                whileHover={{ y: -5 }}
                className="bg-white p-8 shadow-sm border border-gray-100"
              >
                <div className="flex text-[#d4af37] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{review.text}"</p>
                <p className="font-bold text-sm uppercase tracking-wider">{review.name}</p>
                <p className="text-xs text-gray-400 mt-1">Verified Buyer</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram/Social Feed Mockup */}
      <section className="py-12">
        <div className="container-custom text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">@Scentiment</h2>
          <p className="text-gray-500">Follow us on Instagram for daily inspiration.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square relative group overflow-hidden bg-gray-200">
               <img 
                 src={SAMPLE_PRODUCT_IMAGE}
                 alt="Social post"
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                 <span className="font-bold">View Post</span>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
