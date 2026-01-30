import { Injectable, Logger } from '@nestjs/common';
import { ShopifyConfig } from './shopify.config';
import { fetchJsonWithTimeout, withRetry } from './shopify.utils';
import {
  ShopifyConfigurationError,
  ShopifyApiError,
  ShopifyRateLimitError,
} from './shopify.errors';

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: { code?: string } }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus?: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
};

@Injectable()
export class ShopifyAdminClient {
  private readonly logger = new Logger(ShopifyAdminClient.name);

  constructor(private readonly shopifyConfig: ShopifyConfig) {}

  /**
   * Execute a GraphQL query against Shopify Admin API
   * @param query GraphQL query string
   * @param variables Query variables
   * @returns Promise resolving to the query response data
   * @throws ShopifyConfigurationError if Shopify is not configured
   * @throws ShopifyApiError if the API returns an error
   * @throws ShopifyRateLimitError if rate limit is exceeded
   */
  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    // Validate configuration
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyConfigurationError(
        'Shopify Admin API is not configured. Please set SHOPIFY_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN environment variables.',
      );
    }

    const shopDomain = this.shopifyConfig.getShopDomain()!;
    const accessToken = this.shopifyConfig.getAdminAccessToken()!;
    const apiVersion = this.shopifyConfig.getApiVersion();
    const url = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;
    const timeoutMs = this.shopifyConfig.getHttpTimeout();
    const retries = this.shopifyConfig.getHttpRetries();

    this.logger.debug(`Executing Shopify Admin API query: ${query.substring(0, 100)}...`);

    try {
      const json = await withRetry(
        () =>
          fetchJsonWithTimeout<GraphQlResponse<T>>(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': accessToken,
            },
            body: JSON.stringify({ query, variables: variables ?? {} }),
            timeoutMs,
          }),
        retries,
      );

      // Check for rate limiting
      if (json?.extensions?.cost?.throttleStatus) {
        const throttleStatus = json.extensions.cost.throttleStatus;
        if (throttleStatus.currentlyAvailable < throttleStatus.maximumAvailable * 0.1) {
          this.logger.warn(
            `Shopify API rate limit warning: ${throttleStatus.currentlyAvailable}/${throttleStatus.maximumAvailable} available`,
          );
        }
        if (throttleStatus.currentlyAvailable === 0) {
          const restoreRate = throttleStatus.restoreRate;
          const retryAfter = Math.ceil((throttleStatus.maximumAvailable - throttleStatus.currentlyAvailable) / restoreRate);
          throw new ShopifyRateLimitError(
            'Shopify API rate limit exceeded',
            retryAfter,
          );
        }
      }

      // Check for GraphQL errors
      if (json?.errors?.length) {
        const errorMessages = json.errors.map((e) => e.message).join('; ');
        const errorCodes = json.errors
          .map((e) => e.extensions?.code)
          .filter(Boolean)
          .join(', ');

        this.logger.error(`Shopify Admin API error: ${errorMessages}${errorCodes ? ` (codes: ${errorCodes})` : ''}`);

        // Check for specific error types
        const rateLimitError = json.errors.find(
          (e) => e.extensions?.code === 'THROTTLED' || e.message.includes('rate limit'),
        );
        if (rateLimitError) {
          throw new ShopifyRateLimitError(errorMessages);
        }

        throw new ShopifyApiError(errorMessages, undefined, json.errors.map(e => ({
          message: e.message,
        })));
      }

      if (!json?.data) {
        throw new ShopifyApiError('Shopify Admin API returned empty response');
      }

      this.logger.debug('Shopify Admin API query successful');
      return json.data;
    } catch (error) {
      if (error instanceof ShopifyConfigurationError || 
          error instanceof ShopifyApiError || 
          error instanceof ShopifyRateLimitError) {
        throw error;
      }

      // Handle network/timeout errors
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('aborted')) {
          this.logger.error(`Shopify Admin API timeout: ${error.message}`);
          throw new ShopifyApiError(`Request timeout: ${error.message}`);
        }
        if (error.message.includes('fetch')) {
          this.logger.error(`Shopify Admin API network error: ${error.message}`);
          throw new ShopifyApiError(`Network error: ${error.message}`);
        }
      }

      this.logger.error(`Unexpected error in Shopify Admin API: ${error}`);
      throw new ShopifyApiError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
