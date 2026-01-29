// Payment API service layer
// This file contains the API client for payment operations
// Backend endpoints should be implemented to handle these requests securely

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Payment Intent APIs
export const paymentApi = {
  /**
   * Create a payment intent for a new order
   * Backend endpoint: POST /api/payment-intents
   */
  createPaymentIntent: async (data: {
    amount: number;
    currency?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) => {
    return apiRequest<{ paymentIntent: { id: string; clientSecret: string; status: string } }>(
      '/payment-intents',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Confirm a payment intent with a payment method
   * Backend endpoint: POST /api/payment-intents/:id/confirm
   */
  confirmPaymentIntent: async (paymentIntentId: string, paymentMethodId: string) => {
    return apiRequest<{ success: boolean; orderId?: string }>(
      `/payment-intents/${paymentIntentId}/confirm`,
      {
        method: 'POST',
        body: JSON.stringify({ paymentMethodId }),
      }
    );
  },

  /**
   * Get saved payment methods for the current customer
   * Backend endpoint: GET /api/payment-methods
   */
  getPaymentMethods: async () => {
    return apiRequest<{ paymentMethods: Array<{
      id: string;
      type: string;
      card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
        name?: string;
      };
      isDefault: boolean;
      createdAt: string;
    }> }>('/payment-methods');
  },

  /**
   * Attach a payment method to the customer
   * Backend endpoint: POST /api/payment-methods/attach
   */
  attachPaymentMethod: async (paymentMethodId: string, setAsDefault?: boolean) => {
    return apiRequest<{ success: boolean; paymentMethodId: string }>(
      '/payment-methods/attach',
      {
        method: 'POST',
        body: JSON.stringify({ paymentMethodId, setAsDefault }),
      }
    );
  },

  /**
   * Detach (remove) a payment method
   * Backend endpoint: DELETE /api/payment-methods/:id
   */
  detachPaymentMethod: async (paymentMethodId: string) => {
    return apiRequest<{ success: boolean }>(
      `/payment-methods/${paymentMethodId}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Set a payment method as default
   * Backend endpoint: PATCH /api/payment-methods/:id/default
   */
  setDefaultPaymentMethod: async (paymentMethodId: string) => {
    return apiRequest<{ success: boolean }>(
      `/payment-methods/${paymentMethodId}/default`,
      {
        method: 'PATCH',
      }
    );
  },
};
