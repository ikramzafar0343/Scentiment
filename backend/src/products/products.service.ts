import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { ShopifyAdminProductService } from '../shopify/shopify.admin.product.service';

/**
 * Products Service
 * 
 * Customer-facing product operations only.
 * Product management (create, update, delete) is handled via Shopify Admin Store.
 */
@Injectable()
export class ProductsService {
  constructor(
    private readonly shopifyProductService: ShopifyAdminProductService,
  ) {}

  /**
   * Get all products for customers
   * Shopify Admin API is the source of truth
   */
  async findAll(page = 1, limit = 20, includeAllStatuses = false): Promise<Product[]> {
    // Shopify Admin API is the source of truth - no need for status filtering
    // All products from Shopify are returned (Shopify handles visibility)
    return this.shopifyProductService.findAll(page, limit);
  }

  /**
   * Get a single product by ID
   */
  async findOne(id: string): Promise<Product> {
    return this.shopifyProductService.findOne(id);
  }
}
