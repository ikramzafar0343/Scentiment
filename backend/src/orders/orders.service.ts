import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { RedisService } from '../redis/redis.service';
import { ShopifyAdminOrderService } from '../shopify/shopify.admin.order.service';

/**
 * Orders Service
 * 
 * Uses Shopify Admin API as the source of truth for all order operations.
 * MongoDB is only used for logging/audit purposes if needed.
 */
@Injectable()
export class OrdersService {
  constructor(
    private readonly shopifyOrderService: ShopifyAdminOrderService,
    private redisService: RedisService,
  ) {}

  async create(userId: string, userEmail: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Create order in Shopify (source of truth)
    return this.shopifyOrderService.create(userId, userEmail, createOrderDto);
  }

  async findAll(page = 1, limit = 20, userId?: string, status?: string): Promise<Order[]> {
    // Get orders from Shopify (source of truth)
    return this.shopifyOrderService.findAll(page, limit, userId, status);
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    // Get order from Shopify (source of truth)
    return this.shopifyOrderService.findOne(id, userId);
  }

  async updateStatus(id: string, status: string, userId?: string): Promise<Order> {
    // Update order status in Shopify (source of truth)
    // Note: This method is kept for potential future use but order management
    // should be done via Shopify Admin Store
    return this.shopifyOrderService.updateStatus(id, status);
  }

  async getOrderStatistics(startDate?: Date, endDate?: Date) {
    // Get order statistics from Shopify (source of truth)
    return this.shopifyOrderService.getOrderStatistics(startDate, endDate);
  }
}
