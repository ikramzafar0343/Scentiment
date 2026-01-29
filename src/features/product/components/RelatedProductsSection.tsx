import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { formatPrice, slugify } from '@/lib/utils';
import type { CatalogProduct } from '../types';

function productTo(name: string) {
  return `/products/${slugify(name)}`;
}

function RelatedCard({ product }: { product: CatalogProduct }) {
  const to = productTo(product.name);
  return (
    <Link to={to} state={{ product }} className="group ui-card ui-card-hover overflow-hidden">
      <div className="aspect-[3/4] bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{product.category}</div>
        <div className="mt-2 text-sm font-semibold text-gray-900">{product.name}</div>
        <div className="mt-2 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}

export function RelatedProductsSection({ products }: { products: CatalogProduct[] }) {
  const hasProducts = products.length > 0;
  if (!hasProducts) return null;

  return (
    <section className="border-t border-black/10 bg-[color:var(--ds-surface-alt)] py-14">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <div className="ui-eyebrow">You may also like</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Related Products</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <RelatedCard key={p.id} product={p} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
