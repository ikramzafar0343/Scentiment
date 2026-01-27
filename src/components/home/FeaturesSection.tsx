import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Marquee } from '@/components/ui/motion/Marquee';
import { BadgeCheck, HeartHandshake, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';

const FEATURES = [
  { 
    title: 'Premium, curated catalog', 
    description: 'Hand-picked categories and edits that feel intentional and premium.', 
    Icon: Sparkles,
    gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
    iconBg: 'bg-[#d4af37]/10',
    iconColor: 'text-[#d4af37]',
    iconEmoji: '🏆'
  },
  { 
    title: 'Clean ingredients', 
    description: 'Formulated for a safer, better everyday experience.', 
    Icon: Leaf,
    gradient: 'from-emerald-200/30 via-green-100/30 to-emerald-50/40',
    iconBg: 'bg-emerald-200/20',
    iconColor: 'text-emerald-600',
    iconEmoji: '🌿'
  },
  { 
    title: 'Fast shipping', 
    description: 'Quick fulfillment with reliable tracking and careful packaging.', 
    Icon: Truck,
    gradient: 'from-red-200/30 via-rose-100/30 to-red-50/40',
    iconBg: 'bg-red-200/20',
    iconColor: 'text-red-600',
    iconEmoji: '🚚'
  },
  { 
    title: 'Trusted quality', 
    description: 'Products designed to perform consistently and look great in your space.', 
    Icon: BadgeCheck,
    gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
    iconBg: 'bg-[#0066cc]/10',
    iconColor: 'text-[#0066cc]',
    iconEmoji: '💯'
  },
  { 
    title: 'Secure checkout', 
    description: 'Confidence from browse to buy with clear policies and secure payments.', 
    Icon: ShieldCheck,
    gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
    iconBg: 'bg-purple-200/20',
    iconColor: 'text-purple-600',
    iconEmoji: '🔒'
  },
  { 
    title: 'Real support', 
    description: 'Responsive help that feels human, not ticket-driven.', 
    Icon: HeartHandshake,
    gradient: 'from-pink-200/30 via-pink-100/30 to-pink-50/40',
    iconBg: 'bg-pink-200/20',
    iconColor: 'text-pink-600',
    iconEmoji: '❤️'
  }
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
    description: 'Consistent performance • Reliable coverage',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Signature Scent Collections',
    description: 'Mix • Layer • Customize',
    image:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop'
  }
];

export function FeaturesSection() {
  return (
    <HomeSection
      id="features"
      eyebrow="Why Choose Us"
      title="What makes Scentiment different"
      description="Our commitment to quality, service, and your satisfaction"
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.slice(0, 4).map((f, idx) => (
          <FadeIn key={f.title} delay={0.04 * idx}>
            <div className={`
              group h-full rounded-xl border border-gray-200/50 p-6 text-left
              bg-gradient-to-br ${f.gradient}
              transition-all duration-300 
              hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
            `}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${f.iconBg} mb-4`}>
                <span className="text-2xl">{f.iconEmoji}</span>
              </div>
              <h4 className="text-base font-bold mb-2 text-gray-900">{f.title}</h4>
              <p className="text-sm leading-relaxed text-gray-700">{f.description}</p>
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
