import { Link, useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';

type SuccessState = {
  reference: string;
  email: string;
  total: number;
  itemCount: number;
};

export function CheckoutSuccess() {
  const location = useLocation();
  const state = (location.state as SuccessState | null) ?? null;

  return (
    <div className="page-surface">
      <Seo
        title="Order confirmed — Scentiment"
        description="Your order has been placed successfully."
        canonicalPath="/checkout/success"
      />

      <section className="border-b border-black/10 bg-[color:var(--ds-surface-alt)]">
        <PageContainer className="py-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors ui-focus-ring rounded-md px-1.5 py-1">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <span className="text-gray-900">Order confirmed</span>
          </nav>
        </PageContainer>
      </section>

      <PageContainer className="py-14 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="ui-card p-8 sm:p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="ui-eyebrow mt-6">Success</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Order confirmed
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Thanks for your purchase. A confirmation email will be sent shortly.
            </p>

            <div className="mt-8 grid gap-3 text-left">
              <div className="rounded-xl border border-black/10 bg-white/70 px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Order reference</div>
                <div className="mt-2 text-lg font-bold text-gray-900">{state?.reference ?? '—'}</div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-white/70 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Email</div>
                  <div className="mt-2 text-sm font-semibold text-gray-900 break-words">
                    {state?.email ?? '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 bg-white/70 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Total</div>
                  <div className="mt-2 text-sm font-semibold text-gray-900">
                    {typeof state?.total === 'number' ? formatPrice(state.total) : '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Continue shopping
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Back home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

