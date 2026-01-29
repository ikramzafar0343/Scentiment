import { useCallback } from 'react';
import { HiCheck } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { cn, formatPrice } from '@/lib/utils';

export function ProductMobileBar({
  price,
  originalPrice,
  hasDiscount,
  isAdded,
  onAddToCart,
}: {
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
  isAdded: boolean;
  onAddToCart: () => void;
}) {
  const handleAdd = useCallback(() => onAddToCart(), [onAddToCart]);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg safe-area-inset-bottom">
      <PageContainer className="py-3 px-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold text-gray-900 truncate">{formatPrice(price)}</div>
            {hasDiscount ? (
              <div className="text-xs text-gray-400 line-through">{formatPrice(originalPrice ?? price)}</div>
            ) : null}
          </div>
          <Button
            onClick={handleAdd}
            disabled={isAdded}
            className={cn(
              'h-11 px-6 shrink-0',
              isAdded ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : ''
            )}
          >
            {isAdded ? (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <HiCheck className="h-4 w-4" /> Added
              </span>
            ) : (
              <span className="text-sm font-semibold">Add to Cart</span>
            )}
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}

