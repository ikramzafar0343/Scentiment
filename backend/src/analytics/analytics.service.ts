import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { RedisService } from '../redis/redis.service';

type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private redisService: RedisService,
  ) {}

  private getDateRange(period: TimePeriod): { start: Date; end: Date; previousStart: Date; previousEnd: Date } {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    let start: Date;
    let previousStart: Date;
    let previousEnd: Date;

    switch (period) {
      case 'today':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd = new Date(start);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - 7);
        previousEnd = new Date(start);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        previousStart = new Date(start);
        previousStart.setMonth(previousStart.getMonth() - 1);
        previousEnd = new Date(start);
        break;
      case 'quarter':
        start = new Date(now);
        start.setMonth(start.getMonth() - 3);
        start.setHours(0, 0, 0, 0);
        previousStart = new Date(start);
        previousStart.setMonth(previousStart.getMonth() - 3);
        previousEnd = new Date(start);
        break;
      case 'year':
        start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
        previousStart = new Date(start);
        previousStart.setFullYear(previousStart.getFullYear() - 1);
        previousEnd = new Date(start);
        break;
      default: // 'all'
        start = new Date(0);
        previousStart = new Date(0);
        previousEnd = new Date(0);
    }

    return { start, end, previousStart, previousEnd };
  }

  private getChartDataPoints(period: TimePeriod): number {
    switch (period) {
      case 'today':
        return 24; // hourly
      case 'week':
        return 7; // daily
      case 'month':
        return 30; // daily
      case 'quarter':
        return 12; // weekly
      case 'year':
        return 12; // monthly
      default:
        return 12; // monthly
    }
  }

  async getAnalytics(period: TimePeriod = 'month') {
    // Validate period
    const validPeriods: TimePeriod[] = ['today', 'week', 'month', 'quarter', 'year', 'all'];
    const validPeriod = validPeriods.includes(period) ? period : 'month';
    
    const cacheKey = `analytics:${validPeriod}`;
    const cached = await this.redisService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const { start, end, previousStart, previousEnd } = this.getDateRange(validPeriod);
    const dataPoints = this.getChartDataPoints(validPeriod);

    // Build date query
    const dateQuery: any = {};
    if (validPeriod !== 'all') {
      dateQuery.createdAt = { $gte: start, $lte: end };
    }

    const previousDateQuery: any = {};
    if (validPeriod !== 'all') {
      previousDateQuery.createdAt = { $gte: previousStart, $lt: previousEnd };
    }

    // Get orders for current period
    const orders = await this.orderModel
      .find({ ...dateQuery, status: { $ne: 'cancelled' } })
      .sort({ createdAt: 1 })
      .exec();

    // Get orders for previous period
    const previousOrders = await this.orderModel
      .find({ ...previousDateQuery, status: { $ne: 'cancelled' } })
      .exec();

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const revenueChange = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : (totalRevenue > 0 ? 100 : 0);

    // Calculate orders
    const totalOrders = orders.length;
    const previousOrdersCount = previousOrders.length;
    const ordersChange = previousOrdersCount > 0
      ? ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100
      : (totalOrders > 0 ? 100 : 0);

    // Generate chart data
    const revenueChart = this.generateChartData(orders, 'revenue', dataPoints, start, end, validPeriod);
    const ordersChart = this.generateChartData(orders, 'orders', dataPoints, start, end, validPeriod);

    // Get products statistics - total products in inventory
    const totalProducts = await this.productModel.countDocuments();
    const previousTotalProducts = await this.productModel.countDocuments({
      createdAt: { $lt: previousEnd }
    });

    const productsChange = previousTotalProducts > 0
      ? ((totalProducts - previousTotalProducts) / previousTotalProducts) * 100
      : (totalProducts > 0 ? 100 : 0);
    
    // Also calculate products sold for reference
    const productsSold = orders.reduce((sum, order) => {
      return sum + (order.items?.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0) || 0);
    }, 0);

    // Get unique customers
    const uniqueCustomers = new Set(orders.map(o => o.userId || o.userEmail)).size;
    const previousUniqueCustomers = new Set(previousOrders.map(o => o.userId || o.userEmail)).size;
    const newCustomers = orders.filter((order, index, self) => {
      const userId = order.userId || order.userEmail;
      return !previousOrders.some(prev => (prev.userId || prev.userEmail) === userId) &&
             index === self.findIndex(o => (o.userId || o.userEmail) === userId);
    }).length;

    const customersChange = previousUniqueCustomers > 0
      ? ((uniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100
      : (uniqueCustomers > 0 ? 100 : 0);

    // Get top products
    const productSalesMap = new Map<string, { name: string; sales: number; revenue: number; orders: number }>();
    
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        const productId = item.productId || item.id;
        const existing = productSalesMap.get(productId) || { name: item.productName || item.name || 'Unknown', sales: 0, revenue: 0, orders: 0 };
        existing.sales += item.quantity || 0;
        existing.revenue += (item.price || 0) * (item.quantity || 0);
        existing.orders += 1;
        productSalesMap.set(productId, existing);
      });
    });

    const previousProductSalesMap = new Map<string, { sales: number }>();
    previousOrders.forEach(order => {
      order.items?.forEach((item: any) => {
        const productId = item.productId || item.id;
        const existing = previousProductSalesMap.get(productId) || { sales: 0 };
        existing.sales += item.quantity || 0;
        previousProductSalesMap.set(productId, existing);
      });
    });

    const topProducts = Array.from(productSalesMap.entries())
      .map(([id, data]) => {
        const previous = previousProductSalesMap.get(id) || { sales: 0 };
        const change = previous.sales > 0
          ? ((data.sales - previous.sales) / previous.sales) * 100
          : (data.sales > 0 ? 100 : 0);
        return {
          id,
          name: data.name,
          sales: data.sales,
          revenue: data.revenue,
          orders: data.orders,
          change,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get category performance - need to fetch products to get categories
    const productIds = new Set<string>();
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        if (item.productId) productIds.add(item.productId);
      });
    });

    const products = await this.productModel.find({ _id: { $in: Array.from(productIds) } }).exec();
    const productCategoryMap = new Map<string, string>();
    products.forEach(product => {
      productCategoryMap.set(product._id.toString(), product.category || 'Uncategorized');
    });

    const categoryMap = new Map<string, { revenue: number; orders: number }>();
    
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        const productId = item.productId || item.id;
        const category = productCategoryMap.get(productId) || item.category || 'Uncategorized';
        const existing = categoryMap.get(category) || { revenue: 0, orders: 0 };
        existing.revenue += (item.price || 0) * (item.quantity || 0);
        existing.orders += 1;
        categoryMap.set(category, existing);
      });
    });

    const totalCategoryRevenue = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.revenue, 0);
    const categories = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        orders: data.orders,
        percentage: totalCategoryRevenue > 0 ? (data.revenue / totalCategoryRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const result = {
      revenue: {
        total: totalRevenue,
        change: revenueChange,
        chart: revenueChart,
      },
      orders: {
        total: totalOrders,
        change: ordersChange,
        chart: ordersChart,
      },
      products: {
        total: totalProducts,
        sold: productsSold,
        change: productsChange,
      },
      customers: {
        total: uniqueCustomers,
        new: newCustomers,
        change: customersChange,
      },
      topProducts,
      categories,
    };

    await this.redisService.set(cacheKey, result, 300); // 5 minute cache
    return result;
  }

  // Helper method to ensure we always return valid data structure
  private getEmptyAnalyticsData() {
    return {
      revenue: {
        total: 0,
        change: 0,
        chart: [],
      },
      orders: {
        total: 0,
        change: 0,
        chart: [],
      },
      products: {
        total: 0,
        sold: 0,
        change: 0,
      },
      customers: {
        total: 0,
        new: 0,
        change: 0,
      },
      topProducts: [],
      categories: [],
    };
  }

  private generateChartData(
    orders: Order[],
    type: 'revenue' | 'orders',
    dataPoints: number,
    start: Date,
    end: Date,
    period: TimePeriod,
  ): Array<{ date: string; value: number }> {
    const chart: Array<{ date: string; value: number }> = [];
    const interval = (end.getTime() - start.getTime()) / dataPoints;

    for (let i = 0; i < dataPoints; i++) {
      const pointStart = new Date(start.getTime() + i * interval);
      const pointEnd = new Date(start.getTime() + (i + 1) * interval);

      const pointOrders = orders.filter(order => {
        const orderDoc = order as OrderDocument & { createdAt?: Date };
        const orderDate = new Date(orderDoc.createdAt || new Date());
        return orderDate >= pointStart && orderDate < pointEnd;
      });

      let value = 0;
      if (type === 'revenue') {
        value = pointOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      } else {
        value = pointOrders.length;
      }

      // Format date based on period
      let dateLabel = '';
      if (period === 'today') {
        dateLabel = pointStart.getHours().toString();
      } else if (period === 'week' || period === 'month') {
        dateLabel = pointStart.getDate().toString();
      } else if (period === 'quarter' || period === 'year' || period === 'all') {
        dateLabel = `${pointStart.getMonth() + 1}/${pointStart.getDate()}`;
      }

      chart.push({ date: dateLabel, value });
    }

    return chart;
  }
}
