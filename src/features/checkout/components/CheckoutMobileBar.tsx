import { useCallback } from 'react';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export function CheckoutMobileBar({
  total,
  isSubmitting,
  disabled,
  onSubmit,
}: {
  total: number;
  isSubmitting: boolean;
  disabled: boolean;
  onSubmit: () => void;
}) {
  const handleSubmit = useCallback(() => onSubmit(), [onSubmit]);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur-sm shadow-lg safe-area-inset-bottom">
      <PageContainer className="py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900">Total</div>
            <div className="text-lg font-bold text-gray-900 truncate">{formatPrice(total)}</div>
          </div>
          <Button
            size="lg"
            className="h-12 px-7"
            isLoading={isSubmitting}
            disabled={disabled}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Processing' : 'Place order'}
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}

