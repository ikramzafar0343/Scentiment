import { TextField } from '@/components/ui/form/TextField';
import { cn } from '@/lib/utils';
import type { CheckoutErrors, CheckoutFieldName, CheckoutValues } from '../types';
import { CHECKOUT_COUNTRIES, checkoutFieldId } from '../validation';

export function CheckoutShippingSection({
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
      <div className="text-sm font-semibold tracking-wide text-gray-900">Shipping address</div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id={checkoutFieldId('firstName')}
          name="firstName"
          autoComplete="given-name"
          label="First name"
          value={values.firstName}
          onChange={(e) => onValueChange('firstName', e.target.value)}
          onBlur={() => onBlur('firstName')}
          error={showErrors || touched.firstName ? errors.firstName : undefined}
        />
        <TextField
          id={checkoutFieldId('lastName')}
          name="lastName"
          autoComplete="family-name"
          label="Last name"
          value={values.lastName}
          onChange={(e) => onValueChange('lastName', e.target.value)}
          onBlur={() => onBlur('lastName')}
          error={showErrors || touched.lastName ? errors.lastName : undefined}
        />
        <div className="sm:col-span-2">
          <TextField
            id={checkoutFieldId('address1')}
            name="address1"
            autoComplete="address-line1"
            label="Address"
            value={values.address1}
            onChange={(e) => onValueChange('address1', e.target.value)}
            onBlur={() => onBlur('address1')}
            error={showErrors || touched.address1 ? errors.address1 : undefined}
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            id={checkoutFieldId('address2')}
            name="address2"
            autoComplete="address-line2"
            label="Apartment, suite, etc. (optional)"
            value={values.address2}
            onChange={(e) => onValueChange('address2', e.target.value)}
            onBlur={() => onBlur('address2')}
          />
        </div>
        <TextField
          id={checkoutFieldId('city')}
          name="city"
          autoComplete="address-level2"
          label="City"
          value={values.city}
          onChange={(e) => onValueChange('city', e.target.value)}
          onBlur={() => onBlur('city')}
          error={showErrors || touched.city ? errors.city : undefined}
        />
        <TextField
          id={checkoutFieldId('postalCode')}
          name="postalCode"
          autoComplete="postal-code"
          label="Postal code"
          value={values.postalCode}
          onChange={(e) => onValueChange('postalCode', e.target.value)}
          onBlur={() => onBlur('postalCode')}
          error={showErrors || touched.postalCode ? errors.postalCode : undefined}
        />
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor={checkoutFieldId('country')} className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id={checkoutFieldId('country')}
            name="country"
            className={cn('ui-input', (showErrors || touched.country) && errors.country ? 'border-red-500' : '')}
            value={values.country}
            onChange={(e) => onValueChange('country', e.target.value)}
            onBlur={() => onBlur('country')}
          >
            {CHECKOUT_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {(showErrors || touched.country) && errors.country ? (
            <p className="text-xs text-red-600">{errors.country}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

