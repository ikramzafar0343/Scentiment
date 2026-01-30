import { Injectable } from '@nestjs/common';
import { ShopifyStorefrontClient } from '../shopify/shopify.storefront.client';
import type { ShopifyCollection, ShopifyProduct } from '../shopify/shopify.types';
import { RedisService } from '../redis/redis.service';
import type { ListProductsDto } from './dto/list-products.dto';

type StorefrontCollectionNode = { id: string; handle: string; title: string };
type StorefrontProductNode = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml?: string | null;
  productType?: string | null;
  images: { edges: Array<{ node: { url: string; altText?: string | null } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        sku?: string | null;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }>;
  };
};

@Injectable()
export class CatalogService {
  constructor(
    private readonly storefront: ShopifyStorefrontClient,
    private readonly cache: RedisService,
  ) {}

  async listCollections(): Promise<ShopifyCollection[]> {
    try {
      const cacheKey = 'shopify:collections:v1';
      const cached = await this.cache.get<ShopifyCollection[]>(cacheKey);
      if (cached) return cached;

      const query = `
        query Collections($first: Int!) {
          collections(first: $first) {
            edges { node { id handle title } }
          }
        }
      `;

      const data = await this.storefront.query<{ collections: { edges: Array<{ node: StorefrontCollectionNode }> } }>(
        query,
        { first: 50 },
      );

      const collections = data.collections.edges.map((e) => ({
        id: e.node.id,
        handle: e.node.handle,
        title: e.node.title,
      }));

      await this.cache.set(cacheKey, collections, 300);
      return collections;
    } catch (error) {
      // If Shopify is not configured, return empty array instead of throwing
      if (error instanceof Error && error.message.includes('not configured')) {
        return [];
      }
      throw error;
    }
  }

  async listProducts(input: ListProductsDto): Promise<{ products: ShopifyProduct[]; nextCursor: string | null }> {
    const limit = input.limit ?? 24;
    const sort = input.sort ?? 'featured';
    const cursor = input.cursor ?? null;

    const queryParts: string[] = [];
    if (input.q) queryParts.push(`title:*${input.q}* OR product_type:*${input.q}*`);
    const queryStr = queryParts.join(' AND ') || null;

    const sortKey =
      sort === 'newest'
        ? 'CREATED_AT'
        : sort === 'price-asc' || sort === 'price-desc'
          ? 'PRICE'
          : 'RELEVANCE';
    const reverse = sort === 'price-desc';

    const gql = `
      query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys!, $reverse: Boolean) {
        products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
          edges {
            cursor
            node {
              id
              handle
              title
              descriptionHtml
              productType
              images(first: 5) { edges { node { url altText } } }
              variants(first: 50) {
                edges {
                  node { id title sku availableForSale price { amount currencyCode } }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.storefront.query<{ products: { edges: Array<{ cursor: string; node: StorefrontProductNode }> } }>(
      gql,
      {
        first: limit,
        after: cursor,
        query: queryStr,
        sortKey,
        reverse,
      },
    );

    const edges = data.products.edges;
    const products = edges.map((e) => this.adaptProduct(e.node));
    const nextCursor = edges.length ? edges[edges.length - 1].cursor : null;

    return { products, nextCursor };
  }

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const cacheKey = `shopify:product:handle:${handle}`;
    const cached = await this.cache.get<ShopifyProduct>(cacheKey);
    if (cached) return cached;

    const gql = `
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          handle
          title
          descriptionHtml
          productType
          images(first: 10) { edges { node { url altText } } }
          variants(first: 100) { edges { node { id title sku availableForSale price { amount currencyCode } } } }
        }
      }
    `;

    const data = await this.storefront.query<{ product: StorefrontProductNode | null }>(gql, { handle });
    if (!data.product) return null;
    const product = this.adaptProduct(data.product);
    await this.cache.set(cacheKey, product, 120);
    return product;
  }

  private adaptProduct(node: StorefrontProductNode): ShopifyProduct {
    return {
      id: node.id,
      handle: node.handle,
      title: node.title,
      descriptionHtml: node.descriptionHtml ?? null,
      productType: node.productType ?? null,
      images: node.images.edges.map((e) => ({ url: e.node.url, altText: e.node.altText ?? null })),
      variants: node.variants.edges.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        sku: e.node.sku ?? null,
        availableForSale: e.node.availableForSale,
        price: {
          amount: e.node.price.amount,
          currencyCode: e.node.price.currencyCode,
        },
      })),
    };
  }
}

