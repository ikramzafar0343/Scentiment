import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function Card({ children, className, interactive }: CardProps) {
  return <div className={cn('ui-card', interactive && 'ui-card-hover', className)}>{children}</div>;
}

