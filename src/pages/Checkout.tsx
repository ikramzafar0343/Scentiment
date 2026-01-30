import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';
import { useCartStore } from '@/store/useCartStore';
import { createOrderReference } from '@/lib/utils';
import { paymentApi } from '@/lib/payment/api';
import { CheckoutBreadcrumbs } from '@/features/checkout/components/CheckoutBreadcrumbs';
import { CheckoutIntro } from '@/features/checkout/components/CheckoutIntro';
import { CheckoutErrorSummary } from '@/features/checkout/components/CheckoutErrorSummary';
import { CheckoutContactSection } from '@/features/checkout/components/CheckoutContactSection';
import { CheckoutShippingSection } from '@/features/checkout/components/CheckoutShippingSection';
import { CheckoutPaymentCard } from '@/features/checkout/components/CheckoutPaymentCard';
import { CheckoutOrderSummary } from '@/features/checkout/components/CheckoutOrderSummary';
import { CheckoutMobileBar } from '@/features/checkout/components/CheckoutMobileBar';
import { useCheckoutForm } from '@/features/checkout/useCheckoutForm';
import { validateCheckout } from '@/features/checkout/validation';
import type { CheckoutFieldName } from '@/features/checkout/types';

export function Checkout() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const orderTotal = subtotal();

  const {
    values,
    touched,
    markTouched,
    errors,
    showErrors,
    submitAttempted,
    setSubmitAttempted,
    errorList,
    setFieldValue,
    focusField,
  } = useCheckoutForm({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'Austria',
  });

  const [paymentIntent, setPaymentIntent] = useState<{ id: string; clientSecret: string } | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoadingRef = useRef(false);

  const createPaymentIntent = useCallback(async () => {
    // Use ref to prevent concurrent calls
    if (isLoadingRef.current) return;
    if (items.length === 0 || orderTotal <= 0) return;

    isLoadingRef.current = true;
    setIsLoadingPaymentIntent(true);
    setPaymentError('');

    try {
      const response = await paymentApi.createPaymentIntent({
        amount: Math.round(orderTotal * 100),
        currency: 'eur',
        metadata: {
          itemCount: items.reduce((acc, i) => acc + i.quantity, 0).toString(),
        },
      });

      setPaymentIntent({
        id: response.paymentIntent.id,
        clientSecret: response.paymentIntent.clientSecret,
      });
    } catch {
      setPaymentError('Failed to initialize payment. Please try again.');
    } finally {
      isLoadingRef.current = false;
      setIsLoadingPaymentIntent(false);
    }
  }, [items, orderTotal]);

  useEffect(() => {
    // Only create payment intent when items or orderTotal changes, not when callback changes
    if (items.length > 0 && orderTotal > 0 && !paymentIntent && !isLoadingRef.current) {
      createPaymentIntent();
    }
  }, [items.length, orderTotal, paymentIntent, createPaymentIntent]);

  const handleSubmit = useCallback(async () => {
    setSubmitAttempted(true);

    const nextErrors = validateCheckout(values);
    const firstError = (Object.keys(nextErrors) as CheckoutFieldName[]).find((k) => nextErrors[k]);
    if (firstError) {
      focusField(firstError);
      return;
    }

    if (items.length === 0) return;

    if (!selectedPaymentMethodId) {
      setPaymentError('Please select a payment method');
      return;
    }

    if (!paymentIntent) {
      setPaymentError('Payment system not ready. Please wait...');
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      const response = await paymentApi.confirmPaymentIntent(paymentIntent.id, selectedPaymentMethodId);
      if (!response.success) throw new Error('Payment confirmation failed');

      const reference = createOrderReference();
      const payload = {
        reference,
        email: values.email.trim(),
        total: orderTotal,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
        orderId: response.orderId,
      };

      clearCart();
      navigate('/checkout/success', { state: payload });
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  }, [clearCart, focusField, items, navigate, orderTotal, paymentIntent, selectedPaymentMethodId, setSubmitAttempted, values]);

  const handlePaymentMethodSelected = useCallback((paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setPaymentError('');
  }, []);

  const handleBlur = useCallback((name: CheckoutFieldName) => markTouched(name), [markTouched]);
  const handleValueChange = useCallback(
    (name: CheckoutFieldName, value: string) => setFieldValue(name, value),
    [setFieldValue]
  );

  const handleRemoveItem = useCallback((id: string) => removeItem(id), [removeItem]);
  const handleIncreaseQuantity = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      updateQuantity(id, item.quantity + 1);
    },
    [items, updateQuantity]
  );

  const handleDecreaseQuantity = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      updateQuantity(id, Math.max(1, item.quantity - 1));
    },
    [items, updateQuantity]
  );

  return (
    <div className="page-surface">
      <Seo title="Checkout — AROMAZUR" description="Complete your purchase securely." canonicalPath="/checkout" />

      <CheckoutBreadcrumbs />

      <PageContainer className="py-10 lg:py-14">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-7">
            <CheckoutIntro />

            <CheckoutErrorSummary visible={submitAttempted} errors={errorList} onFocusField={focusField} />

            <div className="space-y-5 pb-28 lg:pb-0">
              <CheckoutContactSection
                values={values}
                errors={errors}
                showErrors={showErrors}
                touched={touched}
                onValueChange={handleValueChange}
                onBlur={handleBlur}
              />

              <CheckoutShippingSection
                values={values}
                errors={errors}
                showErrors={showErrors}
                touched={touched}
                onValueChange={handleValueChange}
                onBlur={handleBlur}
              />

              <CheckoutPaymentCard
                paymentError={paymentError}
                isLoading={isLoadingPaymentIntent}
                clientSecret={paymentIntent?.clientSecret ?? null}
                onRetry={createPaymentIntent}
                onPaymentMethodSelected={handlePaymentMethodSelected}
                onError={setPaymentError}
              />
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-4">
              <CheckoutOrderSummary
                items={items}
                orderTotal={orderTotal}
                onRemoveItem={handleRemoveItem}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isDisabled={items.length === 0 || !selectedPaymentMethodId || isLoadingPaymentIntent}
                showPaymentHint={!selectedPaymentMethodId && items.length > 0}
              />
            </div>
          </aside>
        </div>
      </PageContainer>

      <CheckoutMobileBar total={orderTotal} isSubmitting={isSubmitting} disabled={items.length === 0} onSubmit={handleSubmit} />
    </div>
  );
}
