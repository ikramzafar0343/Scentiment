import { Module, Global } from '@nestjs/common';
import { ShopifyConfig } from './shopify.config';
import { ShopifyAdminClient } from './shopify.admin.client';
import { ShopifyStorefrontClient } from './shopify.storefront.client';
import { ShopifyAdminProductService } from './shopify.admin.product.service';
import { ShopifyAdminOrderService } from './shopify.admin.order.service';
import { RedisModule } from '../redis/redis.module';

/**
 * Shopify Module
 * 
 * Provides Shopify Admin and Storefront API integration.
 * 
 * Required environment variables:
 * - SHOPIFY_SHOP_DOMAIN: Your Shopify shop domain (e.g., 'your-shop.myshopify.com')
 * - SHOPIFY_ADMIN_ACCESS_TOKEN: Admin API access token (for product management)
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN: Storefront API access token (for public catalog)
 * 
 * Optional environment variables:
 * - SHOPIFY_API_VERSION: API version (default: '2024-01')
 * - SHOPIFY_HTTP_TIMEOUT_MS: HTTP timeout in milliseconds (default: 8000)
 * - SHOPIFY_HTTP_RETRIES: Number of retry attempts (default: 2)
 * 
 * @note Tokens are never exposed to the frontend - all API calls are server-side only
 */
@Global()
@Module({
  imports: [RedisModule],
  providers: [
    ShopifyConfig,
    ShopifyAdminClient,
    ShopifyStorefrontClient,
    ShopifyAdminProductService,
    ShopifyAdminOrderService,
  ],
  exports: [
    ShopifyConfig,
    ShopifyAdminClient,
    ShopifyStorefrontClient,
    ShopifyAdminProductService,
    ShopifyAdminOrderService,
  ],
})
export class ShopifyModule {}
