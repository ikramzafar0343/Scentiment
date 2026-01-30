import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SHOPIFY_API_VERSION } from './shopify.constants';
import { fetchJsonWithTimeout, withRetry } from './shopify.utils';

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>
};

@Injectable()
export class ShopifyStorefrontClient {
  private readonly shopDomain: string | undefined;
  private readonly apiVersion: string;
  private readonly accessToken: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.shopDomain = this.config.get<string>('SHOPIFY_SHOP_DOMAIN');
    this.apiVersion = this.config.get<string>('SHOPIFY_API_VERSION') ?? SHOPIFY_API_VERSION;
    this.accessToken = this.config.get<string>('SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  }

  private ensureConfigured(): void {
    if (!this.shopDomain) {
      throw new Error('SHOPIFY_SHOP_DOMAIN is not configured. Set it in your environment variables.');
    }
    if (!this.accessToken) {
      throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured. Set it in your environment variables.');
    }
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    this.ensureConfigured();
    // After ensureConfigured(), we know these are defined
    const shopDomain = this.shopDomain!;
    const accessToken = this.accessToken!;
    const url = `https://${shopDomain}/api/${this.apiVersion}/graphql.json`;
    const timeoutMs = Number(this.config.get<string>('SHOPIFY_HTTP_TIMEOUT_MS') ?? 8000);
    const retries = Number(this.config.get<string>('SHOPIFY_HTTP_RETRIES') ?? 2);

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

    if (json?.errors?.length) {
      throw new Error(`Shopify Storefront API error: ${json.errors.map((e) => e.message).join('; ')}`);
    }
    if (!json?.data) throw new Error('Shopify Storefront API returned empty response');
    return json.data;
  }
}
