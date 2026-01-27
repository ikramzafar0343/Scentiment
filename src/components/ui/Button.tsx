import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest',
          {
            'bg-[#1a1a1a] text-white hover:bg-gray-800': variant === 'primary',
            'bg-[#f8f8f8] text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900': variant === 'outline',
            'hover:bg-gray-100 hover:text-gray-900': variant === 'ghost',
            'h-9 px-4 text-xs': size === 'sm',
            'h-11 px-8 text-sm': size === 'md',
            'h-14 px-10 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
