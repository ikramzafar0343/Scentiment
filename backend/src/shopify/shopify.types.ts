export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  descriptionHtml?: string | null;
  productType?: string | null;
  images: Array<{ url: string; altText?: string | null }>;
  variants: Array<{
    id: string;
    title: string;
    sku?: string | null;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
  }>;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
}

// Admin API types
export interface ShopifyAdminProduct {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  productType?: string;
  descriptionHtml?: string;
  vendor?: string;
  tags?: string[];
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        sku?: string;
        price: string;
        inventoryQuantity?: number;
        availableForSale: boolean;
      };
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyAdminOrder {
  id: string;
  name: string;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  subtotalPriceSet?: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalShippingPriceSet?: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalTaxSet?: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  financialStatus: string;
  fulfillmentStatus?: string | null;
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        originalUnitPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
        variant?: {
          id: string;
          title: string;
          product?: {
            id: string;
            title: string;
          };
        } | null;
      };
    }>;
  };
  tags?: string[];
  shippingAddress?: {
    name?: string;
    address1?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
  } | null;
}
