import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type IconWrapperProps = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'brand' | 'gold';
  className?: string;
};

export function IconWrapper({ children, size = 'md', tone = 'default', className }: IconWrapperProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-5 w-5',
        size === 'lg' && 'h-6 w-6',
        tone === 'default' && 'text-gray-900',
        tone === 'muted' && 'text-gray-500',
        tone === 'brand' && 'text-[color:var(--ds-primary)]',
        tone === 'gold' && 'text-[color:var(--ds-gold)]',
        className
      )}
    >
      {children}
    </span>
  );
}

