import { ApiResponse, Product, Category, PickupRequest, Testimonial, FAQ, BlogPost, ContactInfo } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        data: (endpoint.includes('/categories') ? [] : 
               endpoint.includes('/products') ? { products: [], total: 0, pages: 0 } :
               endpoint.includes('/testimonials') ? [] :
               endpoint.includes('/blog') ? { posts: [], total: 0, pages: 0 } :
               {}) as T,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
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
    limit?: number;
  }): Promise<ApiResponse<{ products: Product[]; total: number; pages: number }>> {
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
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.fetchApi('/categories');
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