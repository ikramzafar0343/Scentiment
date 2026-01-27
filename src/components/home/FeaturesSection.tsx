import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { BadgeCheck, HeartHandshake, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';

const FEATURES = [
  { title: 'Premium, curated catalog', description: 'Hand-picked categories and edits that feel intentional and premium.', Icon: Sparkles },
  { title: 'Clean ingredients', description: 'Formulated for a safer, better everyday experience.', Icon: Leaf },
  { title: 'Fast shipping', description: 'Quick fulfillment with reliable tracking and careful packaging.', Icon: Truck },
  { title: 'Trusted quality', description: 'Products designed to perform consistently and look great in your space.', Icon: BadgeCheck },
  { title: 'Secure checkout', description: 'Confidence from browse to buy with clear policies and secure payments.', Icon: ShieldCheck },
  { title: 'Real support', description: 'Responsive help that feels human, not ticket-driven.', Icon: HeartHandshake }
];

export function FeaturesSection() {
  return (
    <HomeSection
      id="features"
      eyebrow="Benefits"
      title="Everything you need to buy with confidence"
      description="Benefit-led design, premium products, and a smooth experience that converts."
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, idx) => (
          <FadeIn key={f.title} delay={0.04 * idx}>
            <div className="group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-900">
                  <f.Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold text-gray-900">{f.title}</div>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-gray-600">{f.description}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

