import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ShopifyAdminClient } from './shopify.admin.client';
import { RedisService } from '../redis/redis.service';
import { ShopifyConfig } from './shopify.config';
import { ShopifyNotFoundError, ShopifyApiError } from './shopify.errors';
import type { ShopifyAdminOrder } from './shopify.types';
import type { Order } from '../orders/schemas/order.schema';

/**
 * Shopify Admin Order Service
 * 
 * Handles all order operations using Shopify Admin API as the source of truth.
 * Maps Shopify orders to our internal Order schema for backward compatibility.
 */
@Injectable()
export class ShopifyAdminOrderService {
  private readonly logger = new Logger(ShopifyAdminOrderService.name);

  // Reusable GraphQL fragment for order fields
  private readonly ORDER_FIELDS = `
    id
    name
    email
    createdAt
    updatedAt
    totalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    subtotalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    totalShippingPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    totalTaxSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    financialStatus
    fulfillmentStatus
    shippingAddress {
      name
      address1
      city
      province
      zip
      country
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          title
          quantity
          originalUnitPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          variant {
            id
            title
            product {
              id
              title
            }
          }
        }
      }
    }
  `;

  constructor(
    private readonly adminClient: ShopifyAdminClient,
    private readonly cache: RedisService,
    private readonly shopifyConfig: ShopifyConfig,
  ) {}

  /**
   * Map Shopify Admin order to our Order schema
   * Maintains exact same structure as MongoDB Order for backward compatibility
   */
  private mapShopifyToOrder(shopifyOrder: ShopifyAdminOrder, userId?: string, userEmail?: string): Order {
    const totalPrice = parseFloat(shopifyOrder.totalPriceSet.shopMoney.amount);
    
    // Extract subtotal, shipping, and tax from Shopify order
    // Use optional chaining for type safety
    const subtotalPrice = shopifyOrder.subtotalPriceSet?.shopMoney?.amount 
      ? parseFloat(shopifyOrder.subtotalPriceSet.shopMoney.amount)
      : 0;
    const shippingPrice = shopifyOrder.totalShippingPriceSet?.shopMoney?.amount
      ? parseFloat(shopifyOrder.totalShippingPriceSet.shopMoney.amount)
      : 0;
    const taxPrice = shopifyOrder.totalTaxSet?.shopMoney?.amount
      ? parseFloat(shopifyOrder.totalTaxSet.shopMoney.amount)
      : 0;

    // Map Shopify financial status to our status
    const statusMap: Record<string, string> = {
      'PENDING': 'pending',
      'AUTHORIZED': 'processing',
      'PAID': 'processing',
      'PARTIALLY_PAID': 'processing',
      'REFUNDED': 'cancelled',
      'VOIDED': 'cancelled',
      'PARTIALLY_REFUNDED': 'processing',
    };

    const fulfillmentStatusMap: Record<string, string> = {
      'FULFILLED': 'delivered',
      'PARTIAL': 'shipped',
      'RESTOCKED': 'cancelled',
      'UNFULFILLED': 'pending',
    };

    let status = statusMap[shopifyOrder.financialStatus] || 'pending';
    if (shopifyOrder.fulfillmentStatus) {
      status = fulfillmentStatusMap[shopifyOrder.fulfillmentStatus] || status;
    }

    // Map line items - maintain exact same structure
    const items = shopifyOrder.lineItems.edges.map(edge => {
      const node = edge.node;
      const price = parseFloat(node.originalUnitPriceSet.shopMoney.amount);
      return {
        productId: node.variant?.product?.id || node.id,
        productName: node.title,
        price,
        quantity: node.quantity,
        image: undefined, // Shopify doesn't provide image in order line items
      };
    });

    // Use Shopify values if available, otherwise calculate
    const subtotal = subtotalPrice > 0 ? subtotalPrice : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = shippingPrice;
    const tax = taxPrice > 0 ? taxPrice : Math.max(0, totalPrice - subtotal - shipping);

    // Extract shipping address if available
    const shippingAddr = shopifyOrder.shippingAddress;

    return {
      _id: shopifyOrder.id,
      userId: userId || '',
      userEmail: userEmail || shopifyOrder.email || '',
      items,
      subtotal,
      shipping,
      tax,
      total: totalPrice,
      status,
      shippingName: shippingAddr?.name,
      shippingAddress: shippingAddr?.address1,
      shippingCity: shippingAddr?.city,
      shippingState: shippingAddr?.province,
      shippingZip: shippingAddr?.zip,
      shippingCountry: shippingAddr?.country,
      notes: undefined,
      createdAt: new Date(shopifyOrder.createdAt),
      updatedAt: new Date(shopifyOrder.updatedAt),
    } as Order;
  }

  /**
   * Get all orders from Shopify Admin API
   */
  async findAll(page = 1, limit = 20, userId?: string, status?: string): Promise<Order[]> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      this.logger.warn('Shopify Admin API not configured, returning empty array');
      return [];
    }

    const cacheKey = `shopify:orders:all:${page}:${limit}:${userId || 'all'}:${status || 'all'}`;
    const cached = await this.cache.get<Order[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for orders page ${page}, limit ${limit}`);
      return cached;
    }

    try {
      this.logger.log(`Fetching orders from Shopify: page ${page}, limit ${limit}`);

      // Build query filters
      const queryFilters: string[] = [];
      if (status) {
        // Map our status to Shopify financial/fulfillment status
        const statusFilters: Record<string, string> = {
          'pending': 'financial_status:PENDING',
          'processing': 'financial_status:PAID OR fulfillment_status:UNFULFILLED',
          'shipped': 'fulfillment_status:PARTIAL',
          'delivered': 'fulfillment_status:FULFILLED',
          'cancelled': 'financial_status:VOIDED OR financial_status:REFUNDED',
        };
        if (statusFilters[status]) {
          queryFilters.push(statusFilters[status]);
        }
      }

      const query = `
        query GetOrders($first: Int!, $after: String, $query: String) {
          orders(first: $first, after: $after, query: $query) {
            edges {
              cursor
              node {
                ${this.ORDER_FIELDS}
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const fetchLimit = Math.min(limit * 2, 250); // Shopify max is 250
      const queryString = queryFilters.length > 0 ? queryFilters.join(' AND ') : undefined;

      const data = await this.adminClient.query<{
        orders: {
          edges: Array<{ cursor: string; node: ShopifyAdminOrder }>;
          pageInfo: { hasNextPage: boolean; endCursor?: string };
        };
      }>(query, {
        first: fetchLimit,
        query: queryString,
      });

      const skip = (page - 1) * limit;
      const orders = data.orders.edges
        .slice(skip, skip + limit)
        .map(edge => this.mapShopifyToOrder(edge.node));

      // Filter by userId if provided (this would require customer matching, simplified here)
      const filteredOrders = userId 
        ? orders.filter(o => o.userId === userId || o.userEmail.includes(userId))
        : orders;

      await this.cache.set(cacheKey, filteredOrders, 300); // 5 minute cache
      this.logger.log(`Successfully fetched ${filteredOrders.length} orders from Shopify`);
      return filteredOrders;
    } catch (error) {
      if (error instanceof ShopifyApiError || error instanceof ShopifyNotFoundError) {
        this.logger.error(`Failed to fetch orders from Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error fetching orders: ${error}`);
      throw new ShopifyApiError(`Failed to fetch orders: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a single order by ID
   */
  async findOne(id: string, userId?: string): Promise<Order> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyNotFoundError('Order', id);
    }

    const cacheKey = `shopify:order:${id}`;
    const cached = await this.cache.get<Order>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for order ${id}`);
      return cached;
    }

    try {
      this.logger.log(`Fetching order ${id} from Shopify`);

      const query = `
        query GetOrder($id: ID!) {
          order(id: $id) {
            ${this.ORDER_FIELDS}
          }
        }
      `;

      const data = await this.adminClient.query<{ order: ShopifyAdminOrder | null }>(
        query,
        { id },
      );

      if (!data.order) {
        this.logger.warn(`Order ${id} not found in Shopify`);
        throw new ShopifyNotFoundError('Order', id);
      }

      const order = this.mapShopifyToOrder(data.order, userId);
      await this.cache.set(cacheKey, order, 300);
      this.logger.log(`Successfully fetched order ${id} from Shopify`);
      return order;
    } catch (error) {
      if (error instanceof ShopifyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to fetch order ${id} from Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error fetching order ${id}: ${error}`);
      throw new ShopifyApiError(`Failed to fetch order: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create an order in Shopify (draft order)
   * Note: In Shopify, orders are typically created through checkout, but we can create draft orders
   */
  async create(userId: string, userEmail: string, createOrderDto: any): Promise<Order> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyApiError('Shopify Admin API is not configured');
    }

    try {
      this.logger.log(`Creating order for user ${userId} in Shopify`);

      // Create draft order in Shopify
      const mutation = `
        mutation DraftOrderCreate($input: DraftOrderInput!) {
          draftOrderCreate(input: $input) {
            draftOrder {
              id
              order {
                ${this.ORDER_FIELDS}
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Map items to Shopify line items
      const lineItems = createOrderDto.items.map((item: any) => ({
        variantId: item.productId, // Should be Shopify variant GID
        quantity: item.quantity,
        originalUnitPrice: item.price.toString(),
      }));

      const input = {
        email: userEmail,
        lineItems,
        note: createOrderDto.notes || `User ID: ${userId}`,
      };

      const data = await this.adminClient.query<{
        draftOrderCreate: {
          draftOrder: { order: ShopifyAdminOrder | null } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(mutation, { input });

      if (data.draftOrderCreate.userErrors.length > 0) {
        throw new ShopifyApiError(
          `Shopify error: ${data.draftOrderCreate.userErrors.map(e => e.message).join('; ')}`,
        );
      }

      if (!data.draftOrderCreate.draftOrder?.order) {
        throw new ShopifyApiError('Failed to create order in Shopify');
      }

      // Invalidate cache
      await this.cache.del('shopify:orders:all');

      const order = this.mapShopifyToOrder(data.draftOrderCreate.draftOrder.order, userId, userEmail);
      this.logger.log(`Successfully created order in Shopify`);
      return order;
    } catch (error) {
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to create order in Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error creating order: ${error}`);
      throw new ShopifyApiError(`Failed to create order: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update order status in Shopify
   */
  async updateStatus(id: string, status: string): Promise<Order> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyApiError('Shopify Admin API is not configured');
    }

    try {
      this.logger.log(`Updating order ${id} status to ${status} in Shopify`);

      // Map our status to Shopify actions
      // Note: Shopify doesn't have direct status updates, we use tags or fulfillments
      // For simplicity, we'll use order tags to track status
      const mutation = `
        mutation OrderUpdate($id: ID!, $input: OrderInput!) {
          orderUpdate(id: $id, input: $input) {
            order {
              ${this.ORDER_FIELDS}
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Get current order to preserve tags
      const currentOrder = await this.findOne(id);
      const existingTags = currentOrder.notes?.split(',') || [];
      const newTags = [...existingTags.filter(t => !t.startsWith('status:')), `status:${status}`];

      const data = await this.adminClient.query<{
        orderUpdate: {
          order: ShopifyAdminOrder | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(mutation, {
        id,
        input: {
          tags: newTags,
        },
      });

      if (data.orderUpdate.userErrors.length > 0) {
        throw new ShopifyApiError(
          `Shopify error: ${data.orderUpdate.userErrors.map(e => e.message).join('; ')}`,
        );
      }

      if (!data.orderUpdate.order) {
        throw new ShopifyNotFoundError('Order', id);
      }

      // Invalidate cache
      await this.cache.del(`shopify:order:${id}`);
      await this.cache.del('shopify:orders:all');

      const order = this.mapShopifyToOrder(data.orderUpdate.order);
      this.logger.log(`Successfully updated order ${id} status in Shopify`);
      return order;
    } catch (error) {
      if (error instanceof ShopifyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to update order ${id} status in Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error updating order ${id}: ${error}`);
      throw new ShopifyApiError(`Failed to update order: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get order statistics from Shopify
   */
  async getOrderStatistics(startDate?: Date, endDate?: Date) {
    if (!this.shopifyConfig.isAdminConfigured()) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        revenueChange: '0',
        ordersChange: '0',
        averageOrderValue: 0,
      };
    }

    const cacheKey = `shopify:orders:stats:${startDate?.toISOString() || 'all'}:${endDate?.toISOString() || 'all'}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Build date query
      let queryString = '';
      if (startDate || endDate) {
        const dateParts: string[] = [];
        if (startDate) {
          dateParts.push(`created_at:>='${startDate.toISOString()}'`);
        }
        if (endDate) {
          dateParts.push(`created_at:<='${endDate.toISOString()}'`);
        }
        queryString = dateParts.join(' AND ');
      }

      // Fetch all orders in the date range (may need pagination for large datasets)
      const orders = await this.findAll(1, 250, undefined, undefined);
      
      // Filter by date if needed (Shopify query should handle this, but double-check)
      const filteredOrders = orders.filter(order => {
        if (!startDate && !endDate) return true;
        const orderDate = new Date((order as any).createdAt || order.updatedAt);
        if (startDate && orderDate < startDate) return false;
        if (endDate && orderDate > endDate) return false;
        return true;
      });

      // Calculate statistics
      const totalOrders = filteredOrders.length;
      const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
      const processingOrders = filteredOrders.filter(o => o.status === 'processing').length;
      const shippedOrders = filteredOrders.filter(o => o.status === 'shipped').length;
      const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered').length;
      const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;
      const totalRevenue = filteredOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      // Calculate previous period for comparison
      let previousPeriodRevenue = 0;
      let previousPeriodOrders = 0;

      if (startDate && endDate) {
        const periodLength = endDate.getTime() - startDate.getTime();
        const prevStartDate = new Date(startDate.getTime() - periodLength);
        const prevEndDate = new Date(startDate);

        // Fetch previous period orders (simplified - would need separate query)
        const prevOrders = await this.findAll(1, 250, undefined, undefined);
        const filteredPrevOrders = prevOrders.filter(order => {
          const orderDate = new Date((order as any).createdAt || order.updatedAt);
          return orderDate >= prevStartDate && orderDate < prevEndDate;
        });

        previousPeriodRevenue = filteredPrevOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0);
        previousPeriodOrders = filteredPrevOrders.length;
      }

      const revenueChange = previousPeriodRevenue > 0
        ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : (totalRevenue > 0 ? 100 : 0);

      const ordersChange = previousPeriodOrders > 0
        ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100
        : (totalOrders > 0 ? 100 : 0);

      const stats = {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        revenueChange: revenueChange.toFixed(1),
        ordersChange: ordersChange.toFixed(1),
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      };

      await this.cache.set(cacheKey, stats, 300); // 5 minute cache
      return stats;
    } catch (error) {
      this.logger.error(`Failed to get order statistics: ${error}`);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        revenueChange: '0',
        ordersChange: '0',
        averageOrderValue: 0,
      };
    }
  }
}
