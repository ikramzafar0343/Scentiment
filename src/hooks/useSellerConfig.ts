/**
 * Hook for accessing Seller page configurations
 * Provides typed access to all seller page content
 */

import { useMemo } from 'react';
import {
  DASHBOARD_CONFIG,
  ORDERS_CONFIG,
  ANALYTICS_CONFIG,
  INVENTORY_CONFIG,
} from '@/configs/seller/seller.config';
import type {
  DashboardConfig,
  OrdersConfig,
  AnalyticsConfig,
  InventoryConfig,
} from '@/configs/seller/seller.schema';

type SellerPageKey = 'dashboard' | 'orders' | 'analytics' | 'inventory';

type SellerConfigMap = {
  dashboard: DashboardConfig;
  orders: OrdersConfig;
  analytics: AnalyticsConfig;
  inventory: InventoryConfig;
};

const CONFIG_MAP: SellerConfigMap = {
  dashboard: DASHBOARD_CONFIG,
  orders: ORDERS_CONFIG,
  analytics: ANALYTICS_CONFIG,
  inventory: INVENTORY_CONFIG,
};

export function useSellerConfig<T extends SellerPageKey>(key: T): SellerConfigMap[T] {
  return useMemo(() => {
    return CONFIG_MAP[key];
  }, [key]);
}
