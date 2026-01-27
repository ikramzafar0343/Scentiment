import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLLECTIONS = [
  { title: 'Diffusers', to: '/shop', desc: 'From $40 to $475 • Coverage 46m² to 600m²', icon: '💨' },
  { title: 'Hotel Collection', to: '/shop', desc: 'Inspired by luxury hotels • Starting at $19', icon: '🏨' },
  { title: 'Designer Collection', to: '/shop', desc: 'Inspired by designer fragrances • Starting at $19', icon: '✨' }
];

export function CollectionsSliderSection() {
  return (
    <HomeSection
      id="collections"
      eyebrow="Collections"
      title="Shop by Collection"
      description="Discover curated fragrances for every space and mood"
      className="bg-white"
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((item, idx) => (
          <FadeIn key={item.title} delay={0.03 * idx}>
            <Link
              to={item.to}
              className={cn(
                'group relative block aspect-square overflow-hidden rounded-2xl transition-all duration-300',
                'bg-gradient-to-br from-[#e6f2ff] to-[#d4f4f1]',
                'hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] focus-visible:ring-offset-2'
              )}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                <span className="text-sm font-semibold text-[#0066cc] flex items-center gap-1">
                  Explore Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}

