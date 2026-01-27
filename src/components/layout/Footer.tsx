import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-bold tracking-widest uppercase mb-6">Scentiment</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Elevate your home with our luxury fragrances. 
              Designed to create the perfect atmosphere for every moment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/category/diffusers" className="text-gray-400 hover:text-white transition-colors">Diffusers</Link></li>
              <li><Link to="/category/oils" className="text-gray-400 hover:text-white transition-colors">Fragrance Oils</Link></li>
              <li><Link to="/category/candles" className="text-gray-400 hover:text-white transition-colors">Candles</Link></li>
              <li><Link to="/category/gifts" className="text-gray-400 hover:text-white transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Stay Connected</h4>
            <p className="text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button className="bg-white text-black font-medium px-4 py-3 uppercase tracking-wide hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Scentiment. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="uppercase text-xs tracking-wider">Currency: USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
