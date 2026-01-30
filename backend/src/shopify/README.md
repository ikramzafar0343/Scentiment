# Shopify Integration Module

This module provides a clean, production-ready service layer for integrating with Shopify Admin and Storefront APIs.

## Features

- ✅ **Clean Service Layer**: Modular, testable services with clear separation of concerns
- ✅ **Environment-Based Configuration**: All credentials managed via environment variables
- ✅ **Security**: Tokens never exposed to frontend - all API calls are server-side only
- ✅ **Error Handling**: Comprehensive error handling with custom error types
- ✅ **Logging**: Structured logging for debugging and monitoring
- ✅ **Caching**: Redis-based caching for improved performance
- ✅ **Rate Limiting**: Built-in rate limit detection and handling
- ✅ **Type Safety**: Full TypeScript support with proper types

## Architecture

```
ShopifyModule
├── ShopifyConfig          # Configuration service (env vars)
├── ShopifyAdminClient     # Low-level Admin API client
├── ShopifyStorefrontClient # Low-level Storefront API client
└── ShopifyAdminProductService # High-level product service
```

## Shopify IDs (GIDs)

Shopify GraphQL uses **Global IDs (GIDs)** for resources. These IDs are **strings** and should be treated as opaque identifiers.

- Example Product GID: `gid://shopify/Product/123`
- Example Order GID: `gid://shopify/Order/456`

Guidelines:

- Do **not** assume these IDs are MongoDB `ObjectId`s.
- Keep ID fields typed as `string` across DTOs, schemas, and API responses.
- If you persist Shopify IDs in MongoDB, store them as a `string` (and index the string) rather than converting formats.
- Shopify Admin/Storefront GraphQL queries typically accept variables like `{ id: "gid://shopify/Product/123" }` with type `ID!`.

## Environment Variables

### Required

- `SHOPIFY_SHOP_DOMAIN`: Your Shopify shop domain (e.g., `your-shop.myshopify.com`)
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: Admin API access token for product management
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Storefront API access token for public catalog

### Optional

- `SHOPIFY_API_VERSION`: API version (default: `2024-01`)
- `SHOPIFY_HTTP_TIMEOUT_MS`: HTTP timeout in milliseconds (default: `8000`)
- `SHOPIFY_HTTP_RETRIES`: Number of retry attempts (default: `2`)

## Usage

### Basic Product Operations

```typescript
import { ShopifyAdminProductService } from './shopify/shopify.admin.product.service';

// Get all products
const products = await shopifyProductService.findAll(1, 20);

// Get single product
const product = await shopifyProductService.findOne('gid://shopify/Product/123');

// Create product
const newProduct = await shopifyProductService.create({
  name: 'New Product',
  price: 99.99,
  category: 'Electronics',
  // ... other fields
});

// Update product
const updated = await shopifyProductService.update(productId, {
  name: 'Updated Name',
  price: 89.99,
});

// Delete product
await shopifyProductService.remove(productId);
```

### Direct API Access

```typescript
import { ShopifyAdminClient } from './shopify/shopify.admin.client';

// Execute custom GraphQL query
const data = await adminClient.query(`
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`);
```

## Error Handling

The module provides custom error types for better error handling:

```typescript
import {
  ShopifyConfigurationError,
  ShopifyApiError,
  ShopifyNotFoundError,
  ShopifyRateLimitError,
} from './shopify/shopify.errors';

try {
  const product = await shopifyProductService.findOne(id);
} catch (error) {
  if (error instanceof ShopifyNotFoundError) {
    // Product not found
  } else if (error instanceof ShopifyRateLimitError) {
    // Rate limit exceeded - retry after error.retryAfter seconds
  } else if (error instanceof ShopifyApiError) {
    // General API error
  } else if (error instanceof ShopifyConfigurationError) {
    // Configuration missing
  }
}
```

## Security

- **No Token Exposure**: All Shopify tokens are server-side only, never sent to frontend
- **Environment Variables**: All credentials stored in environment variables, never in code
- **Validation**: Configuration is validated before use
- **Error Messages**: Error messages don't expose sensitive information

## Caching

Products are automatically cached in Redis:
- Product list: 1 hour cache
- Single product: 1 hour cache
- Cache is invalidated on create/update/delete operations

## Rate Limiting

The module automatically detects and handles Shopify rate limits:
- Monitors throttle status from API responses
- Throws `ShopifyRateLimitError` when rate limit is exceeded
- Provides `retryAfter` value for retry logic

## Logging

All operations are logged with appropriate levels:
- `debug`: Cache hits, successful queries
- `log`: Successful operations
- `warn`: Configuration issues, rate limit warnings
- `error`: API errors, unexpected failures

## Testing

When Shopify is not configured, services gracefully return empty arrays or throw appropriate errors. This allows the application to start even without Shopify credentials.

## Production Checklist

- [ ] Set all required environment variables
- [ ] Verify Shopify API tokens have correct scopes
- [ ] Test rate limiting behavior
- [ ] Monitor logs for errors
- [ ] Set up alerts for rate limit warnings
- [ ] Configure Redis for caching
- [ ] Review error handling in your application code
