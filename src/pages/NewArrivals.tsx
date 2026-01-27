import { useState } from 'react';
import { PRODUCTS } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import { Plus, Minus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const FAQS = [
  {
    question: "How long do the scents last?",
    answer: "Our fragrances are formulated to last up to 30 days with average use. The intensity can be adjusted on your diffuser device."
  },
  {
    question: "Are the fragrances pet safe?",
    answer: "Yes, all our fragrances are IFRA compliant and safe for pets and children when used as directed."
  },
  {
    question: "Can I return the product if I don't like the scent?",
    answer: "We offer a 30-day money-back guarantee on all our products. If you're not satisfied, simply return it for a full refund."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. Shipping times may vary based on location."
  }
];

export function NewArrivals() {
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const location = useLocation();
  const isSalePage = location.pathname.includes('sale') || location.pathname.includes('specials');
  const isDiffuserPage = location.pathname.includes('diffusers') || location.pathname.includes('scent-diffusers');
  const isOilsPage = location.pathname.includes('oils') || location.pathname.includes('fragrance-oils');
  const isRoomSpraysPage = location.pathname.includes('sprays') || location.pathname.includes('fragrance-room-sprays');
  const isCandlesPage = location.pathname.includes('candles');
  const isPerfumesPage = location.pathname.includes('perfumes') || location.pathname.includes('fragrances');

  let pageTitle = "New Arrivals";
  let subTitle = "Latest Drops";
  let pageDescription = "Discover the latest additions to our luxury fragrance collection. Crafted to transform your space.";

  if (isSalePage) {
    pageTitle = "Specials";
    subTitle = "Limited Time Offers";
    pageDescription = "Exclusive deals on our premium diffusers and fragrances. Limited time only.";
  } else if (isDiffuserPage) {
    pageTitle = "Scent Diffusers";
    subTitle = "Latest Drops";
    pageDescription = "Elevate your environment with our state-of-the-art cold-air diffusion technology. Safe, clean, and consistent scenting for any space.";
  } else if (isOilsPage) {
    pageTitle = "Fragrance Oils";
    subTitle = "Best Sellers";
    pageDescription = "100% Pure Fragrance Oils for Scent Diffusers. Safe for Pets & Kids.";
  } else if (isRoomSpraysPage) {
    pageTitle = "Room Sprays";
    subTitle = "Instant Freshness";
    pageDescription = "Transform your space instantly with our luxury room sprays. Inspired by world-class hotels and resorts.";
  } else if (isCandlesPage) {
    pageTitle = "Candles";
    subTitle = "Set The Mood";
    pageDescription = "Hand-poured luxury candles featuring our signature hotel-inspired scents. Long-lasting burn with premium soy wax.";
  } else if (isPerfumesPage) {
    pageTitle = "Perfumes & Cologne";
    subTitle = "Signature Scents";
    pageDescription = "Discover our collection of luxury perfumes and colognes. Inspired by iconic designer fragrances.";
  }

  const displayProducts = isDiffuserPage 
    ? PRODUCTS.filter(p => p.category === 'Diffusers')
    : isOilsPage
      ? PRODUCTS.filter(p => p.category === 'Fragrance Oils')
      : isRoomSpraysPage
        ? PRODUCTS.filter(p => p.category === 'Room Sprays')
        : isCandlesPage
          ? PRODUCTS.filter(p => p.category === 'Candles')
          : isPerfumesPage
            ? PRODUCTS.filter(p => p.category === 'Perfumes')
            : [...PRODUCTS, ...PRODUCTS];

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[#d4af37] font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">{subTitle}</span>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4">{pageTitle}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {pageDescription}
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Filter Toggle */}
        <button 
          className="lg:hidden flex items-center justify-between border-y border-gray-200 py-4 font-bold uppercase tracking-wide"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>Filters</span>
          <Filter className="w-4 h-4" />
        </button>

        {/* Filters Sidebar */}
        <aside className={`w-full lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
           <div className="sticky top-24 space-y-8 pr-4">
             {/* Categories */}
             <div className="border-b border-gray-100 pb-6">
               <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Category</h3>
               <ul className="space-y-3 text-sm text-gray-600">
                 <li className={`cursor-pointer transition-colors ${!isDiffuserPage && !isOilsPage && !isRoomSpraysPage ? 'font-medium text-black' : 'hover:text-black'}`}>All New Arrivals</li>
                 <li className={`cursor-pointer transition-colors ${isDiffuserPage ? 'font-medium text-black' : 'hover:text-black'}`}>Diffusers</li>
                 <li className={`cursor-pointer transition-colors ${isOilsPage ? 'font-medium text-black' : 'hover:text-black'}`}>Fragrance Oils</li>
                 <li className={`cursor-pointer transition-colors ${isRoomSpraysPage ? 'font-medium text-black' : 'hover:text-black'}`}>Room Sprays</li>
                 <li className={`cursor-pointer transition-colors ${isCandlesPage ? 'font-medium text-black' : 'hover:text-black'}`}>Candles</li>
                 <li className={`cursor-pointer transition-colors ${isPerfumesPage ? 'font-medium text-black' : 'hover:text-black'}`}>Perfumes</li>
                 <li className="hover:text-black cursor-pointer transition-colors">Gift Sets</li>
               </ul>
             </div>

             {/* Price Range */}
             <div className="border-b border-gray-100 pb-6">
               <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Price</h3>
               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                   <input type="checkbox" className="rounded border-gray-300" />
                   Under $50
                 </label>
                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                   <input type="checkbox" className="rounded border-gray-300" />
                   $50 - $100
                 </label>
                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                   <input type="checkbox" className="rounded border-gray-300" />
                   $100 - $200
                 </label>
                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                   <input type="checkbox" className="rounded border-gray-300" />
                   $200+
                 </label>
               </div>
             </div>

             {/* Scent Profile */}
             <div className="pb-6">
               <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Scent Family</h3>
               <ul className="space-y-3 text-sm text-gray-600">
                 <li className="hover:text-black cursor-pointer transition-colors">Woody & Earthy</li>
                 <li className="hover:text-black cursor-pointer transition-colors">Fresh & Clean</li>
                 <li className="hover:text-black cursor-pointer transition-colors">Floral</li>
                 <li className="hover:text-black cursor-pointer transition-colors">Citrus</li>
               </ul>
             </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <p>{displayProducts.length} Products</p>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select className="border-none bg-transparent font-medium text-black focus:ring-0 cursor-pointer outline-none">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-20">
            {displayProducts.map((product, i) => (
              <ProductCard key={`${product.id}-${i}`} product={product} />
            ))}
          </div>

          {/* FAQ Section */}
          <section className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <Minus className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
