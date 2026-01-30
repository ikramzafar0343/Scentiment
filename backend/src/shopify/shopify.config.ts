import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Shopify configuration service
 * Centralizes all Shopify-related configuration and validation
 */
@Injectable()
export class ShopifyConfig {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get Shopify shop domain (e.g., 'your-shop.myshopify.com')
   */
  getShopDomain(): string | undefined {
    return this.configService.get<string>('SHOPIFY_SHOP_DOMAIN');
  }

  /**
   * Get Shopify Admin API access token
   */
  getAdminAccessToken(): string | undefined {
    return this.configService.get<string>('SHOPIFY_ADMIN_ACCESS_TOKEN');
  }

  /**
   * Get Shopify Storefront API access token
   */
  getStorefrontAccessToken(): string | undefined {
    return this.configService.get<string>('SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  }

  /**
   * Get Shopify API version (defaults to latest stable)
   */
  getApiVersion(): string {
    return this.configService.get<string>('SHOPIFY_API_VERSION') || '2024-01';
  }

  /**
   * Get HTTP timeout in milliseconds
   */
  getHttpTimeout(): number {
    return Number(this.configService.get<string>('SHOPIFY_HTTP_TIMEOUT_MS') || '8000');
  }

  /**
   * Get number of retry attempts for failed requests
   */
  getHttpRetries(): number {
    return Number(this.configService.get<string>('SHOPIFY_HTTP_RETRIES') || '2');
  }

  /**
   * Check if Shopify Admin API is configured
   */
  isAdminConfigured(): boolean {
    return !!(this.getShopDomain() && this.getAdminAccessToken());
  }

  /**
   * Check if Shopify Storefront API is configured
   */
  isStorefrontConfigured(): boolean {
    return !!(this.getShopDomain() && this.getStorefrontAccessToken());
  }

  /**
   * Validate Shopify Admin configuration
   * @throws Error if configuration is invalid
   */
  validateAdminConfig(): void {
    if (!this.getShopDomain()) {
      throw new Error(
        'SHOPIFY_SHOP_DOMAIN is required. Set it in your environment variables.',
      );
    }
    if (!this.getAdminAccessToken()) {
      throw new Error(
        'SHOPIFY_ADMIN_ACCESS_TOKEN is required. Set it in your environment variables.',
      );
    }
  }

  /**
   * Validate Shopify Storefront configuration
   * @throws Error if configuration is invalid
   */
  validateStorefrontConfig(): void {
    if (!this.getShopDomain()) {
      throw new Error(
        'SHOPIFY_SHOP_DOMAIN is required. Set it in your environment variables.',
      );
    }
    if (!this.getStorefrontAccessToken()) {
      throw new Error(
        'SHOPIFY_STOREFRONT_ACCESS_TOKEN is required. Set it in your environment variables.',
      );
    }
  }
}
