import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { RedisModule } from '../redis/redis.module';
import { OrdersModule } from '../orders/orders.module';
import { OrdersService } from '../orders/orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    RedisModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'PRODUCTS_SERVICE_INIT',
      useFactory: (productsService: ProductsService, ordersService: OrdersService) => {
        productsService.setOrdersService(ordersService);
        return true;
      },
      inject: [ProductsService, OrdersService],
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
