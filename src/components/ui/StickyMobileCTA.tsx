import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function StickyMobileCTA() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const show = latest > window.innerHeight; // Show after 1 screen height
    if (show !== isVisible) {
      setIsVisible(show);
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
        >
          <Link 
            to="/shop" 
            className="block w-full bg-black text-white text-center py-4 font-bold uppercase tracking-widest text-sm shadow-xl rounded-sm"
          >
            Shop Best Sellers
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
