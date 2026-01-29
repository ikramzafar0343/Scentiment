import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX,
  HiUser,
  HiCalendar,
  HiLocationMarker,
  HiCreditCard,
  HiShoppingCart,
  HiTag,
} from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { cn, formatPrice } from '@/lib/utils';
import { useSellerConfig } from '@/hooks/useSellerConfig';
import { getIconById } from '@/configs/icons/iconRegistry';
import placeholderImage100 from '@/assets/images/placeholder-100.svg';
import type { Order } from '@/pages/seller/Orders';
import { apiService } from '@/services/api/api.service';
import { useAuthStore } from '@/store/useAuthStore';
import { HiClock } from 'react-icons/hi';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

// Helper function to transform backend order to frontend Order format
function transformOrder(apiOrder: any): Order {
  const addressParts = [
    apiOrder.shippingAddress,
    apiOrder.shippingCity,
    apiOrder.shippingState,
    apiOrder.shippingZip,
    apiOrder.shippingCountry,
  ].filter(Boolean);
  const shippingAddress = addressParts.join(', ') || 'No address provided';

  const orderDate = new Date(apiOrder.createdAt || apiOrder.date || Date.now());
  const year = orderDate.getFullYear();
  const orderNum = apiOrder._id?.slice(-6).toUpperCase() || apiOrder.id?.slice(-6).toUpperCase() || '000000';
  const orderNumber = `ORD-${year}-${orderNum}`;

  return {
    id: apiOrder._id || apiOrder.id,
    orderNumber,
    customerName: apiOrder.shippingName || apiOrder.userEmail?.split('@')[0] || 'Customer',
    customerEmail: apiOrder.userEmail || '',
    date: orderDate.toISOString().split('T')[0],
    status: (apiOrder.status || 'pending') as Order['status'],
    total: apiOrder.total || 0,
    items: (apiOrder.items || []).map((item: any, index: number) => ({
      id: item.productId || item.id || String(index),
      name: item.productName || item.name || 'Unknown Product',
      quantity: item.quantity || 1,
      price: item.price || 0,
      image: item.image || placeholderImage100,
    })),
    shippingAddress,
    paymentMethod: 'Credit Card',
  };
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const config = useSellerConfig('orders');
  const { tokens } = useAuthStore();
  const [fullOrder, setFullOrder] = useState<Order | null>(order);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch full order details from API if order ID is provided
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order?.id || !tokens?.accessToken) {
        setFullOrder(order);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiOrder = await apiService.getOrder(order.id, tokens.accessToken);
        const transformedOrder = transformOrder(apiOrder);
        setFullOrder(transformedOrder);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order details');
        // Fallback to the order passed as prop
        setFullOrder(order);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order?.id, tokens?.accessToken]);

  if (!order) return null;

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = config.statusConfig?.[status];
    if (!statusConfig) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }

    const Icon = getIconById(statusConfig.icon);
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
        statusConfig.bg,
        statusConfig.text
      )}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {statusConfig.label}
      </span>
    );
  };

  if (!fullOrder) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600 mt-1">{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <HiClock className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">Loading order details...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : (
              <>
                {/* Order Header Info */}
                <div className="bg-gradient-to-br from-[color:var(--ds-surface-alt)] via-white to-[color:var(--ds-surface-alt)] rounded-xl p-6 border border-gray-200/60">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-lg">
                        <HiShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-bold text-gray-900">{fullOrder.orderNumber}</p>
                          {getStatusBadge(fullOrder.status)}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(fullOrder.total)}</p>
                        <p className="text-xs text-gray-500 mt-1">{fullOrder.items.length} item(s)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer & Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HiUser className="w-4 h-4 text-[color:var(--ds-primary)]" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{fullOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{fullOrder.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HiCalendar className="w-4 h-4 text-[color:var(--ds-primary)]" />
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(fullOrder.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Method</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <HiCreditCard className="w-4 h-4" />
                          {fullOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <HiLocationMarker className="w-4 h-4 text-[color:var(--ds-primary)]" />
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-900">{fullOrder.shippingAddress}</p>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <HiTag className="w-4 h-4 text-[color:var(--ds-primary)]" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {fullOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200/50 hover:shadow-md transition-shadow"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || placeholderImage100}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-[color:var(--ds-primary)]/10 via-[color:var(--ds-accent)]/5 to-transparent rounded-xl p-6 border border-[color:var(--ds-primary)]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Subtotal</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(fullOrder.total)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] bg-clip-text text-transparent mt-1">
                        {formatPrice(fullOrder.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
