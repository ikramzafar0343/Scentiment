import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { Marquee } from '@/components/ui/motion/Marquee';
import { Star } from 'lucide-react';

const BRANDS = ['VOGUE', 'ELLE', 'GQ', 'Forbes', 'Vanity Fair', "Harper's BAZAAR"];

const TESTIMONIALS = [
  {
    quote:
      'The scents are clean, premium, and the experience feels truly elevated. Setup was effortless and the packaging is beautiful.',
    name: 'Ayesha',
    meta: 'Verified customer'
  },
  {
    quote:
      'We use it in our studio space—guests constantly ask what the fragrance is. It’s become part of our brand experience.',
    name: 'Daniel',
    meta: 'Small business owner'
  },
  {
    quote:
      'Fast shipping, great support, and the fragrance lasts. Everything feels well-designed and premium.',
    name: 'Mina',
    meta: 'Verified customer'
  }
];

export function SocialProofSection() {
  return (
    <HomeSection
      id="social-proof"
      eyebrow="Social Proof"
      title="Trusted by customers who care about quality"
      description="Real feedback from people creating better spaces."
      className="bg-gray-50"
    >
      <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm backdrop-blur">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">As seen in</div>
          <div className="mt-4">
            <Marquee speed={40} className="select-none text-gray-400">
              {BRANDS.map((b, i) => (
                <span key={i} className="px-10 text-3xl font-semibold tracking-tight text-gray-300">
                  {b}
                </span>
              ))}
            </Marquee>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <FadeIn key={t.name} delay={0.05 * idx}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-1 text-[#d4af37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#d4af37]" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">“{t.quote}”</p>
                <div className="mt-6 text-sm font-semibold text-gray-900">{t.name}</div>
                <div className="mt-1 text-xs text-gray-500">{t.meta}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}

