import { Hero } from '@/components/home/Hero';
import { CollectionsSliderSection } from '@/components/home/CollectionsSliderSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { UseCasesSection } from '@/components/home/UseCasesSection';
import { CTASection } from '@/components/home/CTASection';
import { FAQSection } from '@/components/home/FAQSection';
import { StickyMobileCTA } from '@/components/ui/StickyMobileCTA';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { Seo } from '@/components/seo/Seo';

export function Home() {
  const products = useCatalogProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="page-surface relative min-h-screen">
      <Seo
        title="AROMAZUR — Les Parfums de la Côte d'Azur"
        description="Transform your space with premium home fragrance. Discover luxury diffusers, hotel-inspired oils, designer scents, and curated collections. Fast shipping, clean ingredients, expert support."
        canonicalPath="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AROMAZUR',
          url: '/',
          sameAs: []
        }}
      />
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Shop by Collection Section */}
      <CollectionsSliderSection />
      
      {/* 3. Best Seller Section & New Arrival */}
      <FeaturedProductsSection products={featured} />
      
      {/* 4. What AROMAZUR Makes Different */}
      <FeaturesSection />
      
      {/* 5. What Our Customer Says */}
      <SocialProofSection />
      
      {/* 6. Perfect for Every Space */}
      <UseCasesSection />
      
      {/* 7. Newsletter or Subscription */}
      <CTASection />
      
      {/* 8. FAQ */}
      <FAQSection />
      
      <StickyMobileCTA />
    </div>
  );
}
