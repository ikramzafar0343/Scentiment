import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private redisService: RedisService,
  ) {}

  async create(userId: string, userEmail: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel({
      ...createOrderDto,
      userId,
      userEmail,
      status: createOrderDto.status || 'pending',
    });
    
    const savedOrder = await order.save();
    
    // Invalidate dashboard cache
    await this.redisService.del('dashboard:stats');
    
    return savedOrder;
  }

  async findAll(page = 1, limit = 20, userId?: string, status?: string): Promise<Order[]> {
    const cacheKey = `orders:all:${page}:${limit}:${userId || 'all'}:${status || 'all'}`;
    const cached = await this.redisService.get<Order[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (status) {
      query.status = status;
    }

    const orders = await this.orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    await this.redisService.set(cacheKey, orders, 300); // 5 minute cache
    return orders;
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const query: any = { _id: id };
    if (userId) {
      query.userId = userId;
    }

    const order = await this.orderModel.findOne(query).exec();
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async updateStatus(id: string, status: string, userId?: string): Promise<Order> {
    const query: any = { _id: id };
    if (userId) {
      query.userId = userId;
    }

    const order = await this.orderModel.findOneAndUpdate(
      query,
      { status },
      { new: true }
    ).exec();

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Invalidate dashboard cache
    await this.redisService.del('dashboard:stats');

    return order;
  }

  async getOrderStatistics(startDate?: Date, endDate?: Date) {
    const cacheKey = `orders:stats:${startDate?.toISOString() || 'all'}:${endDate?.toISOString() || 'all'}`;
    const cached = await this.redisService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const dateQuery: any = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = startDate;
      if (endDate) dateQuery.createdAt.$lte = endDate;
    }

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      orders,
    ] = await Promise.all([
      this.orderModel.countDocuments({ ...dateQuery }),
      this.orderModel.countDocuments({ ...dateQuery, status: 'pending' }),
      this.orderModel.countDocuments({ ...dateQuery, status: 'processing' }),
      this.orderModel.countDocuments({ ...dateQuery, status: 'shipped' }),
      this.orderModel.countDocuments({ ...dateQuery, status: 'delivered' }),
      this.orderModel.countDocuments({ ...dateQuery, status: 'cancelled' }),
      this.orderModel.aggregate([
        { $match: { ...dateQuery, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      this.orderModel.find({ ...dateQuery, status: { $ne: 'cancelled' } }).exec(),
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    // Calculate previous period for comparison
    let previousPeriodRevenue = 0;
    let previousPeriodOrders = 0;
    
    if (startDate && endDate) {
      const periodLength = endDate.getTime() - startDate.getTime();
      const prevStartDate = new Date(startDate.getTime() - periodLength);
      const prevEndDate = new Date(startDate);

      const [prevRevenue, prevOrders] = await Promise.all([
        this.orderModel.aggregate([
          { $match: { createdAt: { $gte: prevStartDate, $lt: prevEndDate }, status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        this.orderModel.countDocuments({ createdAt: { $gte: prevStartDate, $lt: prevEndDate } }),
      ]);

      previousPeriodRevenue = prevRevenue[0]?.total || 0;
      previousPeriodOrders = prevOrders;
    }

    const revenueChange = previousPeriodRevenue > 0
      ? ((revenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
      : (revenue > 0 ? 100 : 0);

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
      totalRevenue: revenue,
      revenueChange: revenueChange.toFixed(1),
      ordersChange: ordersChange.toFixed(1),
      averageOrderValue: totalOrders > 0 ? revenue / totalOrders : 0,
    };

    await this.redisService.set(cacheKey, stats, 300); // 5 minute cache
    return stats;
  }
}
