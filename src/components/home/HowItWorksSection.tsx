import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Droplets, Package, Sparkles, Wand2 } from 'lucide-react';

const STEPS = [
  {
    title: 'Pick your vibe',
    description: 'Explore curated categories made for modern spaces and moods.',
    Icon: Sparkles
  },
  {
    title: 'Choose your scent',
    description: 'Select diffuser oils crafted for clean, long-lasting performance.',
    Icon: Droplets
  },
  {
    title: 'Set it up in minutes',
    description: 'Simple setup with guidance that makes it feel effortless.',
    Icon: Wand2
  },
  {
    title: 'Enjoy every day',
    description: 'Fast delivery, premium packaging, and support when you need it.',
    Icon: Package
  }
];

export function HowItWorksSection() {
  return (
    <HomeSection
      id="how-it-works"
      eyebrow="How It Works"
      title="From discovery to delight in 4 steps"
      description="A guided, premium experience designed to help you find the perfect fragrance—fast."
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, idx) => (
          <FadeIn key={step.title} delay={0.05 * idx}>
            <div className="group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-900">
                  <step.Icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold tracking-widest text-gray-400">0{idx + 1}</div>
              </div>
              <div className="mt-4 text-base font-semibold text-gray-900">{step.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

