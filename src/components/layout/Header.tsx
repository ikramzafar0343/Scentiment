import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_PRODUCT_IMAGE } from '@/lib/data';
import { Marquee } from '@/components/ui/motion/Marquee';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.658 29.273 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.155 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
      <path fill="#FF3D00" d="M6.306 14.691 12.841 19.48C14.608 15.108 18.884 12 24 12c3.059 0 5.842 1.155 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.354 4.33-17.694 10.691Z" />
      <path fill="#4CAF50" d="M24 44c5.165 0 9.86-1.977 13.409-5.195l-6.19-5.238C29.219 35.091 26.715 36 24 36c-5.252 0-9.62-3.317-11.283-7.946l-6.49 5.002C9.543 39.556 16.227 44 24 44Z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.03 12.03 0 0 1-4.084 5.567l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
    </svg>
  );
}

const NAV_LINKS = [
  { name: 'Shop All', href: '/shop' },
  { name: 'NEW', href: '/new' },
  { name: 'SALE', href: '/sale' },
  { 
    name: 'DIFFUSERS', 
    href: '/collections/scent-diffusers',
    badges: [
      { text: '$4 OILS', color: 'bg-red-600' },
      { text: 'ALMOST SOLD OUT', color: 'bg-red-600' }
    ]
  },
  { 
    name: 'DIFFUSER OILS', 
    href: '/collections/fragrance-oils' 
  },
  { 
    name: 'SCENT VOYAGE', 
    href: '/collection/voyage',
    badges: [
      { text: 'NEW', color: 'bg-red-600' }
    ]
  },
  { 
    name: 'ROOM SPRAYS', 
    href: '/collections/fragrance-room-sprays',
    badges: [
      { text: '50% OFF', color: 'bg-red-600' }
    ]
  },
  { name: 'CANDLES', href: '/collections/candles' },
  { name: 'PERFUMES', href: '/collections/perfumes' },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 11, m: 56, s: 51 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 11, m: 56, s: 51 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-xl tracking-widest font-bold">
      {String(time.h).padStart(2, '0')}h:{String(time.m).padStart(2, '0')}m:{String(time.s).padStart(2, '0')}s
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAccountOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAccountOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isAccountOpen]);

  const handleGoogleSignIn = () => {
    const googleAuthUrl = (import.meta.env as Record<string, string | undefined>)[
      'VITE_GOOGLE_AUTH_URL'
    ];
    window.location.assign(googleAuthUrl ?? '/auth/google');
  };

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col" onMouseLeave={() => setActiveMenu(null)}>
      {/* Top Black Bar */}
      <div className="bg-black/90 text-white py-2 relative z-[60] backdrop-blur-xl border-b border-white/10">
        <div className="container-custom flex items-center gap-4">
          <div className="hidden md:block shrink-0">
            <CountdownTimer />
          </div>
          <Marquee className="flex-1 text-[11px] tracking-[0.22em] uppercase text-white/80" speed={26}>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              Winter Event: extra 20% off
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              Free shipping over €100
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              Limited drops weekly
            </span>
          </Marquee>

          <div className="flex items-center gap-3 shrink-0">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Account"
              onClick={() => setIsAccountOpen(true)}
            >
              <User className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
              onClick={toggleCart}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={cn(
        'bg-white/90 backdrop-blur-xl transition-all duration-300 border-b border-black/5 relative z-[50]',
        isScrolled ? 'shadow-sm py-2' : 'py-4'
      )}>
        <div className="container-custom flex items-center gap-8">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="text-3xl font-serif font-semibold tracking-tight text-black shrink-0 mr-4">
            Scentiment
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            <Link to="/shop" className="bg-gray-900 text-white font-semibold px-6 py-2 rounded-sm text-sm hover:bg-black transition-colors uppercase whitespace-nowrap shadow-sm">
              SHOP NOW
            </Link>
            
            <nav className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <div 
                  key={link.name} 
                  className="relative group"
                  onMouseEnter={() => setActiveMenu(link.name)}
                >
                  {/* Badges Container */}
                  {link.badges && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-1 whitespace-nowrap pointer-events-none">
                      {link.badges.map((badge, idx) => (
                        <span key={idx} className={cn(
                          "text-[9px] font-bold text-white px-1 py-0.5 rounded-sm",
                          badge.color
                        )}>
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    to={link.href}
                    className="text-sm font-bold text-black hover:text-gray-600 transition-colors uppercase whitespace-nowrap py-4"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mega Menu for Shop All */}
        <AnimatePresence>
          {activeMenu === 'Shop All' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8 z-50"
              onMouseEnter={() => setActiveMenu('Shop All')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom grid grid-cols-5 gap-8">
                {/* Diffusers */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Diffusers" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">ALMOST SOLD OUT</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">DIFFUSERS</h3>
                </div>

                {/* Diffuser Oils */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Diffuser Oils" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">DIFFUSER OILS</h3>
                </div>

                {/* Room Sprays */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Room Sprays" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">50% OFF</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">ROOM SPRAYS</h3>
                </div>

                {/* Candles */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Candles" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">CANDLES</h3>
                </div>

                {/* Perfumes */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Perfumes" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">PERFUMES & COLOGNE</h3>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mega Menu for NEW */}
          {activeMenu === 'NEW' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8 z-50"
              onMouseEnter={() => setActiveMenu('NEW')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom grid grid-cols-4 gap-6">
                {/* Hotel */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Hotel Collection" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm">NEW</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">HOTEL</h3>
                </div>

                {/* Designer */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Designer Collection" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">DESIGNER</h3>
                </div>

                {/* Winter */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Winter Collection" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm">NEW 2025</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">WINTER</h3>
                </div>

                {/* Scent Voyage */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-4 w-full aspect-[4/3] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={SAMPLE_PRODUCT_IMAGE} 
                      alt="Scent Voyage" 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-max">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm">NEW</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">SCENT VOYAGE</h3>
                </div>
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
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8 z-50"
              onMouseEnter={() => setActiveMenu('DIFFUSERS')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom flex gap-8">
                {/* Sidebar Menu */}
                <div className="w-1/5 flex flex-col gap-3 text-gray-500 text-sm">
                  <Link to="/diffusers/all" className="hover:text-black transition-colors">Shop All Diffusers</Link>
                  <Link to="/diffusers/starter-kit" className="hover:text-black transition-colors">Build Your Starter Kit</Link>
                  <Link to="/diffusers/discovery-kits" className="hover:text-black transition-colors">Discovery Kits</Link>
                  <Link to="/diffusers/car" className="flex items-center gap-2 hover:text-black transition-colors">
                    Car Diffuser 
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">Sold Out</span>
                  </Link>
                  <Link to="/diffusers/reed" className="hover:text-black transition-colors">Reed Diffusers</Link>
                </div>

                {/* Products Grid */}
                <div className="flex-1 grid grid-cols-4 gap-6">
                  {/* Diffuser Air 2 Discovery Kit */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">72% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser Air 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER AIR 2 DISCOVERY KIT</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 1,000 sq ft.</p>
                  </div>

                  {/* Diffuser Mini 2 LE Discovery Kit */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">57% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser Mini 2 LE" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER MINI 2 LE DISCOVERY KIT</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers 500 sqft.</p>
                  </div>

                  {/* Diffuser Pro 2 */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">88% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser Pro 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER PRO 2</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 2,000 sqft.</p>
                  </div>

                  {/* Diffuser HVAC 2 */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-6 mb-4 aspect-[3/4] flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">75% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser HVAC 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
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
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8 z-50"
              onMouseEnter={() => setActiveMenu('DIFFUSER OILS')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom flex gap-16">
                {/* Left Column - Main Links */}
                <div className="flex flex-col gap-4 min-w-[200px]">
                  <Link to="/oils/all" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors">SHOP ALL</Link>
                  <Link to="/oils/sale" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors flex items-center gap-2">
                    SALE
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm">$4 OILS</span>
                  </Link>
                  <Link to="/oils/new" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors">NEW ARRIVALS</Link>
                  <Link to="/oils/best-sellers" className="text-gray-700 hover:text-black font-bold uppercase text-lg tracking-wide transition-colors">BEST-SELLERS</Link>
                </div>

                {/* Right Column - Collections */}
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
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-50"
              onMouseEnter={() => setActiveMenu('ROOM SPRAYS')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom">
                <div className="flex flex-col gap-4 text-gray-600 text-base">
                  <Link to="/collections/fragrance-room-sprays" className="hover:text-black transition-colors">Shop All Room Sprays</Link>
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
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 z-50"
              onMouseEnter={() => setActiveMenu('CANDLES')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom">
                <div className="flex flex-col gap-4 text-gray-600 text-base">
                  <Link to="/collections/candles" className="hover:text-black transition-colors">Shop All Candles</Link>
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
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8 z-50"
              onMouseEnter={() => setActiveMenu('PERFUMES')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container-custom flex gap-8">
                {/* Sidebar Menu */}
                <div className="w-1/5 flex flex-col gap-3 text-gray-500 text-sm">
                  <Link to="/collections/perfumes" className="hover:text-black transition-colors">Shop All</Link>
                  <Link to="/perfumes/mens" className="hover:text-black transition-colors">Men's Fragrances</Link>
                  <Link to="/perfumes/womens" className="hover:text-black transition-colors">Women's Fragrances</Link>
                  <Link to="/perfumes/unisex" className="hover:text-black transition-colors">Unisex Fragrances</Link>
                </div>

                {/* Products Grid */}
                <div className="flex-1 grid grid-cols-2 gap-8 max-w-2xl">
                  {/* Men's Discovery Set */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-8 mb-4 aspect-square flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">73% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Men's Fragrance Discovery Set" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">MEN'S FRAGRANCE DISCOVERY SET</h3>
                  </div>

                  {/* Women's Discovery Set */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl p-8 mb-4 aspect-square flex items-center justify-center">
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">73% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Women's Fragrance Discovery Set" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
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
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAccountOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-sm"
              onClick={() => setIsAccountOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 z-[80] h-dvh w-full max-w-md bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Sign in"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
                <h2 className="text-[13px] font-extrabold tracking-[0.22em] uppercase text-black">
                  Sign in or create account
                </h2>
                <button
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close"
                  onClick={() => setIsAccountOpen(false)}
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>

              <div className="px-6 py-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full rounded-sm border border-black/15 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black hover:bg-black/5 transition-colors flex items-center justify-center gap-3"
                >
                  <GoogleIcon className="h-5 w-5" />
                  <span>Sign in with Google</span>
                </button>

                <p className="mt-5 text-[11px] leading-relaxed text-black/60">
                  By clicking Continue you agree to our Privacy Policy and Terms &amp; Conditions.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
