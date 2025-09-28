import { ApiResponse, Product, Category, PickupRequest, Testimonial, FAQ, BlogPost, ContactInfo } from '@/types';
import { clearAuthData } from '@/components/providers/auth-provider';
import { parseCookies, setCookie } from 'nookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<ApiResponse<T>> {
    let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers = new Headers(options?.headers);

    // Only set Content-Type to application/json if body is not FormData
    if (!(options?.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        const cookies = parseCookies();
        const refreshToken = cookies['refresh_token'];

        if (refreshToken) {
          try {
            const refreshResponse = await this.refreshToken(refreshToken);

            if (refreshResponse.status === 200 && refreshResponse.data?.accessToken) {
              token = refreshResponse.data.accessToken;
              localStorage.setItem('access_token', token);
              if (refreshResponse.data.refreshToken) {
                setCookie(null, 'refresh_token', refreshResponse.data.refreshToken, { path: '/', maxAge: 30 * 24 * 60 * 60 });
              }

              headers.set('Authorization', `Bearer ${token}`);
              response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
              });
            } else {
              // Refresh token is invalid
              throw new Error('Invalid refresh token');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            clearAuthData();
            if (typeof window !== 'undefined') {
              window.location.href = '/signup';
            }
            throw new Error('Unauthorized: Session expired.');
          }
        } else {
            clearAuthData();
            if (typeof window !== 'undefined') {
              window.location.href = '/signup';
            }
            throw new Error('Unauthorized: No refresh token.');
        }
      }

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const errMsg = (json && (json as any).message) || response.statusText || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      if (json) return json as ApiResponse<T>;

      return {
        status: response.status,
        data: (fallbackData ?? ({} as T)),
        pagination: undefined,
        message: '',
        error: '',
      } as unknown as ApiResponse<T>;

    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        // Don't return fallback data for auth errors, let the redirect happen
        throw error;
      }

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

  // OTP
  async sendOtp(mobileNumber: string): Promise<any> {
    return this.fetchApi(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ mobileNumber }),
    });
  }
  async verifyOtp(mobileNumber: string, otp: string): Promise<any> {
    return this.fetchApi(`/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, otp }),
    });
  }

  async updateProfile(profileData: {
    name: string;
    dob: string;
    gender: string;
    baseAddress: string;
    pincode: string;
  }): Promise<any> {
    return this.fetchApi(`/customer/update-profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  

  // Products
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    searchParam?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<Product[]>> {
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

    return this.fetchApi(`/upload/images`, {
      method: 'POST',
      body: formData,
    });
  }

  // Testimonials
  async getTestimonials(limit?: number): Promise<ApiResponse<Testimonial[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.fetchApi(`/testimonials${params}`);
  }

  // FAQ
  async getFAQs(params?: { category?: string; size?: number; page?: number }): Promise<ApiResponse<FAQ[]>> {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.category) searchParams.append('category', params.category);
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.fetchApi(`/faqs${query}`, undefined, []);
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

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken?: string }>> {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return res.json();
  }

  async getAuthStatus(): Promise<ApiResponse<any>> {
    return this.fetchApi('/auth/status', { method: 'GET' });
  }
}

export const apiService = new ApiService();

export interface HomePageData {
  electronics: Product[];
  homeAppliances: Product[];
  furniture: Product[];
  testimonials: Testimonial[];
}

// Batched homepage data fetcher
export async function getHomePageData(): Promise<HomePageData> {
  const [electronics, homeAppliances, furniture, testimonials] = await Promise.all([
    apiService.getProducts({ category: 'electronics' }),
    apiService.getProducts({ category: 'home-appliances' }),
    apiService.getProducts({ category: 'furniture' }),
    apiService.getTestimonials(9),
  ]);
  return {
    electronics: electronics?.data || [],
    homeAppliances: homeAppliances?.data || [],
    furniture: furniture?.data || [],
    testimonials: testimonials?.data || [],
  };
}