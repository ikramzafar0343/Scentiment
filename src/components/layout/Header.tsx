import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiShoppingBag, HiMenu, HiX, HiUser } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from '@/components/ui/motion/Marquee';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { useHeaderConfig } from '@/hooks/useHeaderConfig';
import { getIconById } from '@/configs/icons/iconRegistry';
import { loginEmailPassword, signupEmailPassword } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/services/api/api.service';

const ACCENT_CLASS: Record<'gold' | 'accent' | 'primary', string> = {
  gold: '[color:var(--ds-gold)]',
  accent: '[color:var(--ds-accent)]',
  primary: '[color:var(--ds-primary)]',
};

export function Header() {
  const { navLinks, announcements, marqueeSpeed } = useHeaderConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<'signin' | 'signup'>('signin');
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [collections, setCollections] = useState<Array<{ id: string; handle: string; title: string }>>([]);
  const setAuthSession = useAuthStore((s) => s.setSession);
  const totalItems = useCartStore((state) => state.totalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch collections for category dropdown
  useEffect(() => {
    let cancelled = false;
    apiService
      .getCollections()
      .then((res) => {
        if (!cancelled) {
          setCollections(res.collections || []);
        }
      })
      .catch(() => {
        if (!cancelled) setCollections([]);
      });
    return () => {
      cancelled = true;
    };
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

      setAuthSession(session);

      setAuthStatus('success');
      setIsAccountOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Authentication failed';
      setAuthError(msg);
      setAuthStatus('error');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col">
      {/* Top Black Bar */}
      <div className="bg-white/80 backdrop-blur-md text-black py-2 relative z-[60] border-b border-gray-200/50">
        <div className="container-custom flex items-center gap-4">
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
          <Link to="/" className="shrink-0 mr-4">
            <span className="block text-3xl font-serif font-semibold tracking-tight text-black leading-none">
              AROMAZUR
            </span>
            <span className="block text-[11px] font-medium tracking-[0.28em] uppercase text-gray-500 mt-1">
              Les Parfums de la Côte d'Azur
            </span>
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
                const isShopLink = link.href === '/shop' || link.name.toLowerCase() === 'shop';
                const isHovered = hoveredNavItem === link.name;
                const showDropdown = isShopLink && isHovered && collections.length > 0;
                
                return (
                <div 
                  key={link.name} 
                  className="relative group shrink-0"
                  onMouseEnter={() => setHoveredNavItem(link.name)}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'relative flex items-center gap-1.5 text-sm font-bold uppercase whitespace-nowrap transition-all duration-200',
                      'text-black hover:text-gray-700',
                      isHovered && 'text-gray-700',
                      link.badges ? 'pt-8 pb-3' : 'py-4'
                    )}
                  >
                    <Icon className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isHovered && 'scale-110'
                    )} aria-hidden="true" />
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
                    <span className="relative">
                      {link.name}
                      {isHovered && (
                        <motion.span
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </span>
                    {link.badges && (
                      <span className="sr-only">{link.badges.map((b) => b.text).join(', ')}</span>
                    )}
                  </Link>
                  
                  {/* Categories Dropdown */}
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200/50 py-2 z-50"
                      onMouseEnter={() => setHoveredNavItem(link.name)}
                      onMouseLeave={() => setHoveredNavItem(null)}
                    >
                      <Link
                        to="/shop"
                        className="block px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
                        onClick={() => setHoveredNavItem(null)}
                      >
                        All Products
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      {collections.map((collection) => (
                        <Link
                          key={collection.id}
                          to={`/collections/${collection.handle}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                          onClick={() => setHoveredNavItem(null)}
                        >
                          {collection.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              )})}
              </nav>
            </div>
          </div>
        </div>
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
                <div className="flex items-center gap-3">
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
