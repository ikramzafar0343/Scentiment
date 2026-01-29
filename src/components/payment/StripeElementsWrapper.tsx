// Stripe Elements wrapper component
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/payment/stripe';
import type { StripeElementsOptionsClientSecret } from '@stripe/stripe-js';

interface StripeElementsWrapperProps {
  clientSecret: string;
  children: React.ReactNode;
  options?: Partial<StripeElementsOptionsClientSecret>;
}

export function StripeElementsWrapper({
  clientSecret,
  children,
  options,
}: StripeElementsWrapperProps) {
  const stripePromise = getStripe();

  if (!stripePromise) {
    return (
      <div className="text-red-600">
        Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY.
      </div>
    );
  }

  const elementsOptions: StripeElementsOptionsClientSecret = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066cc',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      ...options?.appearance,
    },
    ...options,
  } as StripeElementsOptionsClientSecret;

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      {children}
    </Elements>
  );
}
