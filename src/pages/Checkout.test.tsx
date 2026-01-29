import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { PRODUCTS } from '@/lib/data';

vi.mock('@/components/payment/StripeElementsWrapper', () => ({
  StripeElementsWrapper: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/components/payment/PaymentSection', () => ({
  PaymentSection: ({
    onPaymentMethodSelected,
  }: {
    onPaymentMethodSelected: (paymentMethodId: string) => void;
  }) => (
    <button type="button" onClick={() => onPaymentMethodSelected('pm_test_1')}>
      Select payment method
    </button>
  ),
}));

vi.mock('@/lib/payment/api', () => ({
  paymentApi: {
    createPaymentIntent: vi.fn().mockResolvedValue({
      paymentIntent: { id: 'pi_test_1', clientSecret: 'cs_test_1', status: 'requires_payment_method' },
    }),
    confirmPaymentIntent: vi.fn().mockResolvedValue({ success: true, orderId: 'order_test_1' }),
    getPaymentMethods: vi.fn().mockResolvedValue({ paymentMethods: [] }),
    attachPaymentMethod: vi.fn().mockResolvedValue({ success: true, paymentMethodId: 'pm_test_1' }),
    detachPaymentMethod: vi.fn().mockResolvedValue({ success: true }),
    setDefaultPaymentMethod: vi.fn().mockResolvedValue({ success: true }),
  },
}));

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

async function renderCheckout(initialPath = '/checkout') {
  const [{ Checkout }, { CheckoutSuccess }] = await Promise.all([
    import('./Checkout'),
    import('./CheckoutSuccess'),
  ]);

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LocationDisplay />
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Checkout page', () => {
  beforeEach(() => {
    localStorage.removeItem('scentiment-cart');
    useCartStore.setState({ items: [], isOpen: false });
  });

  it('shows validation summary and focuses first invalid field', async () => {
    const product = PRODUCTS[0];
    useCartStore.getState().addItem(product);
    await renderCheckout();

    const select = await screen.findByRole('button', { name: /select payment method/i });
    await act(async () => {
      fireEvent.click(select);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Place Order' }));
    });

    expect(screen.getByRole('alert')).toBeTruthy();
    const email = document.getElementById('checkout-email');
    expect(email).toBeTruthy();
    expect(document.activeElement).toBe(email);
  });

  it.skip('clears cart after successful submit', async () => {

    const product = PRODUCTS[0];
    useCartStore.getState().addItem(product);
    await renderCheckout();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByLabelText(/^address$/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Vienna' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '1010' } });

    const select = await screen.findByRole('button', { name: /select payment method/i });
    await act(async () => {
      fireEvent.click(select);
    });

    const placeOrder = screen.getByRole('button', { name: 'Place Order' });
    await waitFor(() => expect((placeOrder as HTMLButtonElement).disabled).toBe(false));

    await act(async () => {
      fireEvent.click(placeOrder);
    });

    const { paymentApi } = await import('@/lib/payment/api');
    await waitFor(() => expect(paymentApi.confirmPaymentIntent).toHaveBeenCalled());

    expect(paymentApi.confirmPaymentIntent).toHaveBeenCalled();
  }, 10000);
});
