/**
 * API Service for backend communication
 * Handles all HTTP requests to the NestJS backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    // Only set Content-Type for requests that have a body
    const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
    const method = (fetchOptions.method || 'GET').toUpperCase();
    
    const headers: Record<string, string> = {};
    
    // Only add Content-Type for methods that typically have bodies
    if (hasBody && !['GET', 'DELETE', 'HEAD'].includes(method)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Merge any additional headers
    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || response.statusText;
        } catch {
          // If response is not JSON, try to get text
          const text = await response.text().catch(() => '');
          errorMessage = text || response.statusText;
        }
        
        // Provide more specific error messages
        if (response.status === 401) {
          errorMessage = 'Unauthorized: Please sign in to access this resource.';
        } else if (response.status === 404) {
          errorMessage = `Endpoint not found: ${endpoint}. Please ensure the backend server is running and the route is registered.`;
        }
        
        throw new Error(errorMessage || `HTTP ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      
      // Handle connection errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:3000');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    return this.request<{ accessToken: string; refreshToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(token: string) {
    return this.request('/auth/logout', {
      method: 'GET',
      token,
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
  }

  // Product endpoints
  async getProducts(page = 1, limit = 100, token?: string, cacheBust = false) {
    const timestamp = cacheBust ? `&_t=${Date.now()}` : '';
    return this.request<any[]>(`/products?page=${page}&limit=${limit}${timestamp}`, {
      method: 'GET',
      token,
    });
  }

  async getProduct(id: string, token?: string) {
    return this.request<any>(`/products/${id}`, {
      method: 'GET',
      token,
    });
  }

  async createProduct(productData: any, token: string) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      token,
    });
  }

  async updateProduct(id: string, productData: any, token: string) {
    return this.request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      token,
    });
  }

  async deleteProduct(id: string, token: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Dashboard/Analytics endpoints
  async getDashboardStats(token?: string) {
    return this.request<{
      totalSales: number;
      totalSalesChange: string;
      activeListings: number;
      activeListingsChange: string;
      monthlyRevenue: number;
      monthlyRevenueChange: string;
      totalProducts: number;
      totalProductsChange: string;
      pendingOrders: number;
      pendingOrdersChange: string;
      recentProducts: Array<{
        id: string;
        name: string;
        status: string;
        date: string;
      }>;
    }>('/products/dashboard/stats', {
      method: 'GET',
      token,
    });
  }

  async getAnalytics(period: string, token: string) {
    return this.request<{
      revenue: {
        total: number;
        change: number;
        chart: Array<{ date: string; value: number }>;
      };
      orders: {
        total: number;
        change: number;
        chart: Array<{ date: string; value: number }>;
      };
      products: {
        total: number;
        sold: number;
        change: number;
      };
      customers: {
        total: number;
        new: number;
        change: number;
      };
      topProducts: Array<{
        id: string;
        name: string;
        sales: number;
        revenue: number;
        orders: number;
        change: number;
      }>;
      categories: Array<{
        name: string;
        revenue: number;
        orders: number;
        percentage: number;
      }>;
    }>(`/analytics?period=${encodeURIComponent(period)}`, {
      method: 'GET',
      token,
    });
  }

  // Order endpoints
  async createOrder(orderData: any, token: string) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      token,
    });
  }

  async getOrders(token: string, page = 1, limit = 20, status?: string) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return this.request<any[]>(`/orders?${params.toString()}`, {
      method: 'GET',
      token,
    });
  }

  async getOrder(id: string, token: string) {
    return this.request<any>(`/orders/${id}`, {
      method: 'GET',
      token,
    });
  }

  async updateOrderStatus(id: string, status: string, token: string) {
    return this.request<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }

  async getOrderStats(token: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.request<any>(`/orders/stats?${params.toString()}`, {
      method: 'GET',
      token,
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string }>('/health', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
