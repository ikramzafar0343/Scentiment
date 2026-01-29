// Payment section component for checkout
import { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiLockClosed, HiShieldCheck } from 'react-icons/hi';
import { PaymentMethodList } from './PaymentMethodList';
import { paymentApi } from '@/lib/payment/api';
import type { SavedPaymentMethod } from '@/lib/payment/types';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { cn } from '@/lib/utils';

interface PaymentSectionProps {
  clientSecret?: string;
  onPaymentMethodSelected: (paymentMethodId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentSection({
  clientSecret,
  onPaymentMethodSelected,
  onError,
}: PaymentSectionProps) {
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  const loadPaymentMethods = useCallback(async () => {
    try {
      setIsLoadingMethods(true);
      const response = await paymentApi.getPaymentMethods();
      // Type assertion to ensure proper typing
      setSavedMethods(response.paymentMethods as SavedPaymentMethod[]);
      
      // Auto-select default method
      const defaultMethod = response.paymentMethods.find((m) => m.isDefault);
      if (defaultMethod) {
        setSelectedMethodId(defaultMethod.id);
        onPaymentMethodSelected(defaultMethod.id);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      if (onError) {
        onError('Failed to load saved payment methods');
      }
    } finally {
      setIsLoadingMethods(false);
    }
  }, [onError, onPaymentMethodSelected]);

  useEffect(() => {
    void loadPaymentMethods();
  }, [loadPaymentMethods]);

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethodId(methodId);
    setShowAddCard(false);
    onPaymentMethodSelected(methodId);
  };

  const handleAddCard = async () => {
    if (!stripe || !elements) {
      throw new Error('Stripe not initialized');
    }

    setIsLoading(true);
    try {
      // Create payment method using Stripe Elements
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const cardholderNameInput = document.getElementById('cardholder-name') as HTMLInputElement;
      const cardholderName = cardholderNameInput?.value || '';
      const saveCardCheckbox = document.getElementById('save-card') as HTMLInputElement;
      const saveCard = saveCardCheckbox?.checked || false;

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Attach payment method to customer if saving
      if (saveCard) {
        await paymentApi.attachPaymentMethod(paymentMethod.id, false);
        await loadPaymentMethods(); // Refresh list
        setSelectedMethodId(paymentMethod.id);
        onPaymentMethodSelected(paymentMethod.id);
      } else {
        // Use for one-time payment
        onPaymentMethodSelected(paymentMethod.id);
      }

      setShowAddCard(false);
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to add card');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    try {
      await paymentApi.detachPaymentMethod(methodId);
      await loadPaymentMethods();
      
      // Clear selection if deleted method was selected
      if (selectedMethodId === methodId) {
        setSelectedMethodId(null);
        onPaymentMethodSelected('');
      }
    } catch {
      throw new Error('Failed to remove card');
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await paymentApi.setDefaultPaymentMethod(methodId);
      await loadPaymentMethods();
    } catch {
      throw new Error('Failed to set default card');
    }
  };

  return (
    <div className="space-y-6">
      {/* Saved Payment Methods */}
      {!isLoadingMethods && savedMethods.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Saved Payment Methods</h3>
            {!showAddCard && (
              <button
                type="button"
                onClick={() => setShowAddCard(true)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--ds-primary)] hover:underline"
              >
                <HiPlus className="h-4 w-4" />
                Add New Card
              </button>
            )}
          </div>
          <PaymentMethodList
            paymentMethods={savedMethods}
            selectedMethodId={selectedMethodId || undefined}
            onSelect={handleSelectMethod}
            onDelete={handleDeleteMethod}
            onSetDefault={handleSetDefault}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Add New Card Form */}
      <AnimatePresence>
        {(showAddCard || savedMethods.length === 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {savedMethods.length > 0 ? 'Add New Card' : 'Payment Information'}
                </h3>
                {savedMethods.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HiPlus className="h-5 w-5 rotate-45" />
                  </button>
                )}
              </div>

              {clientSecret && stripe ? (
                <div className="space-y-4">
                  {/* Stripe Card Element */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Card Details
                    </label>
                    <div className="rounded-lg border border-gray-300 p-3 bg-white">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#1a1a1a',
                              '::placeholder': {
                                color: '#9ca3af',
                              },
                            },
                            invalid: {
                              color: '#ef4444',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label htmlFor="cardholder-name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      id="cardholder-name"
                      type="text"
                      placeholder="John Doe"
                      className="ui-input w-full"
                      autoComplete="cc-name"
                    />
                  </div>

                  {/* Save Card Option */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="save-card"
                      className="w-4 h-4 rounded border-gray-300 text-[color:var(--ds-primary)]"
                    />
                    <label htmlFor="save-card" className="text-sm text-gray-700 cursor-pointer">
                      Save card for future purchases
                    </label>
                  </div>

                  {/* Add Card Button */}
                  <button
                    type="button"
                    onClick={handleAddCard}
                    disabled={isLoading || !stripe}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all',
                      isLoading || !stripe
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] hover:shadow-md'
                    )}
                  >
                    {isLoading ? 'Adding Card...' : 'Add Card'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HiLockClosed className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">Secure payment processing is being initialized...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <HiShieldCheck className="h-4 w-4 text-green-600" />
        <span>Your payment information is encrypted and secure</span>
      </div>
    </div>
  );
}
