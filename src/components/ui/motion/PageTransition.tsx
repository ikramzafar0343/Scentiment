import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { MOTION_DURATION, MOTION_EASE_PREMIUM } from '@/lib/motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_PREMIUM }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
