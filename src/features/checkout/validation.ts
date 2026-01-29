import type { CheckoutErrors, CheckoutFieldName, CheckoutValues } from './types';

export const REQUIRED_CHECKOUT_FIELDS: CheckoutFieldName[] = [
  'email',
  'firstName',
  'lastName',
  'address1',
  'city',
  'postalCode',
  'country'
];

export const CHECKOUT_COUNTRIES = ['Austria', 'Germany', 'Netherlands', 'Belgium', 'France', 'Italy'] as const;

export function checkoutFieldId(name: CheckoutFieldName) {
  return `checkout-${name}`;
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  for (const f of REQUIRED_CHECKOUT_FIELDS) {
    if (!values[f].trim()) errors[f] = 'Required';
  }

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (values.postalCode.trim() && values.postalCode.trim().length < 3) {
    errors.postalCode = 'Enter a valid postal code';
  }

  return errors;
}

