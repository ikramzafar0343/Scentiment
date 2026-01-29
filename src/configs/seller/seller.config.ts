/**
 * Seller Dashboard Configuration
 * Contains all hardcoded text, labels, and UI content for seller pages
 */

import type {
  DashboardConfig,
  OrdersConfig,
  AnalyticsConfig,
  InventoryConfig,
} from './seller.schema';

export const DASHBOARD_CONFIG: DashboardConfig = {
  metadata: {
    seo: {
      title: 'Seller Dashboard — Scentiment',
      description: 'Manage your fragrance products and orders',
      canonicalPath: '/seller/dashboard',
    },
    header: {
      title: 'Scentiment',
    },
  },
  ui: {
    labels: {
      welcome: 'Welcome, {name}!',
      registration: 'Registration: {number}',
      totalSales: 'Total Sales',
      activeListings: 'Active Listings',
      monthlyRevenue: 'Monthly Revenue',
      totalProducts: 'Total Products',
      pendingOrders: 'Pending Orders',
      recentOrders: 'Recent Orders',
      orderId: 'Order ID',
      customer: 'Customer',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      action: 'Action',
      viewDetails: 'View Details →',
      notifications: 'Notifications',
      messages: 'Messages',
      profile: 'Profile',
      logout: 'Logout',
      loadingOrders: 'Loading orders...',
      noOrders: 'No orders found. Orders will appear here once customers start placing orders.',
      noNotifications: 'No notifications',
      noMessages: 'No messages',
    },
    buttons: {
      viewDetails: 'View Details →',
      profile: 'Profile',
      logout: 'Logout',
    },
    placeholders: {},
    messages: {},
    statusLabels: {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
  },
  welcome: {
    greeting: 'Welcome, {name}!',
    registrationLabel: 'Registration: {number}',
  },
  actionCards: [
    {
      id: 'add-product',
      title: 'Add Product',
      description: 'List new fragrances',
      icon: 'HiPlus',
      path: '/seller/products/new',
      gradient: {
        from: 'rgba(0, 102, 204, 0.2)',
        via: 'rgba(230, 242, 255, 0.3)',
        to: 'rgba(240, 247, 255, 0.4)',
      },
      iconGradient: {
        from: '#0066cc',
        to: '#00a8cc',
      },
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View performance',
      icon: 'HiChartBar',
      path: '/seller/analytics',
      gradient: {
        from: 'rgba(191, 219, 254, 0.3)',
        via: 'rgba(219, 234, 254, 0.3)',
        to: 'rgba(239, 246, 255, 0.4)',
      },
      iconGradient: {
        from: '#3b82f6',
        to: '#2563eb',
      },
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Manage stock',
      icon: 'HiCube',
      path: '/seller/inventory',
      gradient: {
        from: 'rgba(221, 214, 254, 0.3)',
        via: 'rgba(237, 233, 254, 0.3)',
        to: 'rgba(245, 243, 255, 0.4)',
      },
      iconGradient: {
        from: '#a855f7',
        to: '#9333ea',
      },
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'View orders',
      icon: 'HiShoppingCart',
      path: '/seller/orders',
      gradient: {
        from: 'rgba(167, 243, 208, 0.3)',
        via: 'rgba(209, 250, 229, 0.3)',
        to: 'rgba(236, 253, 245, 0.4)',
      },
      iconGradient: {
        from: '#10b981',
        to: '#059669',
      },
    },
  ],
  metrics: [
    {
      id: 'total-sales',
      label: 'Total Sales',
      icon: 'HiTrendingUp',
      gradient: {
        from: '#0066cc',
        via: '#e6f2ff',
        to: '#f0f7ff',
      },
      iconGradient: {
        from: 'var(--ds-primary)',
        to: 'var(--ds-accent)',
      },
    },
    {
      id: 'active-listings',
      label: 'Active Listings',
      icon: 'HiTrendingUp',
      gradient: {
        from: 'blue-200',
        via: 'blue-100',
        to: 'blue-50',
      },
      iconGradient: {
        from: 'blue-500',
        to: 'blue-600',
      },
    },
    {
      id: 'monthly-revenue',
      label: 'Monthly Revenue',
      icon: 'HiShoppingBag',
      gradient: {
        from: '#d4af37',
        via: '#f4e4bc',
        to: '#fff9e6',
      },
      iconGradient: {
        from: 'var(--ds-primary)',
        to: 'var(--ds-accent)',
      },
    },
    {
      id: 'total-products',
      label: 'Total Products',
      icon: 'HiCube',
      gradient: {
        from: '#0066cc',
        via: '#e6f2ff',
        to: '#f0f7ff',
      },
      iconGradient: {
        from: 'blue-500',
        to: 'blue-600',
      },
    },
    {
      id: 'pending-orders',
      label: 'Pending Orders',
      icon: 'HiShoppingCart',
      gradient: {
        from: 'emerald-200',
        via: 'green-100',
        to: 'emerald-50',
      },
      iconGradient: {
        from: 'green-500',
        to: 'green-600',
      },
    },
  ],
  orderStatus: {
    labels: {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    colors: {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    },
  },
};

export const ORDERS_CONFIG: OrdersConfig = {
  metadata: {
    seo: {
      title: 'Orders — Scentiment Seller',
      description: 'View and manage customer orders',
      canonicalPath: '/seller/orders',
    },
    header: {
      title: 'Orders',
      subtitle: 'View and manage customer orders',
      backButton: {
        label: 'Back to Dashboard',
        path: '/seller/dashboard',
      },
    },
  },
  ui: {
    labels: {
      orders: 'Orders',
      subtitle: 'View and manage customer orders',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      pending: 'Pending',
      shipped: 'Shipped',
      delivered: 'Delivered',
      orderNumber: 'Order Number',
      customerName: 'Customer Name',
      customerEmail: 'Customer Email',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      itemCount: '{count} item(s)',
      viewDetails: 'View Details',
      markAsProcessing: 'Mark as Processing',
      markAsShipped: 'Mark as Shipped',
      markAsDelivered: 'Mark as Delivered',
    },
    buttons: {
      viewDetails: 'View Details',
      markAsProcessing: 'Mark as Processing',
      markAsShipped: 'Mark as Shipped',
      markAsDelivered: 'Mark as Delivered',
    },
    placeholders: {
      search: 'Search by order number, customer name, or email...',
    },
    messages: {},
    tableHeaders: {
      orderId: 'Order ID',
      customer: 'Customer',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      action: 'Action',
    },
    statusLabels: {
      all: 'All Status',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    emptyStates: {
      noOrders: 'No orders found',
      noOrdersSubtitle: 'Try adjusting your search or filters',
    },
  },
  statusConfig: {
    pending: {
      label: 'Pending',
      icon: 'HiClock',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    processing: {
      label: 'Processing',
      icon: 'HiClock',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    shipped: {
      label: 'Shipped',
      icon: 'HiTruck',
      bg: 'bg-purple-100',
      text: 'text-purple-800',
    },
    delivered: {
      label: 'Delivered',
      icon: 'HiCheck',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    cancelled: {
      label: 'Cancelled',
      icon: 'HiX',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
  },
  statusFlow: [
    {
      from: 'pending',
      to: 'processing',
      actionLabel: 'Mark as Processing',
      icon: 'HiClock',
    },
    {
      from: 'processing',
      to: 'shipped',
      actionLabel: 'Mark as Shipped',
      icon: 'HiTruck',
    },
    {
      from: 'shipped',
      to: 'delivered',
      actionLabel: 'Mark as Delivered',
      icon: 'HiCheck',
    },
    {
      from: 'delivered',
      to: null,
      actionLabel: '',
      icon: '',
    },
    {
      from: 'cancelled',
      to: null,
      actionLabel: '',
      icon: '',
    },
  ],
  stats: {
    labels: {
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      pending: 'Pending',
      shipped: 'Shipped',
      delivered: 'Delivered',
    },
    icons: {
      totalOrders: 'HiCollection',
      totalRevenue: 'HiCurrencyDollar',
      pending: 'HiClock',
      shipped: 'HiTruck',
      delivered: 'HiCheck',
    },
    gradients: {
      totalOrders: { from: '#0066cc', via: '#e6f2ff', to: '#f0f7ff' },
      totalRevenue: { from: 'emerald-200', via: 'green-100', to: 'emerald-50' },
      pending: { from: 'yellow-200', via: 'yellow-100', to: 'yellow-50' },
      shipped: { from: 'purple-200', via: 'purple-100', to: 'purple-50' },
      delivered: { from: 'emerald-200', via: 'green-100', to: 'emerald-50' },
    },
    iconGradients: {
      totalOrders: { from: 'var(--ds-primary)', to: 'var(--ds-accent)' },
      totalRevenue: { from: 'green-500', to: 'green-600' },
      pending: { from: 'yellow-500', to: 'yellow-600' },
      shipped: { from: 'purple-500', to: 'purple-600' },
      delivered: { from: 'green-500', to: 'green-600' },
    },
  },
};

export const ANALYTICS_CONFIG: AnalyticsConfig = {
  metadata: {
    seo: {
      title: 'Analytics — Scentiment Seller',
      description: 'View your store performance and analytics',
      canonicalPath: '/seller/analytics',
    },
    header: {
      title: 'Analytics',
      subtitle: 'Track your store performance and insights',
      backButton: {
        label: 'Back to Dashboard',
        path: '/seller/dashboard',
      },
    },
  },
  ui: {
    labels: {
      analytics: 'Analytics',
      subtitle: 'Track your store performance and insights',
      totalRevenue: 'Total Revenue',
      totalOrders: 'Total Orders',
      productsSold: 'Products Sold', // Deprecated, use totalProducts
      totalProducts: 'Total Products',
      totalCustomers: 'Total Customers',
      vsPreviousPeriod: 'vs previous period',
      newCustomers: 'new customers',
      revenueTrend: 'Revenue Trend',
      ordersTrend: 'Orders Trend',
      topProducts: 'Top Performing Products',
      categories: 'Category Performance',
      orders: 'orders',
      ofRevenue: 'of revenue',
    },
    buttons: {},
    placeholders: {},
    messages: {},
  },
  timePeriods: [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ],
  metrics: [
    {
      id: 'revenue',
      label: 'Total Revenue',
      icon: 'HiCurrencyDollar',
      gradient: {
        from: '#0066cc',
        via: '#e6f2ff',
        to: '#f0f7ff',
      },
      iconGradient: {
        from: 'blue-500',
        to: 'blue-600',
      },
    },
    {
      id: 'orders',
      label: 'Total Orders',
      icon: 'HiShoppingCart',
      gradient: {
        from: 'purple-200',
        via: 'purple-100',
        to: 'purple-50',
      },
      iconGradient: {
        from: 'purple-500',
        to: 'purple-600',
      },
    },
    {
      id: 'products',
      label: 'Products Sold',
      icon: 'HiCollection',
      gradient: {
        from: 'emerald-200',
        via: 'green-100',
        to: 'emerald-50',
      },
      iconGradient: {
        from: 'green-500',
        to: 'green-600',
      },
    },
    {
      id: 'customers',
      label: 'Total Customers',
      icon: 'HiUsers',
      gradient: {
        from: 'orange-200',
        via: 'orange-100',
        to: 'orange-50',
      },
      iconGradient: {
        from: 'orange-500',
        to: 'orange-600',
      },
    },
  ],
  chartLabels: {
    revenue: 'Revenue Trend',
    orders: 'Orders Trend',
  },
  sectionLabels: {
    topProducts: 'Top Performing Products',
    categories: 'Category Performance',
  },
};

export const INVENTORY_CONFIG: InventoryConfig = {
  metadata: {
    seo: {
      title: 'Inventory Management — Scentiment Seller',
      description: 'Manage your product inventory and stock levels',
      canonicalPath: '/seller/inventory',
    },
    header: {
      title: 'Inventory Management',
      subtitle: 'Manage stock levels and product availability',
      backButton: {
        label: 'Back to Dashboard',
        path: '/seller/dashboard',
      },
    },
  },
  ui: {
    labels: {
      inventory: 'Inventory Management',
      subtitle: 'Manage stock levels and product availability',
      addProduct: 'Add Product',
      totalProducts: 'Total Products',
      totalStock: 'Total Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      inventoryValue: 'Inventory Value',
      product: 'Product',
      sku: 'SKU',
      category: 'Category',
      stock: 'Stock',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
      sold: 'sold',
      min: 'min',
      decreaseStock: 'Decrease stock',
      editStock: 'Edit stock',
      increaseStock: 'Increase stock',
      viewProduct: 'View product',
      deleteProduct: 'Delete product',
    },
    buttons: {
      addProduct: 'Add Product',
    },
    placeholders: {
      search: 'Search by name or SKU...',
    },
    messages: {
      noProducts: 'No products found matching your filters.',
    },
    tableHeaders: {
      product: 'Product',
      sku: 'SKU',
      category: 'Category',
      stock: 'Stock',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
    },
    statusLabels: {
      all: 'All Status',
      active: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    },
    emptyStates: {
      noProducts: 'No products found matching your filters.',
    },
  },
  categories: ['All Categories', 'Candles', 'Diffuser Oils', 'Room Sprays', 'Diffusers', 'Perfumes'],
  statusConfig: {
    out_of_stock: {
      label: 'Out of Stock',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
    low_stock: {
      label: 'Low Stock',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    active: {
      label: 'In Stock',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
  },
  stats: {
    labels: {
      totalProducts: 'Total Products',
      totalStock: 'Total Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      inventoryValue: 'Inventory Value',
    },
    icons: {
      totalProducts: 'HiCollection',
      totalStock: 'HiCube',
      lowStock: 'HiExclamationCircle',
      outOfStock: 'HiX',
      inventoryValue: 'HiTrendingUp',
    },
    gradients: {
      totalProducts: { from: '#0066cc', via: '#e6f2ff', to: '#f0f7ff' },
      totalStock: { from: 'blue-200', via: 'blue-100', to: 'blue-50' },
      lowStock: { from: 'yellow-200', via: 'yellow-100', to: 'yellow-50' },
      outOfStock: { from: 'red-200', via: 'rose-100', to: 'red-50' },
      inventoryValue: { from: 'emerald-200', via: 'green-100', to: 'emerald-50' },
    },
    iconGradients: {
      totalProducts: { from: 'var(--ds-primary)', to: 'var(--ds-accent)' },
      totalStock: { from: 'blue-500', to: 'blue-600' },
      lowStock: { from: 'yellow-500', to: 'yellow-600' },
      outOfStock: { from: 'red-500', to: 'red-600' },
      inventoryValue: { from: 'green-500', to: 'green-600' },
    },
  },
};
