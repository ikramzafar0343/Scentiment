import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';
import { PageContainer } from '@/components/ui/layout/PageContainer';

export function CheckoutBreadcrumbs() {
  return (
    <section className="border-b border-black/10 bg-[color:var(--ds-surface-alt)]">
      <PageContainer className="py-6">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
          <Link to="/" className="hover:text-gray-900 transition-colors ui-focus-ring rounded-md px-1.5 py-1">
            Home
          </Link>
          <HiChevronRight className="h-4 w-4 text-gray-300" />
          <Link to="/shop" className="hover:text-gray-900 transition-colors ui-focus-ring rounded-md px-1.5 py-1">
            Shop
          </Link>
          <HiChevronRight className="h-4 w-4 text-gray-300" />
          <span className="text-gray-900">Checkout</span>
        </nav>
      </PageContainer>
    </section>
  );
}

