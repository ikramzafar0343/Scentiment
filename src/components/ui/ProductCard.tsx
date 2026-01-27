import { motion } from 'framer-motion';
import { useCartStore, Product } from '@/store/useCartStore';
import { Button } from './Button';
import { formatPrice } from '@/lib/utils';
import { Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product & { 
    rating?: number; 
    reviews?: number;
    originalPrice?: number;
    badge?: string;
    saveAmount?: number | null;
    variants?: string[];
    customButtonText?: string;
    description?: string;
  };
}

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900 mt-1">
      <div className="bg-gray-100 px-1 py-0.5 rounded min-w-[18px] text-center">{String(timeLeft.h).padStart(2, '0')}</div>
      <span>:</span>
      <div className="bg-gray-100 px-1 py-0.5 rounded min-w-[18px] text-center">{String(timeLeft.m).padStart(2, '0')}</div>
      <span>:</span>
      <div className="bg-gray-100 px-1 py-0.5 rounded min-w-[18px] text-center">{String(timeLeft.s).padStart(2, '0')}</div>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const handleAddToCart = () => {
    addItem(product);
    toggleCart();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col h-full"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative mb-4 rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-0 left-0 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${product.badge.includes('OFF') ? 'bg-black' : 'bg-red-600'}`}>
            {product.badge}
          </div>
        )}

        {/* Heart Icon */}
        <button className="absolute top-2 right-2 p-2 text-gray-900 hover:text-gray-600 transition-colors">
          <Heart className="w-5 h-5" />
        </button>

        {/* Hover Overlay with Options */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col">
          {product.variants && product.variants.length > 0 ? (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {product.variants.map((variant) => (
                  <button 
                    key={variant}
                    className="text-xs border border-gray-200 py-1.5 px-1 rounded hover:border-black transition-colors text-center truncate"
                  >
                    {variant}
                  </button>
                ))}
              </div>
              <button className="w-full text-xs underline font-bold uppercase tracking-wider text-center hover:text-gray-600">
                {product.customButtonText || 'Customize your Discovery Kit'}
              </button>
            </div>
          ) : (
            <div className="p-4">
              <Button onClick={handleAddToCart} className="w-full bg-black text-white hover:bg-gray-800 uppercase text-xs tracking-widest">
                {product.customButtonText || 'Add to Cart'}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-gray-900 leading-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[11px] text-gray-500 italic">{product.description}</p>
        )}
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex text-black">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < (product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price Section */}
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)} EUR</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through decoration-gray-400">{formatPrice(product.originalPrice)} EUR</span>
            )}
            {product.saveAmount && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">
                Save {formatPrice(product.saveAmount).replace('$', '€')}
              </span>
            )}
          </div>

          {/* Flash Sale Timer */}
          {product.flashSale && (
            <div className="mt-2">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                WITH CODE: {product.flashSale.code}
              </p>
              <CountdownTimer endTime={product.flashSale.endTime} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
