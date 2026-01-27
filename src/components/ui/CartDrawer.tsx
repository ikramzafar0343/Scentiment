import { useCartStore } from '@/store/useCartStore';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, items, removeItem, updateQuantity, toggleCart, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold uppercase tracking-widest">Your Cart</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Your cart is empty.</p>
                  <Button onClick={toggleCart} variant="outline">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm text-gray-900">{item.name}</h3>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-gray-200">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-medium w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-lg">{formatPrice(subtotal())}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4 text-center">Shipping and taxes calculated at checkout.</p>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
