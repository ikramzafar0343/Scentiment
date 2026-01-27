import { motion, useInView, UseInViewOptions, TargetAndTransition } from 'framer-motion';
import { useRef, ReactNode } from 'react';

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
  duration = 0.8,
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
      case 'up': state.y = 40; break;
      case 'down': state.y = -40; break;
      case 'left': state.x = 40; break;
      case 'right': state.x = -40; break;
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
          ease: [0.21, 0.47, 0.32, 0.98] // Customized easing for premium feel
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
