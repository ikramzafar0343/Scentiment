import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ className, label, error, id, ...props }: TextFieldProps) {
  const safeId = id ?? props.name ?? label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={safeId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input id={safeId} className={cn('ui-input', error ? 'border-red-500' : '')} {...props} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

