import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import sampleImage from '@/assets/images/sample.png';

const COLLECTIONS = [
  { title: 'New Sale', to: '/sale', desc: 'Limited-time deals', image: sampleImage },
  { title: 'Diffusers', to: '/diffusers', desc: 'Premium devices', image: sampleImage },
  { title: 'Diffuser Oils', to: '/oils', desc: 'Clean, long-lasting', image: sampleImage },
  { title: 'Scent Voyage', to: '/collection/voyage', desc: 'Travel-inspired edits', image: sampleImage },
  { title: 'Room Sprays', to: '/sprays', desc: 'Instant refresh', image: sampleImage },
  { title: 'Candles', to: '/candles', desc: 'Warm ambience', image: sampleImage },
  { title: 'Perfumes', to: '/perfumes', desc: 'Signature scents', image: sampleImage }
];

export function CollectionsSliderSection() {
  return (
    <HomeSection
      id="collections"
      eyebrow="Browse"
      title="Shop by category"
      description="Explore best-selling categories designed to upgrade your space and your routine."
      className="bg-gray-50"
    >
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {COLLECTIONS.map((item, idx) => (
            <FadeIn key={item.title} delay={0.03 * idx}>
              <Link
                to={item.to}
                className={cn(
                  'group relative block h-[380px] w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition',
                  'hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2'
                )}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold text-white">{item.title}</div>
                      <div className="mt-1 text-sm text-white/80">{item.desc}</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-white/25">
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}

