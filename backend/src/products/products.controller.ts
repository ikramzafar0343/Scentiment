import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

/**
 * Products Controller
 * 
 * Customer-facing product endpoints only.
 * Product management (create, update, delete) is handled via Shopify Admin Store.
 */
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page?: number, 
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    // Shopify Admin API is the source of truth - returns all products
    return this.productsService.findAll(page || 1, limit || 100, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiParam({ name: 'id', description: 'Shopify product GID' })
  @ApiResponse({ status: 200, description: 'Return the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
