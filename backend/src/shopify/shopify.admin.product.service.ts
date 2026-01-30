import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ShopifyAdminClient } from './shopify.admin.client';
import { RedisService } from '../redis/redis.service';
import { ShopifyConfig } from './shopify.config';
import { ShopifyNotFoundError, ShopifyApiError } from './shopify.errors';
import type { ShopifyAdminProduct } from './shopify.types';
import type { Product } from '../products/schemas/product.schema';

/**
 * Shopify Admin Product Service
 * 
 * Handles all product operations using Shopify Admin API as the source of truth.
 * Provides a clean abstraction layer that maps Shopify products to our internal Product schema.
 * 
 * Features:
 * - Automatic caching with Redis
 * - Proper error handling and logging
 * - Graceful fallbacks when Shopify is not configured
 * - Type-safe product mapping
 */
@Injectable()
export class ShopifyAdminProductService {
  private readonly logger = new Logger(ShopifyAdminProductService.name);

  constructor(
    private readonly adminClient: ShopifyAdminClient,
    private readonly cache: RedisService,
    private readonly shopifyConfig: ShopifyConfig,
  ) {}

  /**
   * Map Shopify Admin product to our Product schema
   */
  private mapShopifyToProduct(shopifyProduct: ShopifyAdminProduct, shopifyId?: string): Product {
    const firstVariant = shopifyProduct.variants.edges[0]?.node;
    const price = firstVariant ? parseFloat(firstVariant.price) : 0;
    const stock = firstVariant?.inventoryQuantity ?? 0;
    const firstImage = shopifyProduct.images.edges[0]?.node;

    // Extract category from productType or tags
    const category = shopifyProduct.productType || 'Uncategorized';
    
    // Determine status - Shopify uses ACTIVE/ARCHIVED/DRAFT, we use active/pending/etc
    const status = shopifyProduct.status === 'ACTIVE' ? 'active' : 
                   shopifyProduct.status === 'DRAFT' ? 'pending' : 
                   'inactive';

    // Extract variants
    const variants = shopifyProduct.variants.edges.map(e => e.node.title);

    // Extract images
    const images = shopifyProduct.images.edges.map(e => e.node.url);

    // Map Shopify product to our Product schema format
    const product: any = {
      name: shopifyProduct.title,
      price,
      image: firstImage?.url || '',
      category,
      description: shopifyProduct.descriptionHtml?.replace(/<[^>]*>/g, '') || '',
      stock,
      status,
      variants,
      images,
      isNew: false,
      rating: 0,
      reviews: 0,
    };
    
    // Set _id if provided (Shopify GID)
    if (shopifyId || shopifyProduct.id) {
      product._id = shopifyId || shopifyProduct.id;
    }
    
    return product as Product;
  }

  /**
   * Get all products from Shopify Admin API
   * @param page Page number (1-indexed)
   * @param limit Number of products per page
   * @returns Array of products
   * @throws ShopifyApiError if API call fails
   */
  async findAll(page = 1, limit = 20): Promise<Product[]> {
    // Check if Shopify is configured
    if (!this.shopifyConfig.isAdminConfigured()) {
      this.logger.warn('Shopify Admin API not configured, returning empty array');
      return [];
    }

    const cacheKey = `shopify:products:all:${page}:${limit}`;
    const cached = await this.cache.get<Product[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for products page ${page}, limit ${limit}`);
      return cached;
    }

    try {
      this.logger.log(`Fetching products from Shopify: page ${page}, limit ${limit}`);
      const query = `
        query GetProducts($first: Int!, $after: String) {
          products(first: $first, after: $after) {
            edges {
              cursor
              node {
                id
                title
                handle
                status
                productType
                descriptionHtml
                images(first: 5) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price
                      inventoryQuantity
                      availableForSale
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const skip = (page - 1) * limit;
      // For pagination, we'll fetch more and slice (Shopify uses cursor-based pagination)
      const fetchLimit = Math.min(limit * 2, 250); // Shopify max is 250
      
      const data = await this.adminClient.query<{
        products: {
          edges: Array<{ cursor: string; node: ShopifyAdminProduct }>;
          pageInfo: { hasNextPage: boolean; endCursor?: string };
        };
      }>(query, { first: fetchLimit });

      const products = data.products.edges
        .slice(skip, skip + limit)
        .map(edge => this.mapShopifyToProduct(edge.node, edge.node.id));

      await this.cache.set(cacheKey, products, 3600); // 1 hour cache
      this.logger.log(`Successfully fetched ${products.length} products from Shopify`);
      return products;
    } catch (error) {
      if (error instanceof ShopifyApiError || error instanceof ShopifyNotFoundError) {
        this.logger.error(`Failed to fetch products from Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error fetching products: ${error}`);
      throw new ShopifyApiError(`Failed to fetch products: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a single product by ID
   * @param id Shopify product GID (e.g., 'gid://shopify/Product/123')
   * @returns Product object
   * @throws ShopifyNotFoundError if product not found
   * @throws ShopifyApiError if API call fails
   */
  async findOne(id: string): Promise<Product> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyNotFoundError('Product', id);
    }

    const cacheKey = `shopify:product:${id}`;
    const cached = await this.cache.get<Product>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for product ${id}`);
      return cached;
    }

    try {
      this.logger.log(`Fetching product ${id} from Shopify`);
      const query = `
        query GetProduct($id: ID!) {
          product(id: $id) {
            id
            title
            handle
            status
            productType
            descriptionHtml
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price
                  inventoryQuantity
                  availableForSale
                }
              }
            }
          }
        }
      `;

      const data = await this.adminClient.query<{ product: ShopifyAdminProduct | null }>(
        query,
        { id },
      );

      if (!data.product) {
        this.logger.warn(`Product ${id} not found in Shopify`);
        throw new ShopifyNotFoundError('Product', id);
      }

      const product = this.mapShopifyToProduct(data.product, id);
      await this.cache.set(cacheKey, product, 3600);
      this.logger.log(`Successfully fetched product ${id} from Shopify`);
      return product;
    } catch (error) {
      if (error instanceof ShopifyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to fetch product ${id} from Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error fetching product ${id}: ${error}`);
      throw new ShopifyApiError(`Failed to fetch product: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a product in Shopify
   * @param createProductDto Product data
   * @returns Created product
   * @throws ShopifyApiError if creation fails
   */
  async create(createProductDto: any): Promise<Product> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyApiError('Shopify Admin API is not configured');
    }

    try {
      this.logger.log(`Creating product "${createProductDto.name}" in Shopify`);
      // Build Shopify product input
      const productInput: any = {
        title: createProductDto.name,
        descriptionHtml: createProductDto.description || '',
        productType: createProductDto.category || 'Uncategorized',
        status: createProductDto.status === 'active' ? 'ACTIVE' : 'DRAFT',
      };

      // Add images if provided
      if (createProductDto.image || createProductDto.images) {
        const images = createProductDto.images || [createProductDto.image];
        productInput.images = images.map((url: string) => ({ src: url }));
      }

      // Add variants
      if (createProductDto.variants && createProductDto.variants.length > 0) {
        productInput.variants = createProductDto.variants.map((title: string) => ({
          title,
          price: createProductDto.price.toString(),
          inventoryQuantities: createProductDto.stock ? [{
            availableQuantity: createProductDto.stock,
            locationId: 'gid://shopify/Location/1', // Default location, should be configured
          }] : [],
        }));
      } else {
        // Single variant
        productInput.variants = [{
          price: createProductDto.price.toString(),
          inventoryQuantities: createProductDto.stock ? [{
            availableQuantity: createProductDto.stock,
            locationId: 'gid://shopify/Location/1',
          }] : [],
        }];
      }

      const mutation = `
        mutation ProductCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              title
              handle
              status
              productType
              descriptionHtml
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                    availableForSale
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const data = await this.adminClient.query<{
        productCreate: {
          product: ShopifyAdminProduct | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(mutation, { input: productInput });

      if (data.productCreate.userErrors.length > 0) {
        throw new Error(
          `Shopify error: ${data.productCreate.userErrors.map(e => e.message).join('; ')}`,
        );
      }

      if (!data.productCreate.product) {
        throw new Error('Failed to create product in Shopify');
      }

      // Invalidate cache
      await this.cache.del('shopify:products:all');
      await this.cache.del('shopify:product:count');

      const product = this.mapShopifyToProduct(data.productCreate.product);
      this.logger.log(`Successfully created product "${createProductDto.name}" in Shopify`);
      return product;
    } catch (error) {
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to create product in Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error creating product: ${error}`);
      throw new ShopifyApiError(`Failed to create product: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update a product in Shopify
   * @param id Shopify product GID
   * @param updateProductDto Product update data
   * @returns Updated product
   * @throws ShopifyNotFoundError if product not found
   * @throws ShopifyApiError if update fails
   */
  async update(id: string, updateProductDto: any): Promise<Product> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyApiError('Shopify Admin API is not configured');
    }

    try {
      this.logger.log(`Updating product ${id} in Shopify`);
      const productInput: any = {
        id,
      };

      if (updateProductDto.name) productInput.title = updateProductDto.name;
      if (updateProductDto.description) productInput.descriptionHtml = updateProductDto.description;
      if (updateProductDto.category) productInput.productType = updateProductDto.category;
      if (updateProductDto.status) {
        productInput.status = updateProductDto.status === 'active' ? 'ACTIVE' : 
                              updateProductDto.status === 'pending' ? 'DRAFT' : 
                              'ARCHIVED';
      }

      const mutation = `
        mutation ProductUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              handle
              status
              productType
              descriptionHtml
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                    availableForSale
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const data = await this.adminClient.query<{
        productUpdate: {
          product: ShopifyAdminProduct | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(mutation, { input: productInput });

      if (data.productUpdate.userErrors.length > 0) {
        throw new Error(
          `Shopify error: ${data.productUpdate.userErrors.map(e => e.message).join('; ')}`,
        );
      }

      if (!data.productUpdate.product) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      // Invalidate cache
      await this.cache.del(`shopify:product:${id}`);
      await this.cache.del('shopify:products:all');

      const product = this.mapShopifyToProduct(data.productUpdate.product, id);
      this.logger.log(`Successfully updated product ${id} in Shopify`);
      return product;
    } catch (error) {
      if (error instanceof ShopifyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to update product ${id} in Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error updating product ${id}: ${error}`);
      throw new ShopifyApiError(`Failed to update product: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete a product in Shopify (archives it)
   * @param id Shopify product GID
   * @returns Success message
   * @throws ShopifyNotFoundError if product not found
   * @throws ShopifyApiError if deletion fails
   */
  async remove(id: string): Promise<{ message: string }> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      throw new ShopifyApiError('Shopify Admin API is not configured');
    }

    try {
      this.logger.log(`Deleting product ${id} from Shopify`);
      const mutation = `
        mutation ProductDelete($id: ID!) {
          productDelete(id: $id) {
            deletedProductId
            userErrors {
              field
              message
            }
          }
        }
      `;

      const data = await this.adminClient.query<{
        productDelete: {
          deletedProductId?: string;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(mutation, { id });

      if (data.productDelete.userErrors.length > 0) {
        throw new Error(
          `Shopify error: ${data.productDelete.userErrors.map(e => e.message).join('; ')}`,
        );
      }

      if (!data.productDelete.deletedProductId) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      // Invalidate cache
      await this.cache.del(`shopify:product:${id}`);
      await this.cache.del('shopify:products:all');
      await this.cache.del('shopify:product:count');

      this.logger.log(`Successfully deleted product ${id} from Shopify`);
      return { message: `Product #${id} has been deleted` };
    } catch (error) {
      if (error instanceof ShopifyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ShopifyApiError) {
        this.logger.error(`Failed to delete product ${id} from Shopify: ${error.message}`);
        throw error;
      }
      this.logger.error(`Unexpected error deleting product ${id}: ${error}`);
      throw new ShopifyApiError(`Failed to delete product: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get product count for analytics
   * @returns Total number of products (cached estimate)
   */
  async getProductCount(): Promise<number> {
    if (!this.shopifyConfig.isAdminConfigured()) {
      return 0;
    }

    const cacheKey = 'shopify:product:count';
    const cached = await this.cache.get<number>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      // Fetch first 250 products to estimate (Shopify max per query)
      const products = await this.findAll(1, 250);
      const count = products.length;
      
      await this.cache.set(cacheKey, count, 3600);
      this.logger.debug(`Product count estimate: ${count}`);
      return count;
    } catch (error) {
      this.logger.warn(`Failed to get product count: ${error}`);
      return 0;
    }
  }
}
