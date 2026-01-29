// Payment method types and interfaces

export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unionpay' | 'unknown';

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: {
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
    name?: string;
  };
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface AttachPaymentMethodRequest {
  paymentMethodId: string;
  setAsDefault?: boolean;
}

export interface PaymentMethodFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard?: boolean;
  setAsDefault?: boolean;
}

export interface PaymentFormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  general?: string;
}
