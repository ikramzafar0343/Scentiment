import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowLeft,
  HiShoppingCart,
  HiSearch,
  HiCheck,
  HiX,
  HiClock,
  HiTruck,
  HiCurrencyDollar,
  HiCollection,
  HiEye,
  HiCalendar,
  HiUser,
  HiLocationMarker,
  HiChevronDown,
} from 'react-icons/hi';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import placeholderImage100 from '@/assets/images/placeholder-100.svg';
import { useSellerConfig } from '@/hooks/useSellerConfig';
import { getIconById } from '@/configs/icons/iconRegistry';
import { OrderDetailsModal } from '@/components/seller/OrderDetailsModal';
import { apiService } from '@/services/api/api.service';
import { useAuthStore } from '@/store/useAuthStore';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

// Helper function to transform backend order to frontend Order format
function transformOrder(apiOrder: any): Order {
  // Format shipping address
  const addressParts = [
    apiOrder.shippingAddress,
    apiOrder.shippingCity,
    apiOrder.shippingState,
    apiOrder.shippingZip,
    apiOrder.shippingCountry,
  ].filter(Boolean);
  const shippingAddress = addressParts.join(', ') || 'No address provided';

  // Generate order number from ID and date
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
    paymentMethod: 'Credit Card', // Backend doesn't store payment method yet
  };
}

export function Orders() {
  const config = useSellerConfig('orders');
  const { tokens, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !tokens?.accessToken) {
        setLoading(false);
        setError('Authentication required. Please sign in to view orders.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const statusParam = statusFilter !== 'all' ? statusFilter : undefined;
        const apiOrders = await apiService.getOrders(tokens.accessToken, 1, 100, statusParam);
        const transformedOrders = apiOrders.map(transformOrder);
        setOrders(transformedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tokens?.accessToken, isAuthenticated, statusFilter]);

  // Filter orders by search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [orders, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const processingCount = orders.filter((o) => o.status === 'processing').length;
    const shippedCount = orders.filter((o) => o.status === 'shipped').length;
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

    return {
      totalOrders,
      totalRevenue,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
    };
  }, [orders]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    if (!tokens?.accessToken) {
      alert('Authentication required to update order status.');
      return;
    }

    try {
      await apiService.updateOrderStatus(orderId, newStatus, tokens.accessToken);
      // Update local state optimistically
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = config.statusConfig[status];
    if (!statusConfig) {
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', 'bg-gray-100', 'text-gray-800')}>
          {status}
        </span>
      );
    }

    const Icon = getIconById(statusConfig.icon);

    return (
      <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', statusConfig.bg, statusConfig.text)}>
        <Icon className="w-3.5 h-3.5" />
        {statusConfig.label}
      </span>
    );
  };

  const getNextStatus = (currentStatus: Order['status']): { nextStatus: Order['status'] | null; actionLabel: string; icon: string } | null => {
    const flow = config.statusFlow.find(f => f.from === currentStatus);
    if (!flow || !flow.to) return null;
    return {
      nextStatus: flow.to as Order['status'],
      actionLabel: flow.actionLabel,
      icon: flow.icon,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--ds-surface-alt)] via-white to-[color:var(--ds-surface-alt)]">
      <Seo
        title={config.metadata.seo.title}
        description={config.metadata.seo.description}
        canonicalPath={config.metadata.seo.canonicalPath}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <PageContainer className="py-4">
          <div className="flex items-center justify-between">
            <Link
              to={config.metadata.header.backButton?.path || '/seller/dashboard'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{config.metadata.header.backButton?.label}</span>
            </Link>
            <div className="text-2xl font-serif font-semibold text-gray-900">Scentiment</div>
          </div>
        </PageContainer>
      </header>

      <PageContainer className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-lg">
                <HiShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{config.metadata.header.title}</h1>
                <p className="text-gray-600 mt-1">{config.metadata.header.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{config.ui.labels.totalOrders}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-md">
                  <HiCollection className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-emerald-200/30 via-green-100/30 to-emerald-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{config.ui.labels.totalRevenue}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <HiCurrencyDollar className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-yellow-200/30 via-yellow-100/30 to-yellow-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{config.ui.labels.pending}</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md">
                  <HiClock className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-purple-200/30 via-purple-100/30 to-purple-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{config.ui.labels.shipped}</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{stats.shippedCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <HiTruck className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group rounded-2xl border border-gray-200/50 p-4 shadow-sm bg-gradient-to-br from-emerald-200/30 via-green-100/30 to-emerald-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{config.ui.labels.delivered}</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.deliveredCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <HiCheck className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl p-5 shadow-md border border-gray-200/60 mb-6 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[color:var(--ds-primary)] transition-colors z-10" />
                <input
                  type="text"
                  placeholder={config.ui.placeholders.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-all duration-200 focus:border-[color:var(--ds-primary)] focus:ring-2 focus:ring-[color:var(--ds-primary)]/20 focus:bg-white hover:border-gray-300"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full min-w-[180px] pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white/90 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 focus:border-[color:var(--ds-primary)] focus:ring-2 focus:ring-[color:var(--ds-primary)]/20 focus:bg-white hover:border-gray-300 appearance-none cursor-pointer font-medium"
                >
                  {Object.entries(config.ui.statusLabels || {}).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200"
                >
                  <HiClock className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500 text-lg font-semibold">Loading orders...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 rounded-xl p-12 text-center shadow-sm border border-red-200"
                >
                  <HiX className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <p className="text-red-600 text-lg font-semibold">Error loading orders</p>
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                </motion.div>
              ) : filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200"
                >
                  <HiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-semibold">{config.ui.emptyStates?.noOrders}</p>
                  <p className="text-gray-400 text-sm mt-2">{config.ui.emptyStates?.noOrdersSubtitle}</p>
                </motion.div>
              ) : (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <HiUser className="w-4 h-4" />
                                  <span>{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <HiCalendar className="w-4 h-4" />
                                  <span>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <HiLocationMarker className="w-4 h-4" />
                                  <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{formatPrice(order.total)}</p>
                              <p className="text-xs text-gray-500 mt-1">{order.items.length} item(s)</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2 mb-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-600">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 lg:min-w-[200px]">
                          {(() => {
                            const nextStatusInfo = getNextStatus(order.status);
                            return nextStatusInfo && nextStatusInfo.nextStatus ? (
                              <Button
                                onClick={() => handleStatusUpdate(order.id, nextStatusInfo.nextStatus!)}
                                className="bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] hover:shadow-lg transition-all w-full"
                              >
                                {(() => {
                                  const Icon = getIconById(nextStatusInfo.icon);
                                  return (
                                    <>
                                      <Icon className="w-4 h-4" />
                                      {nextStatusInfo.actionLabel}
                                    </>
                                  );
                                })()}
                              </Button>
                            ) : null;
                          })()}
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <HiEye className="w-4 h-4" />
                            {config.ui.labels.viewDetails}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </PageContainer>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
