import type { ReactNode } from 'react';
import type { CatalogProduct } from '../types';

function ProductAccordion({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all hover:shadow-md"
    >
      <summary className="cursor-pointer select-none text-base font-semibold text-gray-900 flex items-center justify-between list-none">
        <span>{title}</span>
        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="mt-4 pt-4 border-t border-gray-100">{children}</div>
    </details>
  );
}

export function ProductAccordions({
  product,
  coverage,
  selectedVariant,
}: {
  product: CatalogProduct;
  coverage: string | null;
  selectedVariant: string | null;
}) {
  return (
    <div className="space-y-4">
      <ProductAccordion title="Description" defaultOpen>
        <div className="space-y-3 text-sm leading-relaxed text-gray-600">
          <p>{product.description || 'Premium quality product designed for modern living spaces.'}</p>
          <ul className="grid gap-2 mt-4">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
              <span>Cold-air diffusion for clean, consistent scent (no heat, no water).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
              <span>Designed for homes, offices, and everyday luxury.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
              <span>Pair with premium oils to customize intensity and vibe.</span>
            </li>
          </ul>
        </div>
      </ProductAccordion>

      <ProductAccordion title="Details">
        <ul className="grid gap-3 text-sm leading-relaxed text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
            <span>
              <strong className="text-gray-900">Coverage:</strong> {coverage || 'Varies by product'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
            <span>
              <strong className="text-gray-900">Category:</strong> {product.category}
            </span>
          </li>
          {selectedVariant ? (
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
              <span>
                <strong className="text-gray-900">Selected:</strong> {selectedVariant}
              </span>
            </li>
          ) : null}
        </ul>
      </ProductAccordion>

      <ProductAccordion title="What's Included">
        <ul className="grid gap-2 text-sm leading-relaxed text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
            <span>{product.name}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
            <span>Premium fragrance oils (varies by kit).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />
            <span>Quick-start instructions.</span>
          </li>
        </ul>
      </ProductAccordion>

      <ProductAccordion title="How to Use">
        <ol className="grid gap-2 list-decimal pl-5 text-sm leading-relaxed text-gray-600">
          <li>Open the fragrance compartment and insert the oil bottle.</li>
          <li>Power on the diffuser and choose your preferred intensity.</li>
          <li>Keep the unit upright and enjoy clean, even diffusion.</li>
        </ol>
      </ProductAccordion>

      <ProductAccordion title="Shipping & Returns">
        <div className="space-y-2 text-sm leading-relaxed text-gray-600">
          <p>Orders ship fast from our warehouse. Tracking is provided after dispatch.</p>
          <p>Returns accepted within the allowed window for unused items in original packaging.</p>
        </div>
      </ProductAccordion>
    </div>
  );
}

