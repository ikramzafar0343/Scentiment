import type { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe, type StripeElementsOptions } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = (import.meta.env as Record<string, string | undefined>)[
  'VITE_STRIPE_PUBLISHABLE_KEY'
];

let stripePromise: Promise<Stripe | null> | null = null;

export function isStripeConfigured() {
  return Boolean(STRIPE_PUBLISHABLE_KEY);
}

export function getStripe() {
  if (!stripePromise) {
    stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : Promise.resolve(null);
  }
  return stripePromise;
}

export interface StripeElementsWrapperProps {
  clientSecret: string;
  children: ReactNode;
  appearance?: StripeElementsOptions['appearance'];
  locale?: StripeElementsOptions['locale'];
}

export function StripeElementsWrapper({
  clientSecret,
  children,
  appearance,
  locale
}: StripeElementsWrapperProps) {
  if (!isStripeConfigured()) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/60 px-5 py-4">
        <div className="text-sm font-semibold text-red-700">Payment is not configured.</div>
        <div className="mt-1 text-sm text-red-700/90">Set `VITE_STRIPE_PUBLISHABLE_KEY` to enable card payments.</div>
      </div>
    );
  }

  const elementsOptions = {
    clientSecret,
    locale,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066cc',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      },
      ...appearance
    }
  } as StripeElementsOptions;

  return (
    <Elements stripe={getStripe()} options={elementsOptions}>
      {children}
    </Elements>
  );
}
