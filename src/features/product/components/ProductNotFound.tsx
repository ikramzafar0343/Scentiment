import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';

export function ProductNotFound() {
  return (
    <div className="page-surface">
      <Seo title="Product not found — Scentiment" description="Product not found." canonicalPath="/products" />
      <PageContainer className="py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="ui-eyebrow">Product</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Not found</h1>
          <p className="mt-4 text-gray-600">This product doesn’t exist or was removed.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/shop" className="ui-menu-item ui-focus-ring inline-flex w-auto px-5 py-3">
              Back to shop
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

