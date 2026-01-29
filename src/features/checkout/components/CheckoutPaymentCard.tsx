import { Button } from '@/components/ui/Button';
import { PaymentSection } from '@/components/payment/PaymentSection';
import { StripeElementsWrapper } from '@/components/payment/StripeElementsWrapper';

export function CheckoutPaymentCard({
  paymentError,
  isLoading,
  clientSecret,
  onRetry,
  onPaymentMethodSelected,
  onError,
}: {
  paymentError: string;
  isLoading: boolean;
  clientSecret: string | null;
  onRetry: () => void;
  onPaymentMethodSelected: (paymentMethodId: string) => void;
  onError: (message: string) => void;
}) {
  return (
    <section className="ui-card p-6">
      <div className="text-sm font-semibold tracking-wide text-gray-900 mb-5">Payment</div>

      {paymentError ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50/60 px-5 py-4">
          <div className="text-sm font-semibold text-red-700">{paymentError}</div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[color:var(--ds-primary)] border-r-transparent"></div>
          <p className="mt-3 text-sm text-gray-600">Initializing secure payment...</p>
        </div>
      ) : clientSecret ? (
        <StripeElementsWrapper clientSecret={clientSecret}>
          <PaymentSection
            clientSecret={clientSecret}
            onPaymentMethodSelected={onPaymentMethodSelected}
            onError={onError}
          />
        </StripeElementsWrapper>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">Unable to initialize payment. Please refresh the page.</p>
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </section>
  );
}
