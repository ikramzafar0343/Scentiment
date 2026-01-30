import { Injectable, Logger } from '@nestjs/common';
import { ShopifyConfig } from './shopify.config';
import { fetchJsonWithTimeout, withRetry } from './shopify.utils';
import {
  ShopifyConfigurationError,
  ShopifyApiError,
} from './shopify.errors';

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

@Injectable()
export class ShopifyStorefrontClient {
  private readonly logger = new Logger(ShopifyStorefrontClient.name);

  constructor(private readonly shopifyConfig: ShopifyConfig) {}

  /**
   * Execute a GraphQL query against Shopify Storefront API
   * @param query GraphQL query string
   * @param variables Query variables
   * @returns Promise resolving to the query response data
   * @throws ShopifyConfigurationError if Shopify is not configured
   * @throws ShopifyApiError if the API returns an error
   */
  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    // Validate configuration
    if (!this.shopifyConfig.isStorefrontConfigured()) {
      throw new ShopifyConfigurationError(
        'Shopify Storefront API is not configured. Please set SHOPIFY_SHOP_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.',
      );
    }

    const shopDomain = this.shopifyConfig.getShopDomain()!;
    const accessToken = this.shopifyConfig.getStorefrontAccessToken()!;
    const apiVersion = this.shopifyConfig.getApiVersion();
    const url = `https://${shopDomain}/api/${apiVersion}/graphql.json`;
    const timeoutMs = this.shopifyConfig.getHttpTimeout();
    const retries = this.shopifyConfig.getHttpRetries();

    this.logger.debug(`Executing Shopify Storefront API query: ${query.substring(0, 100)}...`);

    try {
      const json = await withRetry(
        () =>
          fetchJsonWithTimeout<GraphQlResponse<T>>(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': accessToken,
            },
            body: JSON.stringify({ query, variables: variables ?? {} }),
            timeoutMs,
          }),
        retries,
      );

      // Check for GraphQL errors
      if (json?.errors?.length) {
        const errorMessages = json.errors.map((e) => e.message).join('; ');
        this.logger.error(`Shopify Storefront API error: ${errorMessages}`);
        throw new ShopifyApiError(errorMessages);
      }

      if (!json?.data) {
        throw new ShopifyApiError('Shopify Storefront API returned empty response');
      }

      this.logger.debug('Shopify Storefront API query successful');
      return json.data;
    } catch (error) {
      if (error instanceof ShopifyConfigurationError || error instanceof ShopifyApiError) {
        throw error;
      }

      // Handle network/timeout errors
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('aborted')) {
          this.logger.error(`Shopify Storefront API timeout: ${error.message}`);
          throw new ShopifyApiError(`Request timeout: ${error.message}`);
        }
        if (error.message.includes('fetch')) {
          this.logger.error(`Shopify Storefront API network error: ${error.message}`);
          throw new ShopifyApiError(`Network error: ${error.message}`);
        }
      }

      this.logger.error(`Unexpected error in Shopify Storefront API: ${error}`);
      throw new ShopifyApiError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
