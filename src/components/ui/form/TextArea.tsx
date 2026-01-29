import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextArea({ className, label, error, id, ...props }: TextAreaProps) {
  const safeId = id ?? props.name ?? label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={safeId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea id={safeId} className={cn('ui-input', 'min-h-[140px] resize-y', error ? 'border-red-500' : '')} {...props} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

