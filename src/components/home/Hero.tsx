import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import sampleImage from '@/assets/images/sample.png';
import { Tilt } from '@/components/ui/motion/Tilt';

const HERO_COPY = {
  eyebrow: 'Scentiment',
  headline: 'Premium home fragrance, made effortless.',
  subtext:
    'Discover curated diffuser oils and devices designed for modern spaces. Shop confidently with clean ingredients, fast shipping, and support that feels human.',
  primaryCta: 'Browse Collection',
  secondaryCta: 'Learn how it works'
};

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

  return (
    <section aria-labelledby="home-hero" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d4af37]/20 via-rose-200/30 to-sky-200/30 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50" />
      </div>

      <div className="relative">
        <div className="container-custom grid min-h-[680px] grid-cols-1 items-center gap-10 py-16 md:grid-cols-12 md:py-20">
          <motion.div style={{ opacity, y }} className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#d4af37]" />
              <span className="uppercase">{HERO_COPY.eyebrow}</span>
            </div>

            <h1 id="home-hero" className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              {HERO_COPY.headline}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {HERO_COPY.subtext}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/shop"
                className={cn(
                  'group inline-flex h-12 items-center justify-center rounded-sm bg-gray-900 px-6 text-sm font-semibold text-white shadow-sm transition',
                  'hover:bg-black hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2'
                )}
              >
                {HERO_COPY.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  'inline-flex h-12 items-center justify-center rounded-sm border border-gray-200 bg-white/70 px-6 text-sm font-semibold text-gray-900 backdrop-blur transition',
                  'hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2'
                )}
              >
                {HERO_COPY.secondaryCta}
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-3">
              <div className="rounded-sm border border-gray-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">Free shipping over $100</div>
              <div className="rounded-sm border border-gray-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">Clean & safe ingredients</div>
              <div className="rounded-sm border border-gray-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">5-star support</div>
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
                      alt="Premium fragrance"
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
