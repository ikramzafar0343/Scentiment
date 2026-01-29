import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { HiSparkles } from 'react-icons/hi';
import { useReducedMotion } from 'framer-motion';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'hero';
  media?: {
    type: 'video' | 'image';
    src: string;
    poster?: string;
  };
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  variant = 'default',
  media,
  className
}: PageHeaderProps) {
  const reduceMotion = useReducedMotion();

  if (variant === 'hero') {
    return (
      <section className={cn('relative overflow-hidden hero-gradient', className)}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 hero-pattern" />
          {media?.type === 'image' ? (
            <img
              src={media.src}
              alt=""
              className={cn(
                'absolute inset-0 h-full w-full object-cover opacity-25 transition-opacity duration-1000',
                !reduceMotion && 'hero-media'
              )}
              loading="lazy"
              decoding="async"
            />
          ) : null}
          {media?.type === 'video' && !reduceMotion ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-25 transition-opacity duration-1000"
              playsInline
              muted
              loop
              autoPlay
              preload="none"
              poster={media.poster}
            >
              <source src={media.src} type="video/mp4" />
            </video>
          ) : null}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-b',
              media ? 'from-black/35 via-black/25 to-black/35' : 'from-black/18 via-black/10 to-black/18'
            )}
          />
        </div>

        <PageContainer className="relative py-16 sm:py-20">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              {eyebrow ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold tracking-widest text-white shadow-sm backdrop-blur-[10px]">
                  <HiSparkles className="h-4 w-4 text-[#d4af37]" />
                  <span className="uppercase">{eyebrow}</span>
                </div>
              ) : null}
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">{description}</p>
              ) : null}
              {actions ? (
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{actions}</div>
              ) : null}
            </div>
          </FadeIn>
        </PageContainer>
      </section>
    );
  }

  return (
    <div className={cn('page-hero-surface py-14 sm:py-16', className)}>
      <PageContainer>
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow ? <div className="ui-eyebrow mb-3">{eyebrow}</div> : null}
            <h1 className="ui-h1">{title}</h1>
            {description ? <p className="ui-lead mt-4">{description}</p> : null}
            {actions ? <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">{actions}</div> : null}
          </div>
        </FadeIn>
      </PageContainer>
    </div>
  );
}
