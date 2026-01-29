// Card form component with real-time validation
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCreditCard, HiLockClosed, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import type { PaymentMethodFormData, PaymentFormErrors } from '@/lib/payment/types';
import {
  formatCardNumber,
  formatExpiryDate,
  validatePaymentForm,
  isPaymentFormValid,
} from '@/lib/payment/validation';

interface CardFormProps {
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<PaymentMethodFormData>;
  showSaveCard?: boolean;
}

export function CardForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  showSaveCard = true,
}: CardFormProps) {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    cardNumber: initialData?.cardNumber || '',
    expiryDate: initialData?.expiryDate || '',
    cvv: initialData?.cvv || '',
    cardholderName: initialData?.cardholderName || '',
    saveCard: initialData?.saveCard ?? false,
    setAsDefault: initialData?.setAsDefault ?? false,
  });

  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentMethodFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Real-time validation
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validatePaymentForm(formData);
      setErrors(validationErrors);
    }
  }, [formData, touched]);

  const handleFieldChange = (field: keyof PaymentMethodFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleFieldChange('cardNumber', formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    handleFieldChange('expiryDate', formatted);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    handleFieldChange('cvv', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      cardNumber: true,
      expiryDate: true,
      cvv: true,
      cardholderName: true,
    });

    const validationErrors = validatePaymentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error field
      if (validationErrors.cardNumber) cardNumberRef.current?.focus();
      else if (validationErrors.expiryDate) expiryRef.current?.focus();
      else if (validationErrors.cvv) cvvRef.current?.focus();
      else if (validationErrors.cardholderName) nameRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to process card' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = isPaymentFormValid(formData);
  const showErrors = Object.keys(touched).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {errors.general}
        </motion.div>
      )}

      {/* Card Number */}
      <div>
        <label htmlFor="card-number" className="block text-sm font-semibold text-gray-900 mb-2">
          Card Number
        </label>
        <div className="relative">
          <input
            ref={cardNumberRef}
            id="card-number"
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="4242 4242 4242 4242"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            onBlur={() => setTouched((prev) => ({ ...prev, cardNumber: true }))}
            className={cn(
              'ui-input w-full pl-10 pr-10',
              showErrors && errors.cardNumber ? 'border-red-500 focus:border-red-500' : ''
            )}
            autoComplete="cc-number"
          />
          <HiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <AnimatePresence>
            {formData.cardNumber && !errors.cardNumber && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <HiCheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
            {showErrors && errors.cardNumber && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <HiXCircle className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {showErrors && errors.cardNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry-date" className="block text-sm font-semibold text-gray-900 mb-2">
            Expiry Date
          </label>
          <input
            ref={expiryRef}
            id="expiry-date"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleExpiryChange}
            onBlur={() => setTouched((prev) => ({ ...prev, expiryDate: true }))}
            className={cn(
              'ui-input w-full',
              showErrors && errors.expiryDate ? 'border-red-500 focus:border-red-500' : ''
            )}
            autoComplete="cc-exp"
          />
          {showErrors && errors.expiryDate && (
            <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-semibold text-gray-900 mb-2">
            CVV
          </label>
          <div className="relative">
            <input
              ref={cvvRef}
              id="cvv"
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              value={formData.cvv}
              onChange={handleCVVChange}
              onBlur={() => setTouched((prev) => ({ ...prev, cvv: true }))}
              className={cn(
                'ui-input w-full pr-10',
                showErrors && errors.cvv ? 'border-red-500 focus:border-red-500' : ''
              )}
              autoComplete="cc-csc"
            />
            <HiLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {showErrors && errors.cvv && (
            <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholder-name" className="block text-sm font-semibold text-gray-900 mb-2">
          Cardholder Name
        </label>
        <input
          ref={nameRef}
          id="cardholder-name"
          type="text"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChange={(e) => handleFieldChange('cardholderName', e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, cardholderName: true }))}
          className={cn(
            'ui-input w-full',
            showErrors && errors.cardholderName ? 'border-red-500 focus:border-red-500' : ''
          )}
          autoComplete="cc-name"
        />
        {showErrors && errors.cardholderName && (
          <p className="mt-1 text-xs text-red-600">{errors.cardholderName}</p>
        )}
      </div>

      {/* Save Card Options */}
      {showSaveCard && (
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.saveCard}
              onChange={(e) => handleFieldChange('saveCard', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[color:var(--ds-primary)] focus:ring-[color:var(--ds-primary)]"
            />
            <span className="text-sm text-gray-700">Save card for future purchases</span>
          </label>
          {formData.saveCard && (
            <label className="flex items-center gap-2 cursor-pointer ml-6">
              <input
                type="checkbox"
                checked={formData.setAsDefault}
                onChange={(e) => handleFieldChange('setAsDefault', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[color:var(--ds-primary)] focus:ring-[color:var(--ds-primary)]"
              />
              <span className="text-sm text-gray-700">Set as default payment method</span>
            </label>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          className={cn(
            'flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all',
            isValid && !isSubmitting && !isLoading
              ? 'bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] hover:shadow-md'
              : 'bg-gray-300 cursor-not-allowed'
          )}
        >
          {isSubmitting || isLoading ? 'Processing...' : 'Add Card'}
        </button>
      </div>
    </form>
  );
}
