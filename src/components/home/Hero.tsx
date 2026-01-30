import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import sampleImage from '@/assets/images/sample.png';
import { Tilt } from '@/components/ui/motion/Tilt';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export function Hero() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const opacity = useTransform(scrollY, [0, 600], [1, 0.9]);
  const y = useTransform(scrollY, [0, 600], [0, 24]);

  const visualRef = useRef<HTMLDivElement | null>(null);
  const visualInView = useInView(visualRef, { margin: '-20%', once: false });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (reduceMotion || !visualInView) {
      el.pause()
      return
    }
    const p = el.play()
    if (p && typeof (p as Promise<void>).catch === 'function') {
      ;(p as Promise<void>).catch(() => {})
    }
  }, [reduceMotion, visualInView])

  const floating = useMemo(() => {
    if (reduceMotion) return undefined;
    return {
      animate: { y: [0, -14, 0] },
      transition: { duration: 8, ease: [0.42, 0, 0.58, 1] as const, repeat: Infinity }
    };
  }, [reduceMotion]);

  const { hero, resolveBannerImage } = useHomeConfig();
  const backgroundImage = resolveBannerImage(hero.backgroundImagePrompt);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const [backgroundVideoPlaying, setBackgroundVideoPlaying] = useState(false);

  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video || reduceMotion) return;
    
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Video autoplay failed, fallback to image
      });
    }
  }, [reduceMotion]);

  return (
    <section aria-labelledby="home-hero" className="relative overflow-hidden hero-gradient">
      <div className="absolute inset-0">
        {/* Background Video */}
        {!reduceMotion && (
          <video
            ref={backgroundVideoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            playsInline
            muted
            loop
            autoPlay
            preload="none"
            onPlaying={() => setBackgroundVideoPlaying(true)}
            onPause={() => setBackgroundVideoPlaying(false)}
            onError={() => setBackgroundVideoPlaying(false)}
          >
            <source src="https://cdn.coverr.co/videos/coverr-lighting-a-candle-6698/1080p.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Background Image Fallback */}
        <img
          src={backgroundImage}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover opacity-20',
            !reduceMotion && backgroundVideoPlaying ? 'hidden' : ''
          )}
          loading="eager"
          decoding="async"
        />
        
        <div className="absolute inset-0 hero-pattern" />
      </div>

      <div className="relative">
        <div className="container-custom grid min-h-[680px] grid-cols-1 items-center gap-10 py-16 md:grid-cols-12 md:py-20">
          <motion.div style={{ opacity, y }} className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 backdrop-blur-[10px] px-4 py-2 text-xs font-semibold tracking-widest text-white shadow-sm">
              <HiSparkles className="h-4 w-4 text-[#d4af37]" />
              <span className="uppercase">{hero.eyebrow}</span>
            </div>

            <h1 id="home-hero" className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              {hero.headline}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              {hero.subtext}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/shop"
                className={cn(
                  'group inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-white to-gray-50 px-7 text-sm font-semibold text-[#0066cc] shadow-sm transition-all duration-150',
                  'hover:from-gray-50 hover:to-gray-100 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'
                )}
              >
                {hero.primaryCta}
                <HiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  'inline-flex h-12 items-center justify-center rounded-md border-2 border-white bg-transparent px-7 text-sm font-semibold text-white transition-all duration-150',
                  'hover:bg-white hover:text-[color:var(--ds-primary)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'
                )}
              >
                {hero.secondaryCta}
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-[10px] px-6 py-6 text-center text-white shadow-sm">
                <div className="text-2.5rem font-bold leading-none mb-2">$19<sup className="text-xl"></sup></div>
                <div className="text-xs uppercase tracking-wider opacity-90">Fragrance Oils</div>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-[10px] px-6 py-6 text-center text-white shadow-sm">
                <div className="text-2.5rem font-bold leading-none mb-2">$40<sup className="text-xl"></sup></div>
                <div className="text-xs uppercase tracking-wider opacity-90">Mini Diffusers</div>
              </div>
            </div>
          </motion.div>

          <div className="relative md:col-span-5">
            <motion.div
              {...(floating ?? {})}
              className="relative mx-auto max-w-md"
              style={{ willChange: reduceMotion ? undefined : 'transform' }}
            >
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-white/80 to-white/20 blur-xl" />
              <Tilt className="relative">
                <div ref={visualRef} className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/60 shadow-lg backdrop-blur">
                  <div className="aspect-[4/5] w-full relative">
                    <video
                      ref={videoRef}
                      className={cn(
                        'absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500',
                        !reduceMotion && visualInView ? 'opacity-100' : 'opacity-0'
                      )}
                      playsInline
                      muted
                      loop
                      preload="none"
                      poster={sampleImage}
                    >
                      <source src="https://cdn.coverr.co/videos/coverr-lighting-a-candle-6698/1080p.mp4" type="video/mp4" />
                    </video>
                    <img
                      src={sampleImage}
                      alt="AROMAZUR premium home fragrance diffuser and oils"
                      className={cn(
                        'relative h-full w-full object-cover transition-opacity duration-500',
                        !reduceMotion && visualInView ? 'opacity-0' : 'opacity-100'
                      )}
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-200 bg-white/70 p-3 text-[11px] font-medium text-gray-700">
                    <div className="rounded-sm bg-gray-50 px-2 py-1 text-center">Diffusers</div>
                    <div className="rounded-sm bg-gray-50 px-2 py-1 text-center">Oils</div>
                    <div className="rounded-sm bg-gray-50 px-2 py-1 text-center">Perfumes</div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
