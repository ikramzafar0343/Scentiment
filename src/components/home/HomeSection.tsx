import { FadeIn } from '@/components/ui/motion/FadeIn';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type HomeSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function HomeSection({ id, eyebrow, title, description, className, children }: HomeSectionProps) {
  return (
    <section id={id} className={cn('py-16 sm:py-20', className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="container-custom">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow ? (
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">{eyebrow}</div>
            ) : null}
            <h2 id={id ? `${id}-title` : undefined} className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>
            {description ? <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">{description}</p> : null}
          </div>
        </FadeIn>

        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
