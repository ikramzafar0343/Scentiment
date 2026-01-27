import { HomeSection } from '@/components/home/HomeSection';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

const FAQS = [
  {
    q: 'How long do the scents last?',
    a: 'Longevity depends on the product and space size. We prioritize consistent performance and provide guidance on choosing the right option for your room.'
  },
  {
    q: 'Are your oils safe and clean?',
    a: 'We focus on clean formulations and clear labeling. If you have sensitivities, reach out and we’ll help you choose the best fit.'
  },
  {
    q: 'How fast is shipping?',
    a: 'Most orders arrive in 2–4 days depending on your location. You’ll receive tracking as soon as your order ships.'
  },
  {
    q: 'Can I return an item?',
    a: 'We aim for a smooth and fair return experience. Contact support and we’ll guide you through the options for your order.'
  },
  {
    q: 'What if I need help choosing a scent?',
    a: 'Use the categories as a guide, then check the product details. If you want a recommendation, message support and we’ll suggest a few options.'
  }
];

type ItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ question, answer, isOpen, onToggle }: ItemProps) {
  const panelId = useId();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-6 py-5 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="text-sm font-semibold text-gray-900 sm:text-base">{question}</span>
        <ChevronDown className={cn('h-5 w-5 text-gray-500 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
      </button>
      <div id={panelId} className={cn('px-6 pb-5', isOpen ? 'block' : 'hidden')}>
        <div className="text-sm leading-relaxed text-gray-600">{answer}</div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <HomeSection
      id="faq"
      eyebrow="FAQ"
      title="Answers to common questions"
      description="Everything you need to feel confident before you buy."
      className="bg-white"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map((item, idx) => (
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

