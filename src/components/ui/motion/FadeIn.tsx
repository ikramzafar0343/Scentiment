import { motion, useInView, UseInViewOptions, TargetAndTransition } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { MOTION_DURATION, MOTION_EASE_PREMIUM } from '@/lib/motion';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  fullWidth?: boolean;
  viewport?: UseInViewOptions;
  scale?: boolean;
}

export function FadeIn({ 
  children, 
  className = '', 
  delay = 0, 
  duration = MOTION_DURATION.slow,
  direction = 'up',
  fullWidth = false,
  viewport = { once: true, margin: "-10%" },
  scale = false
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  const getInitialState = (): TargetAndTransition => {
    const state: TargetAndTransition = { opacity: 0 };
    if (scale) state.scale = 0.95;
    
    switch (direction) {
      case 'up':
        state.y = 18;
        break;
      case 'down':
        state.y = -18;
        break;
      case 'left':
        state.x = 18;
        break;
      case 'right':
        state.x = -18;
        break;
    }
    return state;
  };

  const getTargetState = () => {
    return { opacity: 1, x: 0, y: 0, scale: 1 };
  };

  return (
    <div ref={ref} className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <motion.div
        initial={getInitialState()}
        animate={isInView ? getTargetState() : getInitialState()}
        transition={{ 
          duration: duration, 
          delay: delay, 
          ease: MOTION_EASE_PREMIUM
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
