import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiChartBar,
  HiTrendingUp,
  HiTrendingDown,
  HiShoppingCart,
  HiUsers,
  HiStar,
  HiCurrencyDollar,
  HiCollection,
  HiTag,
  HiCalendar,
  HiArrowUp,
  HiArrowDown,
  HiClock,
} from 'react-icons/hi';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Seo } from '@/components/seo/Seo';
import { cn, formatPrice } from '@/lib/utils';
import { apiService } from '@/services/api/api.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useSellerConfig } from '@/hooks/useSellerConfig';

type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    chart: { date: string; value: number }[];
  };
  orders: {
    total: number;
    change: number;
    chart: { date: string; value: number }[];
  };
  products: {
    total: number;
    sold: number;
    change: number;
  };
  customers: {
    total: number;
    new: number;
    change: number;
  };
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
    orders: number;
    change: number;
  }[];
  categories: {
    name: string;
    revenue: number;
    orders: number;
    percentage: number;
  }[];
}

export function Analytics() {
  const config = useSellerConfig('analytics');
  const { tokens, isAuthenticated } = useAuthStore();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      // Check if user is authenticated
      if (!isAuthenticated || !tokens?.accessToken) {
        setLoading(false);
        setError('Authentication required. Please sign in to view analytics.');
        setAnalyticsData({
          revenue: { total: 0, change: 0, chart: [] },
          orders: { total: 0, change: 0, chart: [] },
          products: { total: 0, sold: 0, change: 0 },
          customers: { total: 0, new: 0, change: 0 },
          topProducts: [],
          categories: [],
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAnalytics(timePeriod, tokens.accessToken);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
        
        // Check if it's an authentication error
        if (errorMessage.toLowerCase().includes('unauthorized') || 
            errorMessage.includes('401') || 
            errorMessage.toLowerCase().includes('authentication') ||
            errorMessage.toLowerCase().includes('sign in')) {
          setError('Your session has expired or you are not authenticated. Please sign in again to view analytics.');
        } else {
          setError(errorMessage);
        }
        
        // Set empty data structure on error
        setAnalyticsData({
          revenue: { total: 0, change: 0, chart: [] },
          orders: { total: 0, change: 0, chart: [] },
          products: { total: 0, sold: 0, change: 0 },
          customers: { total: 0, new: 0, change: 0 },
          topProducts: [],
          categories: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timePeriod, tokens?.accessToken, isAuthenticated]);

  const timePeriodOptions = config.timePeriods;

  const getMaxValue = (data: { value: number }[]) => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((d) => d.value), 1);
  };

  const revenueMax = analyticsData ? getMaxValue(analyticsData.revenue.chart) : 1;
  const ordersMax = analyticsData ? getMaxValue(analyticsData.orders.chart) : 1;

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center shadow-lg">
                  <HiChartBar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{config.metadata.header.title}</h1>
                  <p className="text-gray-600 mt-1">{config.metadata.header.subtitle}</p>
                </div>
              </div>

              {/* Time Period Selector */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                <HiCalendar className="w-4 h-4 text-gray-500 ml-2" />
                {timePeriodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimePeriod(option.value as TimePeriod)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                      timePeriod === option.value
                        ? 'bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <HiClock className="w-5 h-5 animate-spin" />
                <span>Loading analytics data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Key Metrics Cards */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <HiCurrencyDollar className="w-6 h-6 text-white" />
                  </div>
                  {analyticsData.revenue.change > 0 ? (
                    <HiTrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <HiTrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-600">{config.ui.labels.totalRevenue}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatPrice(analyticsData.revenue.total)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      analyticsData.revenue.change > 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {analyticsData.revenue.change > 0 ? '+' : ''}
                    {analyticsData.revenue.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">{config.ui.labels.vsPreviousPeriod}</span>
                </div>
              </motion.div>

            {/* Orders Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-purple-200/30 via-purple-100/30 to-purple-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <HiShoppingCart className="w-6 h-6 text-white" />
                </div>
                {analyticsData.orders.change > 0 ? (
                  <HiTrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <HiTrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">{config.ui.labels.totalOrders}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.orders.total.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-semibold',
                    analyticsData.orders.change > 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {analyticsData.orders.change > 0 ? '+' : ''}
                  {analyticsData.orders.change.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">{config.ui.labels.vsPreviousPeriod}</span>
              </div>
            </motion.div>

            {/* Products Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-emerald-200/30 via-green-100/30 to-emerald-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <HiCollection className="w-6 h-6 text-white" />
                </div>
                {analyticsData.products.change > 0 ? (
                  <HiTrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <HiTrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">{config.ui.labels.totalProducts}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.products.total.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-semibold",
                  analyticsData.products.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {analyticsData.products.change >= 0 ? '+' : ''}{analyticsData.products.change.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">{config.ui.labels.vsPreviousPeriod}</span>
              </div>
            </motion.div>

            {/* Customers Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group rounded-2xl border border-gray-200/50 p-6 shadow-sm bg-gradient-to-br from-orange-200/30 via-orange-100/30 to-orange-50/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <HiUsers className="w-6 h-6 text-white" />
                </div>
                {analyticsData.customers.change > 0 ? (
                  <HiTrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <HiTrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">{config.ui.labels.totalCustomers}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.customers.total.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">
                  +{analyticsData.customers.change.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">
                  {analyticsData.customers.new} {config.ui.labels.newCustomers}
                </span>
              </div>
            </motion.div>
          </div>
          )}

          {/* Charts Section */}
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <HiCurrencyDollar className="w-5 h-5 text-[color:var(--ds-primary)]" />
                    {config.chartLabels.revenue}
                  </h2>
                </div>
                <div className="h-64 flex items-end justify-between gap-1">
                  {analyticsData.revenue.chart.length > 0 ? (
                    analyticsData.revenue.chart.map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative"
                      style={{
                        height: `${(point.value / revenueMax) * 100}%`,
                        minHeight: '4px',
                      }}
                      title={`${formatPrice(point.value)}`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {formatPrice(point.value)}
                      </div>
                    </div>
                  </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <p>No data available</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Orders Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <HiShoppingCart className="w-5 h-5 text-[color:var(--ds-primary)]" />
                    {config.chartLabels.orders}
                  </h2>
                </div>
                <div className="h-64 flex items-end justify-between gap-1">
                  {analyticsData.orders.chart.length > 0 ? (
                    analyticsData.orders.chart.map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative"
                      style={{
                        height: `${(point.value / ordersMax) * 100}%`,
                        minHeight: '4px',
                      }}
                      title={`${point.value.toFixed(0)} orders`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {point.value.toFixed(0)} orders
                      </div>
                    </div>
                  </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <p>No data available</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Top Products & Categories */}
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y:0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <HiStar className="w-5 h-5 text-[color:var(--ds-primary)]" />
                  {config.sectionLabels.topProducts}
                </h2>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-600">
                            {product.orders} {config.ui.labels.orders}
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {formatPrice(product.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.change > 0 ? (
                        <HiArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <HiArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          product.change > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {product.change > 0 ? '+' : ''}
                        {product.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Categories Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HiTag className="w-5 h-5 text-[color:var(--ds-primary)]" />
                {config.sectionLabels.categories}
              </h2>
              <div className="space-y-4">
                {analyticsData.categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{category.name}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(category.revenue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[color:var(--ds-primary)] to-[color:var(--ds-accent)] rounded-full transition-all"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{category.orders} {config.ui.labels.orders}</span>
                      <span>{category.percentage}% {config.ui.labels.ofRevenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          )}
        </motion.div>
      </PageContainer>
    </div>
  );
}
