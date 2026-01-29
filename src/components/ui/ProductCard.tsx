import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, Product } from '@/store/useCartStore';
import { Button } from './Button';
import { cn, formatPrice, slugify } from '@/lib/utils';
import { Star, Heart, Check, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BADGE_STYLES: Record<string, string> = {
  'SALE': 'bg-red-600',
  'NEW': 'bg-green-600',
  'BESTSELLER': 'bg-blue-600',
  'LIMITED': 'bg-purple-600',
};

function ProductBadge({ badge }: { badge: string }) {
  const badgeClass = badge.includes('OFF') 
    ? 'bg-black' 
    : BADGE_STYLES[badge] || 'bg-gray-600';
  
  return (
    <div className={cn(
      'absolute top-3 left-3 rounded-full text-white text-[10px] font-extrabold px-2.5 py-1 leading-none uppercase tracking-widest shadow-sm',
      badgeClass
    )}>
      {badge}
    </div>
  );
}

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
    flashSale?: {
        code: string;
        endTime: string;
    }
  };
}

interface ProductCardActionsProps {
  product: ProductCardProps['product'];
  productUrl: string;
  hasVariants: boolean;
  variants?: string[];
  isAdded: boolean;
  onAddToCart: () => void;
  onNavigate: (url: string, state?: any) => void;
}

function ProductCardActions({
  product,
  productUrl,
  hasVariants,
  variants,
  isAdded,
  onAddToCart,
  onNavigate,
}: ProductCardActionsProps) {
  if (hasVariants && variants) {
    return (
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-white/95 backdrop-blur-md border-t border-gray-100/50">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {variants.slice(0, 4).map((variant) => (
              <button
                key={variant}
                type="button"
                className="text-[10px] border border-gray-200 px-2 py-1 rounded-sm hover:border-black transition-colors bg-white text-gray-600 hover:text-black ui-focus-ring"
              >
                {variant}
              </button>
            ))}
            {variants.length > 4 && (
              <span className="text-[10px] px-1 py-1 text-gray-400">+{variants.length - 4}</span>
            )}
          </div>
          <Button
            onClick={() => onNavigate(productUrl, { state: { product } })}
            variant="outline"
            className="w-full text-xs uppercase tracking-widest h-9"
          >
            {product.customButtonText || 'View Options'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-white/95 backdrop-blur-md border-t border-gray-100/50">
      <Button
        onClick={onAddToCart}
        disabled={isAdded}
        variant="primary"
        className={cn(
          'w-full h-10 text-xs shadow-none',
          isAdded && 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-transparent'
        )}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-2 font-medium"
            >
              <Check className="w-4 h-4" /> Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> {product.customButtonText || 'Add to Cart'}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
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
    <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 mt-1">
       <span>ENDS IN:</span>
      <div className="bg-red-50 px-1 rounded min-w-[18px] text-center">{String(timeLeft.h).padStart(2, '0')}</div>
      <span>:</span>
      <div className="bg-red-50 px-1 rounded min-w-[18px] text-center">{String(timeLeft.m).padStart(2, '0')}</div>
      <span>:</span>
      <div className="bg-red-50 px-1 rounded min-w-[18px] text-center">{String(timeLeft.s).padStart(2, '0')}</div>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const productUrl = `/products/${slugify(product.name)}`;

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    toggleCart();
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('button,a,input,select,textarea')) return;
        navigate(productUrl, { state: { product } });
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        navigate(productUrl, { state: { product } });
      }}
      className="group relative flex flex-col h-full ui-card ui-card-hover overflow-hidden cursor-pointer ui-focus-ring"
      aria-label={`View ${product.name}`}
    >
      {/* Image Container */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={533}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
        />
        
        {/* Badge */}
        {product.badge && <ProductBadge badge={product.badge} />}

        {/* Quick Actions - Heart */}
        <button type="button" aria-label="Add to wishlist" className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-900 hover:text-red-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300 ui-focus-ring">
          <Heart className="w-4 h-4" />
        </button>

        {/* Bottom Action Area */}
        <ProductCardActions
          product={product}
          productUrl={productUrl}
          hasVariants={Boolean(product.variants && product.variants.length > 0)}
          variants={product.variants}
          isAdded={isAdded}
          onAddToCart={handleAddToCart}
          onNavigate={navigate}
        />
      </div>
      
      {/* Content */}
      <div className="pt-4 pb-2 px-1 flex-1 flex flex-col gap-1.5">
         <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-gray-900 leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.description && (
               <p className="text-[11px] text-gray-500 line-clamp-1">{product.description}</p>
            )}
         </div>

         {/* Price */}
         <div className="flex items-baseline gap-2 flex-wrap mt-1">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)} EUR</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through decoration-gray-400">{formatPrice(product.originalPrice)} EUR</span>
            )}
            {product.saveAmount && (
               <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">
                 Save {formatPrice(product.saveAmount).replace('$', '€')}
               </span>
            )}
         </div>

        {/* Rating & Timer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2">
            <div className="flex items-center gap-1">
                <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < (product.rating || 0) ? 'fill-current' : 'text-gray-200'}`} 
                    />
                    ))}
                </div>
                <span className="text-[10px] text-gray-400">({product.reviews})</span>
            </div>
            
             {product.flashSale && (
                <CountdownTimer endTime={product.flashSale.endTime} />
             )}
        </div>
      </div>
    </div>
  );
}
