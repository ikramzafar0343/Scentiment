import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiCheck, HiMinus, HiPlus, HiShieldCheck, HiTruck } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/store/useCartStore';

type CartItem = Product & { quantity: number };

function SummaryItem({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}) {
  const handleRemove = useCallback(() => onRemove(item.id), [item.id, onRemove]);
  const handleIncrease = useCallback(() => onIncrease(item.id), [item.id, onIncrease]);
  const handleDecrease = useCallback(() => onDecrease(item.id), [item.id, onDecrease]);

  return (
    <div className="flex gap-4">
      <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
            <div className="text-xs text-gray-500 truncate">{item.category}</div>
          </div>
          <button
            type="button"
            className="ui-focus-ring rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-red-600"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-lg border border-black/10 bg-white">
            <button
              type="button"
              className="ui-focus-ring rounded-md p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
            >
              <HiMinus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
            <button
              type="button"
              className="ui-focus-ring rounded-md p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              <HiPlus className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutOrderSummary({
  items,
  orderTotal,
  onRemoveItem,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onSubmit,
  isSubmitting,
  isDisabled,
  showPaymentHint,
}: {
  items: CartItem[];
  orderTotal: number;
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  showPaymentHint: boolean;
}) {
  const handleSubmit = useCallback(() => onSubmit(), [onSubmit]);
  const handleRemove = useCallback((id: string) => onRemoveItem(id), [onRemoveItem]);
  const handleIncrease = useCallback((id: string) => onIncreaseQuantity(id), [onIncreaseQuantity]);
  const handleDecrease = useCallback((id: string) => onDecreaseQuantity(id), [onDecreaseQuantity]);

  return (
    <section className="ui-card p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold tracking-wide text-gray-900">Order summary</div>
        <Link
          to="/shop"
          className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-900 ui-focus-ring rounded-md px-1.5 py-1"
        >
          Edit
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-xl border border-black/10 bg-white/70 px-5 py-4 text-sm text-gray-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <SummaryItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ))}

          <div className="pt-4 border-t border-black/10 space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatPrice(orderTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">Calculated at next step</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Tax</span>
              <span className="font-semibold text-gray-900">Included</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-black/10">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(orderTotal)}</span>
            </div>
          </div>

          <Button
            className="mt-4 w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Processing Payment...' : 'Place Order'}
          </Button>

          {showPaymentHint ? (
            <p className="mt-2 text-xs text-center text-gray-500">Please select or add a payment method</p>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/70 px-4 py-3">
              <HiTruck className="h-4 w-4 text-gray-900" />
              <div className="text-xs font-semibold text-gray-700">Fast shipping</div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/70 px-4 py-3">
              <HiShieldCheck className="h-4 w-4 text-gray-900" />
              <div className="text-xs font-semibold text-gray-700">Secure checkout</div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/70 px-4 py-3">
              <HiCheck className="h-4 w-4 text-gray-900" />
              <div className="text-xs font-semibold text-gray-700">Premium quality</div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            By placing your order, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      )}
    </section>
  );
}

