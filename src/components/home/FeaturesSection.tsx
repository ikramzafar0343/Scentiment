import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Marquee } from '@/components/ui/motion/Marquee';
import { BadgeCheck, HeartHandshake, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';

const FEATURES = [
  { title: 'Premium, curated catalog', description: 'Hand-picked categories and edits that feel intentional and premium.', Icon: Sparkles },
  { title: 'Clean ingredients', description: 'Formulated for a safer, better everyday experience.', Icon: Leaf },
  { title: 'Fast shipping', description: 'Quick fulfillment with reliable tracking and careful packaging.', Icon: Truck },
  { title: 'Trusted quality', description: 'Products designed to perform consistently and look great in your space.', Icon: BadgeCheck },
  { title: 'Secure checkout', description: 'Confidence from browse to buy with clear policies and secure payments.', Icon: ShieldCheck },
  { title: 'Real support', description: 'Responsive help that feels human, not ticket-driven.', Icon: HeartHandshake }
];

const BANNERS = [
  {
    title: 'Hotel Lobby Vibes',
    description: 'Oud • Amber • Leather',
    image:
      'https://images.unsplash.com/photo-1523293836415-0a93b5d0e4c5?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Fresh & Airy Rooms',
    description: 'White Tea • Citrus • Cedar',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Candlelit Evenings',
    description: 'Vanilla • Sandalwood • Smoke',
    image:
      'https://images.unsplash.com/photo-1604134967494-8b0b1f4f0b40?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Designer-Grade Diffusion',
    description: 'Clean throw • No guesswork',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Signature Scent Sets',
    description: 'Build • Layer • Repeat',
    image:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop'
  }
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

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white/80 py-4 shadow-sm">
        <Marquee direction="right" speed={42} className="px-4">
          {BANNERS.map((b) => (
            <div
              key={b.title}
              className="relative h-[150px] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-gray-100 sm:h-[170px] sm:w-[320px]"
            >
              <img
                src={b.image}
                alt={b.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-black/0" />
              <div className="relative flex h-full flex-col justify-end p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
                  Scentiment
                </div>
                <div className="mt-1 text-base font-semibold leading-tight text-white sm:text-[17px]">
                  {b.title}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-white/85">{b.description}</div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </HomeSection>
  );
}
