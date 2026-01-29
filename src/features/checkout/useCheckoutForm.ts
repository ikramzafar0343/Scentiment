import { useMemo, useState } from 'react';
import type { CheckoutErrorItem, CheckoutErrors, CheckoutFieldName, CheckoutValues } from './types';
import { checkoutFieldId, validateCheckout } from './validation';

export function useCheckoutForm(initialValues: CheckoutValues) {
  const [values, setValues] = useState<CheckoutValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<CheckoutFieldName, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors: CheckoutErrors = useMemo(() => validateCheckout(values), [values]);
  const showErrors = submitAttempted;

  const errorList: CheckoutErrorItem[] = useMemo(() => {
    if (!showErrors) return [];
    return (Object.keys(errors) as CheckoutFieldName[])
      .filter((k) => errors[k])
      .map((k) => ({ field: k, message: errors[k] ?? 'Invalid' }));
  }, [errors, showErrors]);

  const setFieldValue = (name: CheckoutFieldName, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const markTouched = (name: CheckoutFieldName) => {
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const focusField = (name: CheckoutFieldName) => {
    const el = document.getElementById(checkoutFieldId(name));
    if (el instanceof HTMLElement) el.focus();
  };

  return {
    values,
    setValues,
    touched,
    markTouched,
    errors,
    showErrors,
    submitAttempted,
    setSubmitAttempted,
    errorList,
    setFieldValue,
    focusField,
    checkoutFieldId,
  };
}

