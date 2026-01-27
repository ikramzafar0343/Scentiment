import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({ 
  children, 
  direction = 'left', 
  speed = 30, 
  className = '',
  pauseOnHover = true
}: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden flex w-full", className, pauseOnHover && "group")}>
      <div
        style={{ 
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
        className={cn(
          "flex flex-shrink-0 gap-8 items-center min-w-full animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
        {children}
        {children}
        {children}
      </div>
      <div
        style={{ 
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
        className={cn(
          "flex flex-shrink-0 gap-8 items-center min-w-full animate-marquee ml-8",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden="true"
      >
        {children}
        {children}
        {children}
        {children}
      </div>
    </div>
  );
}
