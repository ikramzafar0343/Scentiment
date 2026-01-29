// Payment utility functions
import type { CardBrand } from './types';

/**
 * Masks a card number (e.g., **** **** **** 4242)
 */
export function maskCardNumber(last4: string): string {
  return `**** **** **** ${last4}`;
}

/**
 * Gets the card brand name
 */
export function getCardBrandName(brand: CardBrand): string {
  const names: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    diners: 'Diners Club',
    jcb: 'JCB',
    unionpay: 'UnionPay',
    unknown: 'Card',
  };
  return names[brand] || 'Card';
}

/**
 * Formats expiry date for display
 */
export function formatExpiryDisplay(month: number, year: number): string {
  return `${String(month).padStart(2, '0')}/${year}`;
}
