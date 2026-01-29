import { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Seo } from '@/components/seo/Seo';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, slugify } from '@/lib/utils';
import type { CatalogProduct } from '@/features/product/types';
import { extractCoverage, getProductBySlug, getProductImages, getRelatedProducts } from '@/features/product/data';
import { useRecentlyViewed } from '@/features/product/useRecentlyViewed';
import { ProductNotFound } from '@/features/product/components/ProductNotFound';
import { ProductBreadcrumbs } from '@/features/product/components/ProductBreadcrumbs';
import { ProductGallery } from '@/features/product/components/ProductGallery';
import { ProductHeaderInfo } from '@/features/product/components/ProductHeaderInfo';
import { ProductPurchaseCard } from '@/features/product/components/ProductPurchaseCard';
import { ProductAccordions } from '@/features/product/components/ProductAccordions';
import { ProductMobileBar } from '@/features/product/components/ProductMobileBar';
import { RelatedProductsSection } from '@/features/product/components/RelatedProductsSection';

function ProductDetailsView({ product }: { product: CatalogProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(product.variants?.[0] ?? null);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = useMemo(() => getProductImages(product), [product]);
  const related = useMemo(() => getRelatedProducts(product), [product]);
  const coverage = useMemo(() => extractCoverage(product.description), [product.description]);

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const saveLabel =
    product.saveAmount && product.saveAmount > 0
      ? `Save ${formatPrice(product.saveAmount)}`
      : hasDiscount
        ? `Save ${formatPrice(Math.max(0, (product.originalPrice ?? product.price) - product.price))}`
        : null;

  const handleDecreaseQuantity = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), []);
  const handleIncreaseQuantity = useCallback(() => setQuantity((q) => Math.min(99, q + 1)), []);

  const handleAddToCart = useCallback(() => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
    toggleCart();
  }, [addItem, product, quantity, toggleCart]);

  return (
    <div className="page-surface">
      <Seo
        title={`${product.name} — Scentiment`}
        description={product.description ?? `Shop ${product.name} on Scentiment.`}
        canonicalPath={`/products/${slugify(product.name)}`}
      />

      <ProductBreadcrumbs name={product.name} />

      <PageContainer className="py-8 lg:py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <ProductGallery
            name={product.name}
            badge={product.badge}
            images={images}
            selectedIndex={selectedImageIndex}
            onSelectIndex={setSelectedImageIndex}
          />

          <div className="flex flex-col gap-8">
            <ProductHeaderInfo
              category={product.category}
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              coverage={coverage}
              description={product.description}
            />

            <ProductPurchaseCard
              price={product.price}
              originalPrice={product.originalPrice}
              hasDiscount={hasDiscount}
              saveLabel={saveLabel}
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              quantity={quantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              onIncreaseQuantity={handleIncreaseQuantity}
              onAddToCart={handleAddToCart}
              isAdded={isAdded}
            />

            <ProductAccordions product={product} coverage={coverage} selectedVariant={selectedVariant} />
          </div>
        </div>
      </PageContainer>

      <ProductMobileBar
        price={product.price}
        originalPrice={product.originalPrice}
        hasDiscount={hasDiscount}
        isAdded={isAdded}
        onAddToCart={handleAddToCart}
      />

      <RelatedProductsSection products={related} />
    </div>
  );
}

export function ProductDetails() {
  const { slug } = useParams();
  const location = useLocation();

  const stateProduct = (location.state as { product?: CatalogProduct } | null)?.product;
  const product = useMemo(() => stateProduct ?? getProductBySlug(slug), [slug, stateProduct]);

  useRecentlyViewed(product);
  if (!product) return <ProductNotFound />;
  return <ProductDetailsView key={product.id} product={product} />;
}
