import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { PageContainer } from '@/components/ui/layout/PageContainer';

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  children: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  children,
  headerClassName,
  contentClassName
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || description);
  const headerAlign = align === 'left' ? 'text-left' : 'text-center';
  const headerWidth = align === 'left' ? 'max-w-3xl' : 'mx-auto max-w-3xl';

  return (
    <section
      id={id}
      className={cn('py-16 sm:py-20', className)}
      aria-labelledby={id && title ? `${id}-title` : undefined}
    >
      <PageContainer>
        {hasHeader ? (
          <FadeIn>
            <div className={cn(headerWidth, headerAlign, headerClassName)}>
              {eyebrow ? <div className="ui-eyebrow mb-3">{eyebrow}</div> : null}
              {title ? (
                <h2 id={id && title ? `${id}-title` : undefined} className="ui-h2">
                  {title}
                </h2>
              ) : null}
              {description ? <p className="ui-lead mt-4">{description}</p> : null}
            </div>
          </FadeIn>
        ) : null}

        <div className={cn(hasHeader ? 'mt-10 sm:mt-12' : '', contentClassName)}>{children}</div>
      </PageContainer>
    </section>
  );
}

