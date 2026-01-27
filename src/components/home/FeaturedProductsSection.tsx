import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { ProductCard } from '@/components/ui/ProductCard';
import type { Product } from '@/store/useCartStore';

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <HomeSection
      id="featured"
      eyebrow="Featured Products"
      title="Best Sellers & New Arrivals"
      description="Hand-picked selections of our most loved diffusers and fragrances"
      className="bg-[#f5f5f5]"
    >
      {/* Filters */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        <button className="filter-btn px-5 py-2.5 border-2 border-[#e0e0e0] rounded-full text-sm text-gray-600 font-medium transition-all duration-150 bg-white hover:border-[#0066cc] hover:text-[#0066cc] active">
          All Products
        </button>
        <button className="filter-btn px-5 py-2.5 border-2 border-[#e0e0e0] rounded-full text-sm text-gray-600 font-medium transition-all duration-150 bg-white hover:border-[#0066cc] hover:text-[#0066cc]">
          Diffusers
        </button>
        <button className="filter-btn px-5 py-2.5 border-2 border-[#e0e0e0] rounded-full text-sm text-gray-600 font-medium transition-all duration-150 bg-white hover:border-[#0066cc] hover:text-[#0066cc]">
          Hotel Collection
        </button>
        <button className="filter-btn px-5 py-2.5 border-2 border-[#e0e0e0] rounded-full text-sm text-gray-600 font-medium transition-all duration-150 bg-white hover:border-[#0066cc] hover:text-[#0066cc]">
          Designer Collection
        </button>
        <button className="filter-btn px-5 py-2.5 border-2 border-[#e0e0e0] rounded-full text-sm text-gray-600 font-medium transition-all duration-150 bg-white hover:border-[#0066cc] hover:text-[#0066cc]">
          On Sale 🔥
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, idx) => (
          <FadeIn key={p.id} delay={0.03 * idx}>
            <ProductCard product={p} />
          </FadeIn>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="px-10 py-3.5 bg-gradient-to-r from-[#0066cc] to-[#20b2aa] text-white text-base font-semibold rounded-md transition-all duration-150 hover:from-[#0052a3] hover:to-[#1a9a94] hover:-translate-y-0.5 hover:shadow-lg">
          View All Products
        </button>
      </div>
    </HomeSection>
  );
}
