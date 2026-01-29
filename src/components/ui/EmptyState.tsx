import { ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-20 bg-gray-50 rounded-lg', className)}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
      <p className="text-gray-500 mb-6 font-light text-lg">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="uppercase tracking-widest text-xs">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
