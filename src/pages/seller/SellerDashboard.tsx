import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiBell, 
  HiChat, 
  HiUser, 
  HiShoppingBag,
  HiCube,
  HiShoppingCart,
  HiLogout,
  HiClock,
  HiTrendingUp,
  HiTrendingDown,
} from 'react-icons/hi';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/services/api/api.service';
import { useSellerConfig } from '@/hooks/useSellerConfig';
import { getIconById } from '@/configs/icons/iconRegistry';

interface DashboardStats {
  totalSales: number;
  totalSalesChange: string;
  activeListings: number;
  activeListingsChange: string;
  monthlyRevenue: number;
  monthlyRevenueChange: string;
  totalProducts: number;
  totalProductsChange: string;
  pendingOrders: number;
  pendingOrdersChange: string;
}

interface RecentOrder {
  id: string;
  orderNumber?: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  itemCount: number;
}

interface DashboardNotification {
  id: string;
  message: string;
  read: boolean;
  type: 'order' | 'product';
}

export function SellerDashboard() {
  const navigate = useNavigate();
  const { seller, logout: logoutSeller } = useSellerStore();
  const { tokens, getToken } = useAuthStore();
  const config = useSellerConfig('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Get fresh token from store
      const accessToken = getToken?.() || tokens?.accessToken;
      
      if (!accessToken) {
        setDashboardLoading(false);
        return;
      }

      setDashboardLoading(true);
      try {
        const stats = await apiService.getDashboardStats(accessToken);
        
        setDashboardStats({
          totalSales: stats.totalSales,
          totalSalesChange: stats.totalSalesChange,
          activeListings: stats.activeListings,
          activeListingsChange: stats.activeListingsChange,
          monthlyRevenue: stats.monthlyRevenue,
          monthlyRevenueChange: stats.monthlyRevenueChange,
          totalProducts: stats.totalProducts,
          totalProductsChange: stats.totalProductsChange,
          pendingOrders: stats.pendingOrders,
          pendingOrdersChange: stats.pendingOrdersChange,
        });

        // Fetch recent orders
        try {
          const orders = await apiService.getOrders(accessToken, 1, 5);
          setRecentOrders(orders.map((order: any) => ({
            id: order._id || order.id,
            orderNumber: `#${(order._id || order.id).slice(-8).toUpperCase()}`,
            customerEmail: order.userEmail || 'N/A',
            total: order.total || 0,
            status: order.status || 'pending',
            date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            itemCount: order.items?.length || 0,
          })));
        } catch (error) {
          console.error('Failed to fetch recent orders:', error);
          setRecentOrders([]);
        }

        setNotifications([]);
        setUnreadCount(0);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to empty state on error
        setDashboardStats({
          totalSales: 0,
          totalSalesChange: '+0%',
          activeListings: 0,
          activeListingsChange: '+0',
          monthlyRevenue: 0,
          monthlyRevenueChange: '+0%',
          totalProducts: 0,
          totalProductsChange: '+0',
          pendingOrders: 0,
          pendingOrdersChange: '+0',
        });
        setRecentOrders([]);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [tokens?.accessToken, getToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logoutSeller();
    navigate('/');
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = config.orderStatus.colors[status as keyof typeof config.orderStatus.colors];
    const label = config.orderStatus.labels[status as keyof typeof config.orderStatus.labels] || status;
    
    if (statusConfig) {
      return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusConfig.bg, statusConfig.text)}>
          {label}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  const parseChange = (change: string): { value: number; isPositive: boolean } => {
    const num = parseFloat(change.replace(/[+\-%]/g, '')) || 0;
    const isPositive = change.startsWith('+') || (!change.startsWith('-') && num > 0);
    return { value: num, isPositive };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--ds-surface-alt)] via-white to-[color:var(--ds-surface-alt)]">
      <Seo
        title={config.metadata.seo.title}
        description={config.metadata.seo.description}
        canonicalPath={config.metadata.seo.canonicalPath}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <PageContainer className="py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-3xl font-serif font-semibold tracking-tight text-gray-900">
              {config.metadata.header.title}
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Messages Icon */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowMessagePanel(!showMessagePanel);
                    if (showNotificationPanel) setShowNotificationPanel(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Messages"
                >
                  <HiChat className="h-6 w-6 text-[color:var(--ds-primary)]" />
                </button>
              </div>

              {/* Notifications Icon */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationPanel(!showNotificationPanel);
                    if (showMessagePanel) setShowMessagePanel(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <HiBell className="h-6 w-6 text-[color:var(--ds-primary)]" />
                </button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-[color:var(--ds-primary)]/10 hover:bg-[color:var(--ds-primary)]/20"
                >
                  <HiUser className="w-5 h-5 text-[color:var(--ds-primary)]" />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50"
                    >
                      <Link
                        to="/seller/profile"
                        onClick={() => setShowDropdown(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
                      >
                        <HiUser className="w-4 h-4" />
                        {config.ui.labels.profile}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <HiLogout className="w-4 h-4" />
                        {config.ui.labels.logout}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </PageContainer>
      </header>

      {/* Main Content */}
      <PageContainer className="py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {config.welcome.greeting.replace('{name}', seller?.name || 'Seller')}
          </h1>
          <p className="text-gray-600">
            {seller?.registrationNumber && config.welcome.registrationLabel.replace('{number}', seller.registrationNumber)}
          </p>
        </div>

        {/* Key Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {config.actionCards.map((card) => {
            const Icon = getIconById(card.icon);
            
            return (
              <Link
                key={card.id}
                to={card.path}
                className="group h-full rounded-2xl border border-gray-200/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 cursor-pointer"
                style={{
                  background: `linear-gradient(to bottom right, ${card.gradient.from}, ${card.gradient.via}, ${card.gradient.to})`,
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all"
                    style={{
                      background: `linear-gradient(to bottom right, ${card.iconGradient.from}, ${card.iconGradient.to})`,
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{card.title}</h3>
                    <p className="text-xs text-gray-600">{card.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Performance Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 relative overflow-hidden"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">{config.ui.labels.totalSales}</h3>
                {dashboardStats && (() => {
                  const change = parseChange(dashboardStats.totalSalesChange);
                  return change.isPositive ? (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-md">
                      <HiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                      <HiTrendingDown className="w-5 h-5 text-white" />
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardLoading ? '...' : formatPrice(dashboardStats?.totalSales || 0)}
                </span>
                {dashboardStats && (() => {
                  const change = parseChange(dashboardStats.totalSalesChange);
                  return (
                    <span
                      className={cn(
                        'text-sm font-semibold px-2 py-0.5 rounded-lg',
                        change.isPositive
                          ? 'text-[color:var(--ds-primary)] bg-[color:var(--ds-primary)]/10'
                          : 'text-red-600 bg-red-50'
                      )}
                    >
                      {dashboardStats.totalSalesChange}
                    </span>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-blue-200/30 via-blue-100/30 to-blue-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 relative overflow-hidden"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">{config.ui.labels.activeListings}</h3>
                {dashboardStats && (() => {
                  const change = parseChange(dashboardStats.activeListingsChange);
                  return change.isPositive ? (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-md">
                      <HiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                      <HiTrendingDown className="w-5 h-5 text-white" />
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardLoading ? '...' : dashboardStats?.activeListings || 0}
                </span>
                {dashboardStats && (() => {
                  const change = parseChange(dashboardStats.activeListingsChange);
                  return (
                    <span
                      className={cn(
                        'text-sm font-semibold px-2 py-0.5 rounded-lg',
                        change.isPositive
                          ? 'text-[color:var(--ds-primary)] bg-[color:var(--ds-primary)]/10'
                          : 'text-red-600 bg-red-50'
                      )}
                    >
                      {dashboardStats.activeListingsChange}
                    </span>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{config.ui.labels.recentOrders}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {config.ui.labels.orderId}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {config.ui.labels.customer}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {config.ui.labels.total}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {config.ui.labels.status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {config.ui.labels.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {config.ui.labels.action}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <HiClock className="w-5 h-5 animate-spin" />
                        {config.ui.labels.loadingOrders}
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                        {config.ui.labels.noOrders}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {order.orderNumber || `#${order.id.slice(-8).toUpperCase()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getOrderStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/seller/orders/${order.id}`}
                          className="text-sm font-semibold text-[color:var(--ds-primary)] hover:underline"
                        >
                          {config.ui.labels.viewDetails}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Additional Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] shadow-md">
                <HiShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{config.ui.labels.monthlyRevenue}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-gray-900">
                    {dashboardLoading ? '...' : formatPrice(dashboardStats?.monthlyRevenue || 0)}
                  </span>
                  {dashboardStats && (() => {
                    const change = parseChange(dashboardStats.monthlyRevenueChange);
                    return (
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          change.isPositive ? 'text-[color:var(--ds-primary)]' : 'text-red-500'
                        )}
                      >
                        {dashboardStats.monthlyRevenueChange}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <HiCube className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{config.ui.labels.totalProducts}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-gray-900">
                    {dashboardLoading ? '...' : dashboardStats?.totalProducts || 0}
                  </span>
                  {dashboardStats && (
                    <span className="text-xs font-semibold text-[color:var(--ds-primary)]">
                      {dashboardStats.totalProductsChange}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-emerald-200/30 via-green-100/30 to-emerald-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                <HiShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{config.ui.labels.pendingOrders}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-gray-900">
                    {dashboardLoading ? '...' : dashboardStats?.pendingOrders || 0}
                  </span>
                  {dashboardStats && (() => {
                    const change = parseChange(dashboardStats.pendingOrdersChange);
                    return (
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          change.isPositive ? 'text-[color:var(--ds-primary)]' : 'text-red-500'
                        )}
                      >
                        {dashboardStats.pendingOrdersChange}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotificationPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-gray-200"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{config.ui.labels.notifications}</h3>
              <button
                onClick={() => setShowNotificationPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{config.ui.labels.noNotifications}</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Panel */}
      <AnimatePresence>
        {showMessagePanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-gray-200"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{config.ui.labels.messages}</h3>
              <button
                onClick={() => setShowMessagePanel(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">{config.ui.labels.noMessages}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
