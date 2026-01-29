import type { ReactNode } from 'react';
import { Section } from '@/components/ui/layout/Section';

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
    <Section id={id} eyebrow={eyebrow} title={title} description={description} className={className}>
      {children}
    </Section>
  );
}
