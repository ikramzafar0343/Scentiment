/**
 * Seller Dashboard Configuration Schema
 * Defines the structure for all seller-related page configurations
 */

export interface SellerPageMetadata {
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
  };
  header: {
    title: string;
    subtitle?: string;
    backButton?: {
      label: string;
      path: string;
    };
  };
}

export interface SellerUIContent {
  labels: Record<string, string>;
  buttons: Record<string, string>;
  placeholders: Record<string, string>;
  messages: Record<string, string>;
  tableHeaders?: Record<string, string>;
  statusLabels?: Record<string, string>;
  emptyStates?: Record<string, string>;
}

// Dashboard-specific schemas
export interface DashboardActionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  iconGradient: {
    from: string;
    to: string;
  };
}

export interface DashboardMetric {
  id: string;
  label: string;
  icon: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  iconGradient: {
    from: string;
    to: string;
  };
}

export interface DashboardConfig {
  metadata: SellerPageMetadata;
  ui: SellerUIContent;
  welcome: {
    greeting: string;
    registrationLabel: string;
  };
  actionCards: DashboardActionCard[];
  metrics: DashboardMetric[];
  orderStatus: {
    labels: Record<string, string>;
    colors: Record<string, { bg: string; text: string }>;
  };
}

// Orders-specific schemas
export interface OrderStatusConfig {
  label: string;
  icon: string;
  bg: string;
  text: string;
}

export interface OrderStatusFlow {
  from: string;
  to: string | null;
  actionLabel: string;
  icon: string;
}

export interface OrdersConfig {
  metadata: SellerPageMetadata;
  ui: SellerUIContent;
  statusConfig: Record<string, OrderStatusConfig>;
  statusFlow: OrderStatusFlow[];
  stats: {
    labels: Record<string, string>;
    icons: Record<string, string>;
    gradients: Record<string, { from: string; via: string; to: string }>;
    iconGradients: Record<string, { from: string; to: string }>;
  };
}

// Analytics-specific schemas
export interface TimePeriodOption {
  value: string;
  label: string;
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  icon: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  iconGradient: {
    from: string;
    to: string;
  };
}

export interface AnalyticsConfig {
  metadata: SellerPageMetadata;
  ui: SellerUIContent;
  timePeriods: TimePeriodOption[];
  metrics: AnalyticsMetric[];
  chartLabels: {
    revenue: string;
    orders: string;
  };
  sectionLabels: {
    topProducts: string;
    categories: string;
  };
}

// Inventory-specific schemas
export interface InventoryStatusConfig {
  label: string;
  bg: string;
  text: string;
}

export interface InventoryConfig {
  metadata: SellerPageMetadata;
  ui: SellerUIContent;
  categories: string[];
  statusConfig: Record<string, InventoryStatusConfig>;
  stats: {
    labels: Record<string, string>;
    icons: Record<string, string>;
    gradients: Record<string, { from: string; via: string; to: string }>;
    iconGradients: Record<string, { from: string; to: string }>;
  };
}
