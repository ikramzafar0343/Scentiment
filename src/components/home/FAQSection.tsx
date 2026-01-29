import { HomeSection } from '@/components/home/HomeSection';
import { cn } from '@/lib/utils';
import { useId, useState } from 'react';
import { useHomeConfig } from '@/hooks/useHomeConfig';

type ItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ question, answer, isOpen, onToggle }: ItemProps) {
  const panelId = useId();

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all duration-300',
      isOpen ? 'border-[color:var(--ds-primary)]' : 'border-black/10 hover:border-[color:var(--ds-primary)]'
    )}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors',
          'bg-white hover:bg-black/[0.03]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-primary)]/50 focus-visible:ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="text-base font-semibold text-gray-900">{question}</span>
        <span className={cn(
          'text-2xl text-[color:var(--ds-primary)] transition-transform duration-150',
          isOpen ? 'rotate-45' : 'rotate-0'
        )}>+</span>
      </button>
      <div 
        id={panelId} 
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="px-6 pb-6 text-sm leading-relaxed text-gray-600">{answer}</div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { faq } = useHomeConfig();

  return (
    <HomeSection
      id="faq"
      eyebrow={faq.section.eyebrow}
      title={faq.section.title}
      description={faq.section.description}
      className="bg-white"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {faq.items.map((item, idx) => (
          <FAQItem
            key={item.q}
            question={item.q}
            answer={item.a}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </HomeSection>
  );
}
