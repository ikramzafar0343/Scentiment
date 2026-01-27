import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/store/useCartStore';

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <HomeSection
      id="featured"
      eyebrow="Featured"
      title="Best sellers, curated"
      description="Premium picks that customers come back for."
      className="bg-white"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="text-sm text-gray-600">Hand-picked top performers.</div>
        <Link
          to="/shop"
          className="group hidden items-center gap-2 text-sm font-semibold text-gray-900 hover:text-black sm:flex"
        >
          View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, idx) => (
          <FadeIn key={p.id} delay={0.03 * idx}>
            <ProductCard product={p} />
          </FadeIn>
        ))}
      </div>
    </HomeSection>
  );
}
