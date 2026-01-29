import { TextField } from '@/components/ui/form/TextField';
import type { CheckoutErrors, CheckoutFieldName, CheckoutValues } from '../types';
import { checkoutFieldId } from '../validation';

export function CheckoutContactSection({
  values,
  errors,
  showErrors,
  touched,
  onValueChange,
  onBlur,
}: {
  values: CheckoutValues;
  errors: CheckoutErrors;
  showErrors: boolean;
  touched: Partial<Record<CheckoutFieldName, boolean>>;
  onValueChange: (name: CheckoutFieldName, value: string) => void;
  onBlur: (name: CheckoutFieldName) => void;
}) {
  return (
    <section className="ui-card p-6">
      <div className="text-sm font-semibold tracking-wide text-gray-900">Contact</div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id={checkoutFieldId('email')}
          name="email"
          type="email"
          autoComplete="email"
          label="Email"
          value={values.email}
          onChange={(e) => onValueChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          error={showErrors || touched.email ? errors.email : undefined}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700" htmlFor="checkout-phone">
            Phone (optional)
          </label>
          <input
            id="checkout-phone"
            className="ui-input"
            type="tel"
            autoComplete="tel"
            placeholder="+43"
          />
        </div>
      </div>
    </section>
  );
}

