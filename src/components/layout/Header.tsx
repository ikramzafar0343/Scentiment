import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiShoppingBag, HiMenu, HiX, HiUser } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_PRODUCT_IMAGE } from '@/lib/data';
import { Marquee } from '@/components/ui/motion/Marquee';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { useHeaderConfig } from '@/hooks/useHeaderConfig';
import { getIconById } from '@/configs/icons/iconRegistry';
import { loginEmailPassword, signupEmailPassword } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useSellerStore } from '@/store/useSellerStore';

const ACCENT_CLASS: Record<'gold' | 'accent' | 'primary', string> = {
  gold: '[color:var(--ds-gold)]',
  accent: '[color:var(--ds-accent)]',
  primary: '[color:var(--ds-primary)]',
};

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
    <div className="font-mono text-xl tracking-widest font-bold bg-gradient-to-r from-black via-[color:var(--ds-gold)] to-black bg-clip-text text-transparent">
      {String(time.h).padStart(2, '0')}h:{String(time.m).padStart(2, '0')}m:{String(time.s).padStart(2, '0')}s
    </div>
  );
}

export function Header() {
  const { navLinks, announcements, marqueeSpeed } = useHeaderConfig();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<'signin' | 'signup'>('signin');
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const setAuthSession = useAuthStore((s) => s.setSession);
  const setSeller = useSellerStore((s) => s.setSeller);
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

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return Boolean(e.includes('@') && password.trim().length >= 6);
  }, [email, password]);

  const resetAuthUi = () => {
    setAuthStatus('idle');
    setAuthError('');
  };

  const onSubmitEmailAuth = async () => {
    resetAuthUi();
    setAuthStatus('loading');
    try {
      const session =
        accountMode === 'signup'
          ? await signupEmailPassword({
              email: email.trim(),
              password: password.trim(),
              firstName: firstName.trim() || undefined,
              lastName: lastName.trim() || undefined,
            })
          : await loginEmailPassword({ email: email.trim(), password: password.trim() });

      setAuthSession({ user: session.user, tokens: session.tokens });

      // If admin, also set Seller store so seller pages render without placeholder state.
      if (session.user.role === 'admin') {
        setSeller({
          id: session.user.id,
          name: session.user.email.split('@')[0] || 'Admin',
          email: session.user.email,
          isVerified: true,
          verificationStatus: 'approved',
        });
        setIsAccountOpen(false);
        navigate('/seller/dashboard');
        setAuthStatus('success');
        return;
      }

      setAuthStatus('success');
      setIsAccountOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Authentication failed';
      setAuthError(msg);
      setAuthStatus('error');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col" onMouseLeave={() => setActiveMenu(null)}>
      {/* Top Black Bar */}
      <div className="bg-white/80 backdrop-blur-md text-black py-2 relative z-[60] border-b border-gray-200/50">
        <div className="container-custom flex items-center gap-4">
          <div className="hidden md:block shrink-0">
            <CountdownTimer />
          </div>
          <Marquee className="flex-1 text-[11px] tracking-[0.22em] uppercase" speed={marqueeSpeed}>
            {announcements.map((item) => (
              <span key={item.text} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--ds-gold)]" />
                <span
        className={cn(
                    'bg-gradient-to-r from-black to-black bg-clip-text text-transparent font-semibold',
                    `via-${ACCENT_CLASS[item.accent]}`
                  )}
                >
                  {item.text}
                </span>
              </span>
            ))}
          </Marquee>

          <div className="flex items-center gap-3 shrink-0">
            <HeaderSearch />
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Account"
              onClick={() => setIsAccountOpen(true)}
            >
              <HiUser className="w-5 h-5 text-black" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={toggleCart}
              aria-label="Open cart"
            >
              <HiShoppingBag className="w-5 h-5 text-black" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
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
        <div className="container-custom flex items-center gap-8 relative">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <HiMenu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="text-3xl font-serif font-semibold tracking-tight text-black shrink-0 mr-4">
            Scentiment
          </Link>

          {/* Desktop Nav - Horizontal Slider */}
          <div className="hidden lg:flex items-center gap-6 flex-1 min-w-0 overflow-visible">
            <div className="relative flex-1 min-w-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white/90 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white/90 to-transparent" />

              <nav
                className="flex items-center gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2"
              >
              {navLinks.map((link) => {
                const Icon = getIconById(link.iconId);
                return (
                <div 
                  key={link.name} 
                  className="relative group shrink-0"
                  onMouseEnter={() => setActiveMenu(link.name)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'relative flex items-center gap-1.5 text-sm font-bold text-black hover:text-gray-600 transition-colors uppercase whitespace-nowrap',
                      link.badges ? 'pt-8 pb-3' : 'py-4'
                    )}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {link.badges && (
                      <span
                        className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                        aria-hidden="true"
                      >
                        {link.badges.map((badge) => (
                          <span
                            key={badge.text}
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[9px] font-extrabold leading-none text-white shadow-sm whitespace-nowrap',
                              badge.colorClass
                            )}
                          >
                            {badge.text}
                          </span>
                        ))}
                      </span>
                    )}
                    <span>{link.name}</span>
                    {link.badges && (
                      <span className="sr-only">{link.badges.map((b) => b.text).join(', ')}</span>
                    )}
                  </Link>
                </div>
              )})}
              </nav>
            </div>
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
                <div className="w-1/5 flex flex-col gap-1 text-gray-500 text-sm">
                  <Link to="/diffusers/all" className="ui-menu-item ui-focus-ring">Shop All Diffusers</Link>
                  <Link to="/diffusers/starter-kit" className="ui-menu-item ui-focus-ring">Build Your Starter Kit</Link>
                  <Link to="/diffusers/discovery-kits" className="ui-menu-item ui-focus-ring">Discovery Kits</Link>
                  <Link to="/diffusers/car" className="ui-menu-item ui-focus-ring flex items-center gap-2">
                    Car Diffuser 
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold leading-none text-white">Sold Out</span>
                  </Link>
                  <Link to="/diffusers/reed" className="ui-menu-item ui-focus-ring">Reed Diffusers</Link>
                </div>

                {/* Products Grid */}
                <div className="flex-1 grid grid-cols-4 gap-6">
                  {/* Diffuser Air 2 Discovery Kit */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl border border-black/10 p-6 mb-4 aspect-[3/4] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                      <span className="absolute top-3 left-3 rounded-full bg-black text-white text-[10px] font-extrabold px-2.5 py-1 leading-none">72% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser Air 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ui-focus-ring" aria-label="View Diffuser Air 2">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER AIR 2 DISCOVERY KIT</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 1,000 sq ft.</p>
                  </div>

                  {/* Diffuser Mini 2 LE Discovery Kit */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl border border-black/10 p-6 mb-4 aspect-[3/4] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                      <span className="absolute top-3 left-3 rounded-full bg-black text-white text-[10px] font-extrabold px-2.5 py-1 leading-none">57% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser Mini 2 LE" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ui-focus-ring" aria-label="View Diffuser Mini 2">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER MINI 2 LE DISCOVERY KIT</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers 500 sqft.</p>
                  </div>

                  {/* Diffuser Pro 2 */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl border border-black/10 p-6 mb-4 aspect-[3/4] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                      <span className="absolute top-3 left-3 rounded-full bg-black text-white text-[10px] font-extrabold px-2.5 py-1 leading-none">88% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser Pro 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ui-focus-ring" aria-label="View Diffuser Pro 2">
                        +
                      </button>
                    </div>
                    <h3 className="font-bold text-sm uppercase text-center leading-tight mb-1">DIFFUSER PRO 2</h3>
                    <p className="text-gray-500 text-xs text-center italic">Covers up to 2,000 sqft.</p>
                  </div>

                  {/* Diffuser HVAC 2 */}
                  <div className="group cursor-pointer">
                    <div className="relative bg-gray-50 rounded-xl border border-black/10 p-6 mb-4 aspect-[3/4] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                      <span className="absolute top-3 left-3 rounded-full bg-black text-white text-[10px] font-extrabold px-2.5 py-1 leading-none">75% OFF</span>
                      <img 
                        src={SAMPLE_PRODUCT_IMAGE} 
                        alt="Diffuser HVAC 2" 
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      />
                      <button className="absolute bottom-3 right-3 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ui-focus-ring" aria-label="View Diffuser HVAC 2">
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
                <div className="flex flex-col gap-1 text-gray-600 text-base max-w-sm">
                  <Link to="/collections/fragrance-room-sprays" className="ui-menu-item ui-focus-ring">Shop All Room Sprays</Link>
                  <Link to="/sprays/hotel" className="ui-menu-item ui-focus-ring">Hotel Room Sprays</Link>
                  <Link to="/sprays/designer" className="ui-menu-item ui-focus-ring">Designer Room Sprays</Link>
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
                <div className="flex flex-col gap-1 text-gray-600 text-base max-w-sm">
                  <Link to="/collections/candles" className="ui-menu-item ui-focus-ring">Shop All Candles</Link>
                  <Link to="/candles/hotel" className="ui-menu-item ui-focus-ring">Hotel Candles</Link>
                  <Link to="/candles/designer" className="ui-menu-item ui-focus-ring">Designer Candles</Link>
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
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => {
                  const Icon = getIconById(link.iconId);
                  return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center gap-2 text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                )})}
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
                  <HiX className="w-5 h-5 text-black" />
                </button>
              </div>

              <div className="px-6 py-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full rounded-sm border border-black/15 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black hover:bg-black/5 transition-colors flex items-center justify-center gap-3"
                >
                  <FcGoogle className="h-5 w-5" aria-hidden="true" />
                  <span>Sign in with Google</span>
                </button>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMode('signin');
                      resetAuthUi();
                    }}
                    className={cn(
                      'flex-1 rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] transition-colors',
                      accountMode === 'signin'
                        ? 'border-black bg-black text-white'
                        : 'border-black/15 bg-white text-black hover:bg-black/5'
                    )}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMode('signup');
                      resetAuthUi();
                    }}
                    className={cn(
                      'flex-1 rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] transition-colors',
                      accountMode === 'signup'
                        ? 'border-black bg-black text-white'
                        : 'border-black/15 bg-white text-black hover:bg-black/5'
                    )}
                  >
                    Create account
                  </button>
                </div>

                <div className="mt-5 rounded-xl border border-black/10 bg-white p-4">
                  <div className="grid gap-3">
                    {accountMode === 'signup' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <label className="grid gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/70">
                            First name
                          </span>
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="ui-input h-11"
                            placeholder="First name"
                            autoComplete="given-name"
                          />
                        </label>
                        <label className="grid gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/70">
                            Last name
                          </span>
                          <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="ui-input h-11"
                            placeholder="Last name"
                            autoComplete="family-name"
                          />
                        </label>
                      </div>
                    ) : null}

                    <label className="grid gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/70">
                        Email
                      </span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="ui-input h-11"
                        placeholder="you@example.com"
                        inputMode="email"
                        autoComplete="email"
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/70">
                        Password
                      </span>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="ui-input h-11"
                        placeholder="Minimum 6 characters"
                        autoComplete={accountMode === 'signup' ? 'new-password' : 'current-password'}
                      />
                    </label>

                    {authStatus === 'error' ? (
                      <div className="text-[12px] text-red-600">{authError}</div>
                    ) : null}

                    <button
                      type="button"
                      disabled={!canSubmit || authStatus === 'loading'}
                      onClick={onSubmitEmailAuth}
                      className={cn(
                        'mt-2 h-12 w-full rounded-full px-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white shadow-sm transition-all',
                        'bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] hover:opacity-95',
                        (!canSubmit || authStatus === 'loading') && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {authStatus === 'loading'
                        ? 'Please wait…'
                        : accountMode === 'signup'
                          ? 'Create account'
                          : 'Sign in'}
                    </button>
                  </div>
                </div>

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
