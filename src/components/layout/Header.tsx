import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Layers2, Sparkles, Tag, Cloud, Beaker, Compass, Flame } from 'lucide-react';
import { GiSpray } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from '@/components/ui/motion/Marquee';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '@/components/ui/AuthModal';

// Sample product images
const SAMPLE_PRODUCT_IMAGE = '/src/assets/images/sample.png';
const DIFFUSER_IMAGE = 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=400&fit=crop';
const OIL_IMAGE = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop';
const SPRAY_IMAGE = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop';
const CANDLE_IMAGE = 'https://images.unsplash.com/photo-1602874805490-6b262a0c9b7e?w=400&h=400&fit=crop';
const PERFUME_IMAGE = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop';

const NAV_LINKS = [
  { 
    name: 'SHOP ALL', 
    href: '/shop',
    icon: Layers2
  },
  { 
    name: '#NEW', 
    href: '/new',
    icon: Sparkles
  },
  { 
    name: 'SALE', 
    href: '/sale',
    icon: Tag,
    badges: [
      { text: '$4 OILS', color: 'bg-red-600' },
      { text: 'ALMOST SOLD OUT', color: 'bg-red-600' }
    ]
  },
  { 
    name: 'DIFFUSERS', 
    href: '/collections/scent-diffusers',
    icon: Cloud,
    image: DIFFUSER_IMAGE
  },
  { 
    name: 'DIFFUSER OILS', 
    href: '/collections/fragrance-oils',
    icon: Beaker,
    image: OIL_IMAGE
  },
  { 
    name: 'SCENT VOYAGE', 
    href: '/collection/voyage',
    icon: Compass,
    badges: [
      { text: 'NEW', color: 'bg-red-600' }
    ],
    image: SAMPLE_PRODUCT_IMAGE
  },
  { 
    name: 'ROOM SPRAYS', 
    href: '/collections/fragrance-room-sprays',
    icon: GiSpray,
    badges: [
      { text: '50% OFF', color: 'bg-red-600' }
    ],
    image: SPRAY_IMAGE
  },
  { 
    name: 'CANDLES', 
    href: '/collections/candles',
    icon: Flame,
    image: CANDLE_IMAGE
  },
  { 
    name: 'PERFUMES', 
    href: '/collections/perfumes',
    icon: Sparkles,
    image: PERFUME_IMAGE
  },
];

const PROMOTIONAL_MESSAGES = [
  'FREE SHIPPING OVER €100',
  'LIMITED DROPS WEEKLY',
  'WINTER EVENT: EXTRA 20% OFF',
  'FREE SHIPPING OVER €100',
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 11, m: 49, s: 1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 11, m: 49, s: 1 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-sm sm:text-base tracking-wider font-bold">
      <span className="text-gray-700">{String(time.h).padStart(2, '0')}h:</span>
      <span className="text-[#D4AF37]">{String(time.m).padStart(2, '0')}m:</span>
      <span className="text-[#D4AF37]">{String(time.s).padStart(2, '0')}s</span>
    </div>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  return (
    <header 
      className="fixed top-0 w-full z-50 flex flex-col" 
      style={{ overflow: 'visible' }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* Top Light Blue-Grey Announcement Bar */}
      <div className="bg-slate-200 text-gray-800 py-2 relative z-50">
        <div className="container-custom flex items-center justify-between gap-4">
          {/* Left: Countdown Timer */}
          <div className="flex items-center shrink-0">
            <CountdownTimer />
          </div>

          {/* Middle: Scrolling Promotional Messages */}
          <div className="flex-1 mx-4 sm:mx-8 overflow-hidden min-w-0">
            <Marquee speed={24} className="text-xs sm:text-sm text-gray-700">
              {PROMOTIONAL_MESSAGES.map((message, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                  <span>{message}</span>
                </span>
              ))}
            </Marquee>
          </div>

          {/* Right: Utility Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="[&>button]:w-8 [&>button]:h-8 [&>button]:sm:w-9 [&>button]:sm:h-9 [&>button]:rounded-full [&>button]:bg-white [&>button]:border [&>button]:border-gray-300 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:hover:bg-gray-50 [&>button]:transition-colors [&>button]:shadow-sm [&>button]:p-0">
              <HeaderSearch />
            </div>
            <button 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm relative cursor-pointer"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label={isAuthenticated ? "Account" : "Sign in"}
              type="button"
            >
              <User className="w-4 h-4 text-black" />
              {isAuthenticated && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              )}
            </button>
            <button
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors relative shadow-sm cursor-pointer"
              onClick={toggleCart}
              aria-label="Open cart"
              type="button"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (White with Subtle Blue Gradient) */}
      <div className={cn(
        'bg-white relative z-40',
        'bg-gradient-to-r from-white via-blue-50/20 to-blue-50/30'
      )} style={{ overflow: 'visible' }}>
        <div className="container-custom" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-between py-2" style={{ overflow: 'visible', position: 'relative' }}>
            {/* Logo */}
                  <Link to="/" className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-black leading-none shrink-0">
                    AROMAZUR
                  </Link>

            {/* Desktop Nav - Horizontal Slider */}
            <div className="hidden lg:block flex-1 min-w-0 ml-8">
              <div className="relative overflow-visible">
                {/* Gradient Overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white via-blue-50/20 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white via-blue-50/20 to-transparent" />
                
                {/* Scrollable Navigation */}
                <div 
                  ref={navScrollRef}
                  className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 overflow-y-visible"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {NAV_LINKS.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <div 
                        key={link.name} 
                        className="relative group shrink-0 overflow-visible flex flex-col items-center justify-end"
                        onMouseEnter={() => setActiveMenu(link.name)}
                      >
                        <div className="h-[16px] flex items-center gap-1 whitespace-nowrap pointer-events-none mb-0.5">
                          {link.badges?.map((badge, idx) => (
                            <span 
                              key={idx} 
                              className={cn(
                                "text-[9px] font-extrabold text-white px-2 py-[2px] rounded-sm whitespace-nowrap shadow-md leading-none",
                                badge.color
                              )}
                            >
                              {badge.text}
                            </span>
                          ))}
                        </div>
                        
                        <Link
                          to={link.href}
                          className="flex items-center gap-1.5 text-sm font-bold text-black hover:text-gray-600 transition-colors uppercase whitespace-nowrap py-2 px-1"
                        >
                          <IconComponent className={cn(
                            "w-4 h-4 transition-colors shrink-0",
                            link.name === 'SHOP ALL' ? "text-gray-400" : "text-black"
                          )} />
                          <span>{link.name}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-black ml-4"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mega Menus - Positioned directly below navigation bar */}
        <AnimatePresence>
          {/* Mega Menu for Shop All */}
          {activeMenu === 'SHOP ALL' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-[60]"
              onMouseEnter={() => setActiveMenu('SHOP ALL')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom grid grid-cols-5 gap-8">
                <Link to="/collections/scent-diffusers" className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={DIFFUSER_IMAGE} 
                      alt="Diffusers" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                      }}
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">ALMOST SOLD OUT</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">DIFFUSERS</h3>
                </Link>

                <Link to="/collections/fragrance-oils" className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={OIL_IMAGE} 
                      alt="Diffuser Oils" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">DIFFUSER OILS</h3>
                </Link>

                <Link to="/collections/fragrance-room-sprays" className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SPRAY_IMAGE} 
                      alt="Room Sprays" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                      }}
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">50% OFF</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">ROOM SPRAYS</h3>
                </Link>

                <Link to="/collections/candles" className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={CANDLE_IMAGE} 
                      alt="Candles" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">CANDLES</h3>
                </Link>

                <Link to="/collections/perfumes" className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={PERFUME_IMAGE} 
                      alt="Perfumes" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">PERFUMES</h3>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Mega Menu for DIFFUSERS */}
          {activeMenu === 'DIFFUSERS' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-[60]"
              onMouseEnter={() => setActiveMenu('DIFFUSERS')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom flex gap-8">
                <div className="w-1/5 flex flex-col gap-3 text-gray-500 text-sm">
                  <Link to="/collections/scent-diffusers" className="hover:text-black transition-colors font-semibold">Shop All Diffusers</Link>
                  <Link to="/diffusers/starter-kit" className="hover:text-black transition-colors">Build Your Starter Kit</Link>
                  <Link to="/diffusers/discovery-kits" className="hover:text-black transition-colors">Discovery Kits</Link>
                  <Link to="/diffusers/car" className="flex items-center gap-2 hover:text-black transition-colors">
                    Car Diffuser 
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">Sold Out</span>
                  </Link>
                  <Link to="/diffusers/reed" className="hover:text-black transition-colors">Reed Diffusers</Link>
                </div>

                <div className="flex-1 grid grid-cols-4 gap-6">
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">72% OFF</span>
                      <img 
                        src={DIFFUSER_IMAGE} 
                        alt="Diffuser Air 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER AIR 2 DISCOVERY KIT</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 1,000 sq ft.</p>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">57% OFF</span>
                      <img 
                        src={DIFFUSER_IMAGE} 
                        alt="Diffuser Mini 2 LE" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER MINI 2 LE</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers 500 sqft.</p>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">88% OFF</span>
                      <img 
                        src={DIFFUSER_IMAGE} 
                        alt="Diffuser Pro 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER PRO 2</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 2,000 sqft.</p>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">75% OFF</span>
                      <img 
                        src={DIFFUSER_IMAGE} 
                        alt="Diffuser HVAC 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER HVAC 2</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 5,000 sqft.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mega Menu for DIFFUSER OILS */}
          {activeMenu === 'DIFFUSER OILS' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-[60]"
              onMouseEnter={() => setActiveMenu('DIFFUSER OILS')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom flex gap-16">
                <div className="flex flex-col gap-4 min-w-[200px]">
                  <Link to="/collections/fragrance-oils" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors">SHOP ALL</Link>
                  <Link to="/oils/sale" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors flex items-center gap-2">
                    SALE
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm">$4 OILS</span>
                  </Link>
                  <Link to="/oils/new" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors">NEW ARRIVALS</Link>
                  <Link to="/oils/best-sellers" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors">BEST-SELLERS</Link>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-gray-700 font-bold uppercase text-lg tracking-wide mb-2">COLLECTIONS</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                    <Link to="/collections/hotel" className="text-gray-500 hover:text-black transition-colors text-sm uppercase tracking-wider">HOTEL</Link>
                    <Link to="/collections/designer" className="text-gray-500 hover:text-black transition-colors text-sm uppercase tracking-wider">DESIGNER</Link>
                    <Link to="/collections/winter" className="text-gray-500 hover:text-black transition-colors text-sm uppercase tracking-wider">WINTER</Link>
                    <Link to="/collections/scent-voyage" className="text-gray-500 hover:text-black transition-colors text-sm uppercase tracking-wider">SCENT VOYAGE</Link>
                    <Link to="/collections/disney" className="text-gray-500 hover:text-black transition-colors text-sm uppercase tracking-wider">DISNEY</Link>
                    <Link to="/collections/spring" className="text-gray-500 hover:text-black transition-colors text-sm uppercase tracking-wider">SPRING</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mega Menu for ROOM SPRAYS */}
          {activeMenu === 'ROOM SPRAYS' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-[60]"
              onMouseEnter={() => setActiveMenu('ROOM SPRAYS')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom">
                <div className="flex flex-col gap-4 text-gray-600 text-base">
                  <Link to="/collections/fragrance-room-sprays" className="hover:text-black transition-colors font-semibold">Shop All Room Sprays</Link>
                  <Link to="/sprays/hotel" className="hover:text-black transition-colors">Hotel Room Sprays</Link>
                  <Link to="/sprays/designer" className="hover:text-black transition-colors">Designer Room Sprays</Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mega Menu for CANDLES */}
          {activeMenu === 'CANDLES' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-[60]"
              onMouseEnter={() => setActiveMenu('CANDLES')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom">
                <div className="flex flex-col gap-4 text-gray-600 text-base">
                  <Link to="/collections/candles" className="hover:text-black transition-colors font-semibold">Shop All Candles</Link>
                  <Link to="/candles/hotel" className="hover:text-black transition-colors">Hotel Candles</Link>
                  <Link to="/candles/designer" className="hover:text-black transition-colors">Designer Candles</Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mega Menu for PERFUMES */}
          {activeMenu === 'PERFUMES' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-[60]"
              onMouseEnter={() => setActiveMenu('PERFUMES')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom flex gap-8">
                <div className="w-1/5 flex flex-col gap-3 text-gray-500 text-sm">
                  <Link to="/collections/perfumes" className="hover:text-black transition-colors font-semibold">Shop All</Link>
                  <Link to="/perfumes/mens" className="hover:text-black transition-colors">Men's Fragrances</Link>
                  <Link to="/perfumes/womens" className="hover:text-black transition-colors">Women's Fragrances</Link>
                  <Link to="/perfumes/unisex" className="hover:text-black transition-colors">Unisex Fragrances</Link>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-8 max-w-2xl">
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-8 mb-4 aspect-square flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">73% OFF</span>
                      <img 
                        src={PERFUME_IMAGE} 
                        alt="Men's Fragrance Discovery Set" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">MEN'S FRAGRANCE DISCOVERY SET</h3>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-8 mb-4 aspect-square flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">73% OFF</span>
                      <img 
                        src={PERFUME_IMAGE} 
                        alt="Women's Fragrance Discovery Set" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_PRODUCT_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">WOMEN'S FRAGRANCE DISCOVERY SET</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold tracking-widest uppercase">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-2 text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
