import { HomeSection } from '@/components/home/HomeSection';
import { cn } from '@/lib/utils';
import { useId, useState } from 'react';

const FAQS = [
  {
    q: 'How long do fragrance oils last?',
    a: 'A 50ml bottle typically lasts 2-3 months with normal use (4-6 hours per day). Our Mini Diffuser consumes approximately 1ml per hour at medium intensity. Coverage and longevity vary by product—check individual product pages for specific details.'
  },
  {
    q: 'Are your fragrance oils safe and clean?',
    a: 'Yes. All our products are formulated with clean ingredients and comply with IFRA (International Fragrance Association) safety standards. We use cruelty-free formulas that are safe for children and pets. Full ingredient lists are available on product pages.'
  },
  {
    q: 'How fast is shipping?',
    a: 'We ship most orders within 24 hours (business days). Delivery typically takes 2-4 days within the continental US. You will receive tracking information as soon as your order ships. Free shipping is available on orders over $100.'
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day satisfaction guarantee. If you are not completely happy with your purchase, contact our support team and we will process a return or exchange. Returns are free and simple—we will guide you through every step.'
  },
  {
    q: 'How do I choose the right scent for my space?',
    a: 'Browse our collections by mood or inspiration (Hotel Collection, Designer Collection). Each product page includes detailed scent notes and coverage information. For personalized recommendations, contact our support team—we are happy to help you find the perfect fragrance.'
  },
  {
    q: 'What does "inspired by" mean?',
    a: 'Our Designer Collection features original fragrance creations inspired by the signature scents of luxury brands. These are not duplicates but unique interpretations crafted by expert perfumers to capture the essence of beloved designer fragrances at accessible prices.'
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
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all duration-300',
      isOpen ? 'border-[#0066cc]' : 'border-[#e0e0e0] hover:border-[#0066cc]'
    )}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors',
          'bg-white hover:bg-[#f5f5f5]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="text-base font-semibold text-gray-900">{question}</span>
        <span className={cn(
          'text-2xl text-[#0066cc] transition-transform duration-150',
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

  return (
    <HomeSection
      id="faq"
      eyebrow="Frequently Asked Questions"
      title="Everything you need to know"
      description="Get answers to common questions about our products, shipping, returns, and more."
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

