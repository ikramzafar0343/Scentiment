import { Hero } from '@/components/home/Hero';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CollectionsSliderSection } from '@/components/home/CollectionsSliderSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { UseCasesSection } from '@/components/home/UseCasesSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { StatsSection } from '@/components/home/StatsSection';
import { CTASection } from '@/components/home/CTASection';
import { FAQSection } from '@/components/home/FAQSection';
import { StickyMobileCTA } from '@/components/ui/StickyMobileCTA';
import { PRODUCTS } from '@/lib/data';
import { Seo } from '@/components/seo/Seo';

export function Home() {
  const featured = PRODUCTS.slice(0, 6);

  return (
    <div className="relative min-h-screen bg-white text-gray-900 selection:bg-[#d4af37]/30">
      <Seo
        title="Scentiment — Premium Home Fragrance"
        description="Premium home fragrance, made effortless. Explore diffusers, oils, room sprays, candles, and fine fragrance designed for modern spaces."
        canonicalPath="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Scentiment',
          url: '/',
          sameAs: []
        }}
      />
      <Hero />
      <HowItWorksSection />
      <CollectionsSliderSection />
      <FeaturesSection />
      <UseCasesSection />
      <FeaturedProductsSection products={featured} />
      <SocialProofSection />
      <StatsSection />
      <CTASection />
      <FAQSection />
      <StickyMobileCTA />
    </div>
  );
}
