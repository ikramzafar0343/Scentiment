import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, CreditCard, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="relative container-custom py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-lg font-semibold tracking-tight text-gray-900">Scentiment</div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Premium fragrances and devices curated for modern spaces. Clean ingredients, fast shipping, and support that feels human.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Shop</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/shop" className="text-gray-700 hover:text-gray-900">All products</Link></li>
              <li><Link to="/diffusers" className="text-gray-700 hover:text-gray-900">Diffusers</Link></li>
              <li><Link to="/oils" className="text-gray-700 hover:text-gray-900">Diffuser oils</Link></li>
              <li><Link to="/candles" className="text-gray-700 hover:text-gray-900">Candles</Link></li>
              <li><Link to="/perfumes" className="text-gray-700 hover:text-gray-900">Perfumes</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Company</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/collection/voyage" className="text-gray-700 hover:text-gray-900">Scent Voyage</Link></li>
              <li><Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link></li>
              <li><a href="#faq" className="text-gray-700 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Stay in the loop</div>
            <p className="mt-4 text-sm text-gray-600">Get product updates and curated drops. No spam.</p>
            <form className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 rounded-sm border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Email"
              />
              <button className="h-11 rounded-sm bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-black">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-8 text-sm text-gray-600 md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} Scentiment. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-gray-400">
              <CreditCard className="h-5 w-5" />
              <CreditCard className="h-5 w-5" />
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest">USD</span>
          </div>
        </div>

        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -2 }}
          className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </div>
    </footer>
  );
}
