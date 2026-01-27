import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Droplets, Package, Sparkles, Wand2 } from 'lucide-react';

const STEPS = [
  {
    title: 'Discover your style',
    description: 'Browse curated collections inspired by luxury hotels and designer fragrances. Find scents that match your space and mood.',
    Icon: Sparkles,
    gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
    iconBg: 'bg-[#d4af37]/10',
    iconColor: 'text-[#d4af37]'
  },
  {
    title: 'Select your products',
    description: 'Choose from premium diffusers, fragrance oils, room sprays, and candles. All crafted with clean ingredients for lasting performance.',
    Icon: Droplets,
    gradient: 'from-[#20b2aa]/20 via-[#d4f4f1]/30 to-[#e6f7f5]/40',
    iconBg: 'bg-[#20b2aa]/10',
    iconColor: 'text-[#20b2aa]'
  },
  {
    title: 'Set up in minutes',
    description: 'Follow our simple setup guide. Most diffusers are ready to use right out of the box with clear, step-by-step instructions.',
    Icon: Wand2,
    gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
    iconBg: 'bg-[#0066cc]/10',
    iconColor: 'text-[#0066cc]'
  },
  {
    title: 'Enjoy premium fragrance',
    description: 'Experience fast shipping, beautiful packaging, and ongoing support. Your space transforms into a luxury environment every day.',
    Icon: Package,
    gradient: 'from-rose-200/30 via-pink-100/30 to-rose-50/40',
    iconBg: 'bg-rose-200/20',
    iconColor: 'text-rose-600'
  }
];

export function HowItWorksSection() {
  return (
    <HomeSection
      id="how-it-works"
      eyebrow="How It Works"
      title="Your journey to premium home fragrance"
      description="A simple, guided experience that helps you discover and enjoy luxury scents in your space."
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, idx) => (
          <FadeIn key={step.title} delay={0.05 * idx}>
            <div className={`
              group h-full rounded-2xl border border-gray-200/50 p-6 shadow-sm 
              bg-gradient-to-br ${step.gradient}
              transition-all duration-300 
              hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
            `}>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step.iconBg}`}>
                  <step.Icon className={`h-6 w-6 ${step.iconColor}`} />
                </div>
                <div className="text-sm font-bold tracking-widest text-gray-400">0{idx + 1}</div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">{step.title}</div>
              <div className="text-sm leading-relaxed text-gray-700">{step.description}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

