import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RedisModule } from '../redis/redis.module';
import { ShopifyModule } from '../shopify/shopify.module';

/**
 * Orders Module
 * 
 * Uses Shopify Admin API as the source of truth for all order operations.
 * Order schema is kept for type definitions and optional logging purposes only.
 */
@Module({
  imports: [
    RedisModule,
    ShopifyModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
