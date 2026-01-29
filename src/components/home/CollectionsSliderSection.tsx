import { HomeSection } from '@/components/home/HomeSection';
import { cn } from '@/lib/utils';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function CollectionsSliderSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const { collections, resolveIcon } = useHomeConfig();

  useEffect(() => {
    if (sliderRef.current) {
      const width = sliderRef.current.scrollWidth / 2;
      controls.start({
        x: [0, -width],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        },
      });
    }
  }, [controls]);

  return (
    <HomeSection
      id="collections"
      eyebrow={collections.section.eyebrow}
      title={collections.section.title}
      description={collections.section.description}
      className="bg-white"
    >
      <div 
        className="overflow-hidden relative"
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() => {
          if (sliderRef.current) {
            const width = sliderRef.current.scrollWidth / 2;
            controls.start({
              x: [0, -width],
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              },
            });
          }
        }}
      >
        <motion.div
          ref={sliderRef}
          className="flex gap-8"
          animate={controls}
        >
          {/* First set of cards */}
          {collections.items.map((item) => {
            const Icon = resolveIcon(item.iconId);
            return (
              <Link
                key={`first-${item.title}`}
                to={item.to}
                className={cn(
                  'group relative block w-[320px] aspect-square overflow-hidden rounded-2xl transition-all duration-300 shrink-0',
                  `bg-gradient-to-br ${item.gradient}`,
                  'border border-gray-200/50',
                  'hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-primary)]/50 focus-visible:ring-offset-2'
                )}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className={cn(
                    'mb-4 p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm',
                    'group-hover:scale-110 transition-transform duration-300'
                  )}>
                    <Icon className="w-12 h-12 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                  <span className="text-sm font-semibold text-[color:var(--ds-primary)] flex items-center gap-1 justify-center">
                    Explore Collection <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
          
          {/* Duplicate set for seamless loop */}
          {collections.items.map((item) => {
            const Icon = resolveIcon(item.iconId);
            return (
              <Link
                key={`second-${item.title}`}
                to={item.to}
                className={cn(
                  'group relative block w-[320px] aspect-square overflow-hidden rounded-2xl transition-all duration-300 shrink-0',
                  `bg-gradient-to-br ${item.gradient}`,
                  'border border-gray-200/50',
                  'hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-primary)]/50 focus-visible:ring-offset-2'
                )}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className={cn(
                    'mb-4 p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm',
                    'group-hover:scale-110 transition-transform duration-300'
                  )}>
                    <Icon className="w-12 h-12 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                  <span className="text-sm font-semibold text-[color:var(--ds-primary)] flex items-center gap-1 justify-center">
                    Explore Collection <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </HomeSection>
  );
}
