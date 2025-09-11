import { ApiResponse, Product, Category, PickupRequest, Testimonial, FAQ, BlogPost, ContactInfo } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit, fallbackData?: T) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      // try to parse JSON (backend returns { status, data, pagination, message, error })
      const json = await response.json().catch(() => null);

      // If server returned non-JSON but non-ok status, throw
      if (!response.ok) {
        const errMsg = (json && (json as any).message) || response.statusText || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      // If JSON exists, return it as-is (assumes it matches your ApiResponse shape)
      if (json) return json as ApiResponse<T>;

      // If no JSON (rare), return a synthetic success shape
      return {
        status: response.status,
        data: (fallbackData ?? ({} as T)),
        pagination: undefined,
        message: '',
        error: '',
      } as unknown as ApiResponse<T>;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);

      // return a fallback object consistent with your backend shape
      return {
        status: 500,
        data: (fallbackData ?? (Array.isArray(fallbackData) ? [] : ({} as T))),
        pagination: {
          pageNumber: 0,
          pageSize: 0,
          count: 0,
          totalElements: 0,
        },
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as unknown as ApiResponse<T>;
    }
  }

  // Products
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<{ products: Product[]; total: number; pages: number; size: number }>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    return this.fetchApi(`/products?${params.toString()}`);
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    return this.fetchApi(`/products/${slug}`);
  }

  // Categories
  async getCategories(params?: { page?: number; size?: number }): Promise<ApiResponse<Category[]>> {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.fetchApi(`/category${query}`);
  }


  // Pickup Requests
  async createPickupRequest(request: Omit<PickupRequest, 'id'>): Promise<ApiResponse<PickupRequest>> {
    return this.fetchApi('/pickup-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async uploadImages(files: File[]): Promise<ApiResponse<{ urls: string[] }>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });

    return fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }

  // Testimonials
  async getTestimonials(limit?: number): Promise<ApiResponse<Testimonial[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.fetchApi(`/testimonials${params}`);
  }

  // FAQ
  async getFAQs(category?: string): Promise<ApiResponse<FAQ[]>> {
    const params = category ? `?category=${category}` : '';
    return this.fetchApi(`/faqs${params}`);
  }

  // Blog
  async getBlogPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  }): Promise<ApiResponse<{ posts: BlogPost[]; total: number; pages: number }>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    return this.fetchApi(`/blog?${searchParams.toString()}`);
  }

  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return this.fetchApi(`/blog/${slug}`);
  }

  // Contact
  async getContactInfo(): Promise<ApiResponse<ContactInfo>> {
    return this.fetchApi('/contact');
  }

  async sendContactMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return this.fetchApi('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.fetchApi('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const apiService = new ApiService();