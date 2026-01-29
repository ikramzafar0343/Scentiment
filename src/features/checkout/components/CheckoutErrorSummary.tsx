import { useCallback } from 'react';
import type { CheckoutErrorItem, CheckoutFieldName } from '../types';

function ErrorRow({
  item,
  onFocus,
}: {
  item: CheckoutErrorItem;
  onFocus: (field: CheckoutFieldName) => void;
}) {
  const handleClick = useCallback(() => onFocus(item.field), [item.field, onFocus]);
  return (
    <li>
      <button
        type="button"
        className="ui-focus-ring rounded-md text-left underline underline-offset-4 hover:no-underline"
        onClick={handleClick}
      >
        {item.message}
      </button>
    </li>
  );
}

export function CheckoutErrorSummary({
  visible,
  errors,
  onFocusField,
}: {
  visible: boolean;
  errors: CheckoutErrorItem[];
  onFocusField: (field: CheckoutFieldName) => void;
}) {
  if (!visible || errors.length === 0) return null;

  return (
    <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50/60 px-5 py-4">
      <div className="text-sm font-semibold text-red-700">Please fix the highlighted fields</div>
      <ul className="mt-3 space-y-1.5 text-sm text-red-700">
        {errors.map((e) => (
          <ErrorRow key={e.field} item={e} onFocus={onFocusField} />
        ))}
      </ul>
    </div>
  );
}

