import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProductsService {
  private ordersService: any;

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private redisService: RedisService,
  ) {}

  // Set orders service after module initialization to avoid circular dependency
  setOrdersService(ordersService: any) {
    this.ordersService = ordersService;
  }

  async findAll(page = 1, limit = 20, includeAllStatuses = false): Promise<Product[]> {
    const cacheKey = includeAllStatuses 
      ? `products:all:${page}:${limit}:all` 
      : `products:all:${page}:${limit}`;
    const cached = await this.redisService.get<Product[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;
    
    // If includeAllStatuses is true (for authenticated sellers), return all products except rejected
    // Otherwise, return only active/approved/pending products for public API
    const query = includeAllStatuses
      ? {
          status: { $ne: 'rejected' }, // Exclude only rejected products
        }
      : {
          $or: [
            { status: 'active' },
            { status: 'approved' },
            { status: 'pending' },
            { status: { $exists: false } }, // Backward compatibility
          ]
        };
    
    const products = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    await this.redisService.set(cacheKey, products, 3600); // 1 hour cache
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const cacheKey = `product:${id}`;
    const cached = await this.redisService.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    await this.redisService.set(cacheKey, product, 3600);
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    const product = await createdProduct.save();
    
    // Invalidate cache
    await this.redisService.del('products:all');
    
    return product;
  }

  async seed(products: CreateProductDto[]): Promise<Product[]> {
    await this.productModel.deleteMany({});
    const result = await this.productModel.insertMany(products);
    
    // Invalidate cache
    await this.redisService.del('products:all');
    
    return result;
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductDto },
      { new: true, runValidators: true }
    ).exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Invalidate cache
    await this.redisService.del(`product:${id}`);
    await this.redisService.del('products:all');
    await this.redisService.del('dashboard:stats');

    return product;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Invalidate cache
    await this.redisService.del(`product:${id}`);
    await this.redisService.del('products:all');
    await this.redisService.del('dashboard:stats');

    return { message: `Product #${id} has been deleted` };
  }

  async getDashboardStats() {
    const cacheKey = 'dashboard:stats';
    const cached = await this.redisService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const now = new Date();
    const startThisPeriod = new Date(now);
    startThisPeriod.setDate(startThisPeriod.getDate() - 30);
    const startPrevPeriod = new Date(now);
    startPrevPeriod.setDate(startPrevPeriod.getDate() - 60);

    // Get order statistics for the last 30 days and previous 30 days
    let orderStats: any = null;
    try {
      if (this.ordersService) {
        orderStats = await this.ordersService.getOrderStatistics(startThisPeriod, now);
        const prevOrderStats = await this.ordersService.getOrderStatistics(startPrevPeriod, startThisPeriod);
        
        // Calculate changes
        const revenueChange = prevOrderStats.totalRevenue > 0
          ? ((orderStats.totalRevenue - prevOrderStats.totalRevenue) / prevOrderStats.totalRevenue) * 100
          : (orderStats.totalRevenue > 0 ? 100 : 0);
        
        const ordersChange = prevOrderStats.totalOrders > 0
          ? ((orderStats.totalOrders - prevOrderStats.totalOrders) / prevOrderStats.totalOrders) * 100
          : (orderStats.totalOrders > 0 ? 100 : 0);

        orderStats.revenueChange = `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`;
        orderStats.ordersChange = `${ordersChange >= 0 ? '+' : ''}${ordersChange.toFixed(1)}`;
      }
    } catch (error) {
      console.warn('Failed to fetch order stats:', error);
    }

    // Get all products to calculate active listings (in stock, not low stock)
    // Active listings = products with:
    // - stock > 0 (has stock)
    // - stock > minStock (not low stock, minStock defaults to 10)
    // - status is 'active' (published products)
    const allProducts = await this.productModel.find().exec();
    const DEFAULT_MIN_STOCK = 10;
    
    const activeListingsThisPeriod = allProducts.filter(p => {
      const stock = p.stock ?? 0;
      const minStock = DEFAULT_MIN_STOCK; // Use default minStock of 10
      const isInStock = stock > 0;
      const isNotLowStock = stock > minStock;
      const isActive = p.status === 'active' || p.status === 'approved' || (!p.status && stock > 0);
      return isInStock && isNotLowStock && isActive;
    }).length;

    // Get products from previous period to calculate change
    // For comparison, we'll use the same logic but on products that existed before this period
    const productsCreatedBeforeThisPeriod = await this.productModel.find({
      createdAt: { $lt: startThisPeriod }
    }).exec();
    
    const activeListingsPrevPeriod = productsCreatedBeforeThisPeriod.filter(p => {
      const stock = p.stock ?? 0;
      const minStock = DEFAULT_MIN_STOCK;
      const isInStock = stock > 0;
      const isNotLowStock = stock > minStock;
      const isActive = p.status === 'active' || p.status === 'approved' || (!p.status && stock > 0);
      return isInStock && isNotLowStock && isActive;
    }).length;

    const activeListingsDelta = activeListingsThisPeriod - activeListingsPrevPeriod;
    const activeListingsChange = `${activeListingsDelta >= 0 ? '+' : ''}${activeListingsDelta}`;

    const [
      totalProducts,
      recentProducts,
      createdThisPeriod,
      createdPrevPeriod,
    ] = await Promise.all([
      this.productModel.countDocuments(),
      this.productModel.find().sort({ createdAt: -1 }).limit(5).exec(),
      this.productModel.countDocuments({ createdAt: { $gte: startThisPeriod } }),
      this.productModel.countDocuments({ createdAt: { $gte: startPrevPeriod, $lt: startThisPeriod } }),
    ]);

    const createdDelta = createdThisPeriod - createdPrevPeriod;
    const createdDeltaLabel = `${createdDelta >= 0 ? '+' : ''}${createdDelta}`;

    // Use real order data if available, otherwise use placeholders
    const stats = {
      totalSales: orderStats?.totalRevenue || 0,
      totalSalesChange: orderStats?.revenueChange || '+0%',
      activeListings: activeListingsThisPeriod,
      activeListingsChange: activeListingsChange,
      monthlyRevenue: orderStats?.totalRevenue || 0,
      monthlyRevenueChange: orderStats?.revenueChange || '+0%',
      totalProducts,
      totalProductsChange: createdDeltaLabel,
      pendingOrders: orderStats?.pendingOrders || 0,
      pendingOrdersChange: orderStats?.pendingOrders ? `+${orderStats.pendingOrders}` : '+0',
      recentProducts: recentProducts.map(p => {
        const productDoc = p as any; // Mongoose adds timestamps automatically
        const createdAt = productDoc.createdAt || productDoc.created_at || new Date();
        return {
          id: p._id.toString(),
          name: p.name,
          status: p.status || 'draft',
          date: new Date(createdAt).toISOString().split('T')[0],
        };
      }),
    };

    await this.redisService.set(cacheKey, stats, 300); // 5 minute cache
    return stats;
  }
}
