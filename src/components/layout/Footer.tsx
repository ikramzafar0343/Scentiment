import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, CreditCard, ArrowUp, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-[#0b0b12] via-[#07070a] to-black">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_20%,rgba(212,175,55,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_80%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_70%,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative container-custom py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">Scentiment</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Premium fragrances and devices curated for modern spaces. Clean ingredients, fast shipping, and support that feels human.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Shop</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/shop" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">All products</Link></li>
              <li><Link to="/diffusers" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Diffusers</Link></li>
              <li><Link to="/oils" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Diffuser oils</Link></li>
              <li><Link to="/candles" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Candles</Link></li>
              <li><Link to="/perfumes" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Perfumes</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Company</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/collection/voyage" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Scent Voyage</Link></li>
              <li><Link to="/contact" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Contact</Link></li>
              <li><a href="#faq" className="text-white/75 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Stay in the loop</div>
            <p className="mt-4 text-sm text-white/75">Get product updates and curated drops. No spam.</p>
            <form className="mt-4 flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="h-11 rounded-sm border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/50"
                autoComplete="email"
                inputMode="email"
              />
              <button className="h-11 rounded-sm bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Subscribe
              </button>
              <p className="text-[11px] leading-relaxed text-white/55">
                By subscribing, you agree to receive emails from Scentiment.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/65 md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} Scentiment. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/35" aria-label="Support and payments">
              <ShieldCheck className="h-5 w-5" />
              <Truck className="h-5 w-5" />
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">USD</span>
          </div>
        </div>

        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -2 }}
          className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </div>
    </footer>
  );
}
