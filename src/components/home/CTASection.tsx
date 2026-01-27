import { HomeSection } from '@/components/home/HomeSection';
import { AnimatedButton } from '@/components/ui/motion/AnimatedButton';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <HomeSection
      id="cta"
      eyebrow="Ready"
      title="Make your space feel premium"
      description="Start with best sellers or browse categories in a guided experience."
      className="bg-gray-50"
    >
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <div className="text-base font-semibold text-gray-900">Browse curated categories, clean ingredients, and premium packaging.</div>
            <div className="mt-2 text-sm leading-relaxed text-gray-600">Fast shipping over $100, easy order tracking, and support that responds.</div>
          </div>
          <div className="md:col-span-4 md:flex md:justify-end">
            <Link to="/shop" className="w-full md:w-auto">
              <AnimatedButton className="w-full" size="lg">
                Get Started <ArrowRight className="h-4 w-4" />
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}

