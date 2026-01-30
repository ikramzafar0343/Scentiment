/**
 * Custom error classes for Shopify API operations
 */

export class ShopifyConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyConfigurationError';
    Object.setPrototypeOf(this, ShopifyConfigurationError.prototype);
  }
}

export class ShopifyApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Array<{ field?: string[]; message: string }>,
  ) {
    super(message);
    this.name = 'ShopifyApiError';
    Object.setPrototypeOf(this, ShopifyApiError.prototype);
  }
}

export class ShopifyNotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found in Shopify`);
    this.name = 'ShopifyNotFoundError';
    Object.setPrototypeOf(this, ShopifyNotFoundError.prototype);
  }
}

export class ShopifyRateLimitError extends Error {
  constructor(
    message: string = 'Shopify API rate limit exceeded',
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'ShopifyRateLimitError';
    Object.setPrototypeOf(this, ShopifyRateLimitError.prototype);
  }
}
