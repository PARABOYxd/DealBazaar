import { ApiResponse, Product, Category, PickupRequest, ScheduleRequest, Testimonial, FAQ, BlogPost, ContactInfo, User, LoginResponse } from '@/types';
import { clearAuthData } from '@/components/providers/auth-provider';
import { parseCookies, setCookie } from 'nookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// A custom error class for API-specific errors
class ApiError extends Error {
  constructor(message: string, public status: number, public data: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  }

  private buildQueryParams(filters: Record<string, any>): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    }
    return params.toString();
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      const json = await response.json().catch(() => null);

      if (!response.ok) {
        // If unauthorized and not already a retry, attempt to refresh the token
        if ((response.status === 401 || response.status === 403) && !isRetry) {
          return this.handleUnauthorized<T>(endpoint, options);
        }
        const errorMessage = json?.message || response.statusText || `HTTP ${response.status}`;
        throw new ApiError(errorMessage, response.status, json);
      }

      return json as ApiResponse<T>;

    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      if (error instanceof ApiError) {
        // Re-throw ApiError to be handled by the caller
        throw error;
      }
      // For generic errors (e.g., network failure), wrap in ApiError
      throw new ApiError(error instanceof Error ? error.message : 'An unknown error occurred', 500, null);
    }
  }

  private async handleUnauthorized<T>(originalEndpoint: string, originalOptions: RequestInit): Promise<ApiResponse<T>> {
    const refreshTokenValue = parseCookies()['refresh_token'];
    if (!refreshTokenValue) {
      clearAuthData();
      throw new ApiError('Unauthorized: No refresh token.', 401, null);
    }

    try {
      const refreshResponse = await this.refreshToken(refreshTokenValue);
      if (refreshResponse.status === 200 && refreshResponse.data?.accessToken) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        localStorage.setItem('access_token', accessToken);
        if (newRefreshToken) {
          setCookie(null, 'refresh_token', newRefreshToken, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        }
        // Retry the original request with the new token
        return this.fetchApi<T>(originalEndpoint, originalOptions, true);
      } else {
        clearAuthData();
        throw new ApiError('Unauthorized: Could not refresh session.', 401, null);
      }
    } catch (error) {
      clearAuthData();
      console.error('Token refresh failed:', error);
      throw new ApiError('Unauthorized: Session expired.', 401, null);
    }
  }

  // --- Auth ---
  sendOtp = (mobileNumber: string): Promise<ApiResponse<any>> => this.fetchApi(`/auth/login`, { method: 'POST', body: JSON.stringify({ mobileNumber }) });
  verifyOtp = (mobileNumber: string, otp: string): Promise<ApiResponse<LoginResponse[]>> => this.fetchApi(`/auth/verify-otp`, { method: 'POST', body: JSON.stringify({ mobileNumber, otp }) });
  getAuthStatus = (): Promise<ApiResponse<User>> => this.fetchApi('/auth/status', { method: 'GET' });
  
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken?: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      throw new ApiError('Failed to refresh token', response.status, await response.json().catch(() => null));
    }
    return response.json();
  }

  // --- User Profile ---
  updateProfile = (profileData: Partial<User>): Promise<ApiResponse<Partial<User>[]>> => this.fetchApi(`/customer/update-profile`, { method: 'PUT', body: JSON.stringify(profileData) });
  getCustomerDetails = (): Promise<ApiResponse<User>> => this.fetchApi('/customer/details', { method: 'GET' });

  // --- Products & Categories ---
  getSubcategory = (filters: Record<string, any> = {}): Promise<ApiResponse<Product[]>> => this.fetchApi(`/subcategory?${this.buildQueryParams(filters)}`);
  getProductsBySubcategory = (subcategory: string, filters: Record<string, any> = {}): Promise<ApiResponse<Product[]>> => this.fetchApi(`/subcategory/${subcategory}?${this.buildQueryParams(filters)}`);
  getProductBySlug = (slug: string): Promise<ApiResponse<Product>> => this.fetchApi(`/products/${slug}`);
  getCategories = (params: Record<string, any> = {}): Promise<ApiResponse<Category[]>> => this.fetchApi(`/category?${this.buildQueryParams(params)}`);

  // --- Pickup & Scheduling ---
  createPickupRequestWithImages = (requestData: Omit<PickupRequest, 'id' | 'images'>, images: File[]): Promise<ApiResponse<PickupRequest>> => {
    const formData = new FormData();
    images.forEach(file => formData.append('images', file));
    formData.append('data', JSON.stringify(requestData));
    return this.fetchApi('/pickup-requests', { method: 'POST', body: formData });
  }

  createScheduleRequestWithImages = (requestData: any, images: File[]): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    images.forEach(file => formData.append('images', file));
    formData.append('data', JSON.stringify(requestData));
    return this.fetchApi('/schedule', { method: 'POST', body: formData });
  }

  getSchedules = (): Promise<ApiResponse<ScheduleRequest[]>> => this.fetchApi(`/schedule`, { method: 'GET' });

  // --- Misc ---
  getTestimonials = (limit?: number): Promise<ApiResponse<Testimonial[]>> => this.fetchApi(`/testimonials${limit ? `?limit=${limit}` : ''}`);
  getFAQs = (params: Record<string, any> = {}): Promise<ApiResponse<FAQ[]>> => this.fetchApi(`/faqs?${this.buildQueryParams(params)}`, {});
  getBlogPosts = (params: Record<string, any> = {}): Promise<ApiResponse<{ posts: BlogPost[]; total: number; pages: number }>> => this.fetchApi(`/blog?${this.buildQueryParams(params)}`);
  getBlogPostBySlug = (slug: string): Promise<ApiResponse<BlogPost>> => this.fetchApi(`/blog/${slug}`);
  getContactInfo = (): Promise<ApiResponse<ContactInfo>> => this.fetchApi('/contact');
  sendContactMessage = (data: Record<string, string>): Promise<ApiResponse<{ success: boolean }>> => this.fetchApi('/contact', { method: 'POST', body: JSON.stringify(data) });
  subscribeNewsletter = (email: string): Promise<ApiResponse<{ success: boolean }>> => this.fetchApi('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
}

export const apiService = new ApiService();

// --- Batched Homepage Data ---
export interface HomePageData {
  electronics: Product[];
  homeAppliances: Product[];
  furniture: Product[];
  testimonials: Testimonial[];
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [electronics, homeAppliances, furniture, testimonials] = await Promise.all([
      apiService.getSubcategory({ category: 'electronics' }),
      apiService.getSubcategory({ category: 'home-appliances' }),
      apiService.getSubcategory({ category: 'furniture' }),
      apiService.getTestimonials(9),
    ]);
    return {
      electronics: electronics?.data || [],
      homeAppliances: homeAppliances?.data || [],
      furniture: furniture?.data || [],
      testimonials: testimonials?.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Return empty data structure on failure
    return {
      electronics: [],
      homeAppliances: [],
      furniture: [],
      testimonials: [],
    };
  }
}
