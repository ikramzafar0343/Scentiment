import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ShopifyModule } from '../shopify/shopify.module';

/**
 * Products Module
 * 
 * Customer-facing product operations only.
 * Product management is handled via Shopify Admin Store.
 */
@Module({
  imports: [
    ShopifyModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
