import { useCallback } from 'react';
import { HiCheck, HiMinus, HiPlus, HiShieldCheck, HiTruck } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';

function VariantOption({
  value,
  selected,
  onSelect,
}: {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
        selected
          ? 'border-gray-900 bg-gray-900 text-white shadow-md'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm'
      )}
    >
      {value}
    </button>
  );
}

export function ProductPurchaseCard({
  price,
  originalPrice,
  hasDiscount,
  saveLabel,
  variants,
  selectedVariant,
  onSelectVariant,
  quantity,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddToCart,
  isAdded,
}: {
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
  saveLabel: string | null;
  variants?: string[];
  selectedVariant: string | null;
  onSelectVariant: (value: string) => void;
  quantity: number;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onAddToCart: () => void;
  isAdded: boolean;
}) {
  const handleDecrease = useCallback(() => onDecreaseQuantity(), [onDecreaseQuantity]);
  const handleIncrease = useCallback(() => onIncreaseQuantity(), [onIncreaseQuantity]);
  const handleAdd = useCallback(() => onAddToCart(), [onAddToCart]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
      <div className="mb-6 space-y-2 border-b border-gray-100 pb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold tracking-tight text-gray-900">{formatPrice(price)}</span>
          {hasDiscount ? (
            <span className="text-lg font-semibold text-gray-400 line-through">
              {formatPrice(originalPrice ?? price)}
            </span>
          ) : null}
          {saveLabel ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-red-600">
              {saveLabel.replace('€', '')}
            </span>
          ) : null}
        </div>
        <div className="text-xs font-medium text-gray-500">Taxes included • Free shipping on orders over €100</div>
      </div>

      {variants?.length ? (
        <div className="mb-6">
          <div className="mb-3 text-sm font-semibold text-gray-900">Select Option</div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <VariantOption
                key={v}
                value={v}
                selected={selectedVariant === v}
                onSelect={onSelectVariant}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-900">Quantity:</label>
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
            <button
              type="button"
              className="p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
            >
              <HiMinus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold text-gray-900">{quantity}</span>
            <button
              type="button"
              className="p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              <HiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          disabled={isAdded}
          className={cn(
            'h-14 w-full text-base font-semibold',
            isAdded ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : ''
          )}
        >
          {isAdded ? (
            <span className="inline-flex items-center gap-2">
              <HiCheck className="h-5 w-5" /> Added to Cart
            </span>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3">
          <HiTruck className="h-5 w-5 text-gray-900 shrink-0" />
          <div className="text-sm font-medium text-gray-700">Fast shipping</div>
        </div>
        <div className="flex items-center gap-3">
          <HiShieldCheck className="h-5 w-5 text-gray-900 shrink-0" />
          <div className="text-sm font-medium text-gray-700">Secure checkout</div>
        </div>
        <div className="flex items-center gap-3">
          <HiCheck className="h-5 w-5 text-gray-900 shrink-0" />
          <div className="text-sm font-medium text-gray-700">Premium quality</div>
        </div>
      </div>
    </div>
  );
}

