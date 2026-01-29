// Payment method list component for managing saved cards
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCreditCard, HiTrash, HiCheck } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import type { SavedPaymentMethod } from '@/lib/payment/types';
import { maskCardNumber } from '@/lib/payment/utils';

interface PaymentMethodListProps {
  paymentMethods: SavedPaymentMethod[];
  selectedMethodId?: string;
  onSelect: (methodId: string) => void;
  onDelete: (methodId: string) => Promise<void>;
  onSetDefault?: (methodId: string) => Promise<void>;
  isLoading?: boolean;
}

export function PaymentMethodList({
  paymentMethods,
  selectedMethodId,
  onSelect,
  onDelete,
  onSetDefault,
  isLoading = false,
}: PaymentMethodListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleDelete = async (methodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this card?')) return;

    setDeletingId(methodId);
    try {
      await onDelete(methodId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (methodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSetDefault) return;

    setSettingDefaultId(methodId);
    try {
      await onSetDefault(methodId);
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <HiCreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600">No saved payment methods</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {paymentMethods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          const isDeleting = deletingId === method.id;
          const isSettingDefault = settingDefaultId === method.id;

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'relative rounded-xl border-2 p-4 transition-all cursor-pointer',
                isSelected
                  ? 'border-[color:var(--ds-primary)] bg-[color:var(--ds-primary)]/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
              onClick={() => !isDeleting && onSelect(method.id)}
            >
              <div className="flex items-center gap-4">
                {/* Card Icon */}
                <div className="flex-shrink-0">
                  <HiCreditCard className="h-8 w-12 text-gray-600" />
                </div>

                {/* Card Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {method.card ? maskCardNumber(method.card.last4) : 'Card'}
                    </span>
                    {method.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--ds-primary)]/10 text-[10px] font-extrabold uppercase tracking-widest text-[color:var(--ds-primary)]">
                        <HiCheck className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  {method.card && (
                    <div className="text-xs text-gray-500">
                      Expires {String(method.card.expMonth).padStart(2, '0')}/{method.card.expYear}
                      {method.card.name && ` • ${method.card.name}`}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!method.isDefault && onSetDefault && (
                    <button
                      type="button"
                      onClick={(e) => handleSetDefault(method.id, e)}
                      disabled={isSettingDefault || isLoading}
                      className="p-2 text-gray-400 hover:text-[color:var(--ds-primary)] transition-colors disabled:opacity-50"
                      title="Set as default"
                    >
                      {isSettingDefault ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <HiCheck className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <HiCheck className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(method.id, e)}
                    disabled={isDeleting || isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Remove card"
                  >
                    {isDeleting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <HiTrash className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <HiTrash className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className="h-5 w-5 rounded-full bg-[color:var(--ds-primary)] flex items-center justify-center">
                    <HiCheck className="h-3 w-3 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
