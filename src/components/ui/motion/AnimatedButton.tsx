import { motion, HTMLMotionProps } from 'framer-motion';
import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest overflow-hidden";
    
    const variants = {
      primary: "bg-black text-white hover:bg-gray-900 border border-transparent",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent",
      outline: "border border-gray-200 bg-transparent hover:border-black text-gray-900",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-8 text-xs",
      lg: "h-14 px-10 text-sm",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Hover Shine Effect for Primary Buttons */}
        {variant === 'primary' && (
          <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            transition={{ duration: 1, ease: "easeInOut" }}
            whileHover={{ x: "100%" }}
          />
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : children}
        </span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
