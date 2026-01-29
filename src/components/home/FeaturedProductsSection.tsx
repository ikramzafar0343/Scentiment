import { useState, useMemo } from 'react';
import { 
  HiFire, 
  HiCollection, 
  HiSparkles, 
  HiBeaker,
} from 'react-icons/hi';
import { GiSpray, GiPerfumeBottle } from 'react-icons/gi';
import { HomeSection } from '@/components/home/HomeSection';
import { FadeIn } from '@/components/ui/motion/FadeIn';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
import type { Product } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';

type FeaturedProductsSectionProps = {
  products: Product[];
};

const FILTERS = [
  { id: 'all', label: 'All Products', icon: HiCollection },
  { id: 'Diffusers', label: 'Diffusers', icon: HiSparkles },
  { id: 'Fragrance Oils', label: 'Fragrance Oils', icon: HiBeaker },
  { id: 'Room Sprays', label: 'Room Sprays', icon: GiSpray },
  { id: 'Candles', label: 'Candles', icon: HiFire },
  { id: 'Perfumes', label: 'Perfumes', icon: GiPerfumeBottle },
  { id: 'sale', label: 'On Sale', icon: HiFire },
];

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'all') {
      return products;
    }
    
    if (selectedFilter === 'sale') {
      return products.filter((p) => {
        const withSale = p as Product & { badge?: string; originalPrice?: number };
        return withSale.badge === 'SALE' || withSale.badge?.includes('OFF') || Boolean(withSale.originalPrice);
      });
    }
    
    return products.filter(p => p.category === selectedFilter);
  }, [products, selectedFilter]);

  return (
    <HomeSection
      id="featured"
      eyebrow="Featured Products"
      title="Best Sellers & New Arrivals"
      description="Hand-picked selections of our most loved diffusers and fragrances"
      className="bg-[color:var(--ds-surface-alt)]"
    >
      {/* Filters */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                'px-5 py-2.5 border-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-1.5',
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white border-transparent shadow-md'
                  : 'border-black/10 text-gray-600 bg-white hover:border-black/20 hover:text-[color:var(--ds-primary)]'
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((p, idx) => (
            <FadeIn key={p.id} delay={0.03 * idx}>
              <ProductCard product={p} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center mt-12">
        <Button size="lg">
          View All Products
        </Button>
      </div>
    </HomeSection>
  );
}
