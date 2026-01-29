// Payment form validation utilities

import type { PaymentMethodFormData, PaymentFormErrors } from './types';

/**
 * Validates a credit card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validates expiry date format (MM/YY or MM/YYYY)
 */
export function validateExpiryDate(expiryDate: string): { valid: boolean; month?: number; year?: number } {
  const cleaned = expiryDate.replace(/\s+/g, '');
  const match = cleaned.match(/^(\d{2})\/(\d{2,4})$/);
  
  if (!match) {
    return { valid: false };
  }

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  const fullYear = year < 100 ? 2000 + year : year;

  if (month < 1 || month > 12) {
    return { valid: false };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return { valid: false };
  }

  return { valid: true, month, year: fullYear };
}

/**
 * Validates CVV (3-4 digits)
 */
export function validateCVV(cvv: string): boolean {
  const cleaned = cvv.replace(/\s+/g, '');
  return /^\d{3,4}$/.test(cleaned);
}

/**
 * Validates cardholder name
 */
export function validateCardholderName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

/**
 * Formats card number with spaces (e.g., 4242 4242 4242 4242)
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s+/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : cleaned;
}

/**
 * Formats expiry date (MM/YY)
 */
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
}

/**
 * Validates entire payment form
 */
export function validatePaymentForm(data: PaymentMethodFormData): PaymentFormErrors {
  const errors: PaymentFormErrors = {};

  // Card number validation
  const cardNumber = data.cardNumber.replace(/\s+/g, '');
  if (!cardNumber) {
    errors.cardNumber = 'Card number is required';
  } else if (!validateCardNumber(cardNumber)) {
    errors.cardNumber = 'Invalid card number';
  }

  // Expiry date validation
  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    const expiryValidation = validateExpiryDate(data.expiryDate);
    if (!expiryValidation.valid) {
      errors.expiryDate = 'Invalid or expired date';
    }
  }

  // CVV validation
  if (!data.cvv) {
    errors.cvv = 'CVV is required';
  } else if (!validateCVV(data.cvv)) {
    errors.cvv = 'CVV must be 3-4 digits';
  }

  // Cardholder name validation
  if (!data.cardholderName) {
    errors.cardholderName = 'Cardholder name is required';
  } else if (!validateCardholderName(data.cardholderName)) {
    errors.cardholderName = 'Name must be 2-50 characters';
  }

  return errors;
}

/**
 * Checks if payment form is valid
 */
export function isPaymentFormValid(data: PaymentMethodFormData): boolean {
  const errors = validatePaymentForm(data);
  return Object.keys(errors).length === 0;
}
