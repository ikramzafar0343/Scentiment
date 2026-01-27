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
          'inline-flex items-center justify-center rounded-sm font-medium transition-[transform,box-shadow,background-color,color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest will-change-transform',
          {
            'bg-gray-900 text-white hover:bg-black hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]': variant === 'primary',
            'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.22)]': variant === 'secondary',
            'border border-gray-200 bg-white/60 backdrop-blur text-gray-900 hover:bg-white hover:-translate-y-0.5': variant === 'outline',
            'text-gray-900 hover:bg-gray-100': variant === 'ghost',
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
