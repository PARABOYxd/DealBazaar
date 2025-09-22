import { ApiResponse, Product, Category, PickupRequest, Testimonial, FAQ, BlogPost, ContactInfo, User } from '@/types';
import { clearAuthData } from '@/components/providers/auth-provider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit, fallbackData?: T) {
    try {
      const headers = new Headers(options?.headers);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          clearAuthData(); // Clear authentication data
          window.location.href = '/signup'; // Redirect to login page
        }
        throw new Error('Unauthorized: Redirecting to login.');
      }

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

  // OTP
  async sendOtp(mobileNumber: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber }),
    });
    return res.json();
  }
  async verifyOtp(mobileNumber: string, otp: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/customer/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, otp }),
    });
    return res.json();
  }

  async updateProfile(profileData: { name: string; dob: string; gender: string }): Promise<any> {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const res = await fetch(`${API_BASE_URL}/customer/update-profile`, {
      method: 'PUT', // Assuming PUT for update
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return res.json();
  }

  async updateAddress(addressData: {
    baseAddress: string;
    postOfficeName: string;
    pincode: string;
    city: string;
    district: string;
    state: string;
  }): Promise<any> {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const res = await fetch(`${API_BASE_URL}/customer/update-address`, {
      method: 'PUT', // Assuming PUT for update
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });
    return res.json();
  }

  async getMe(token: string): Promise<ApiResponse<User>> {
    return this.fetchApi(`/customer/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    return this.fetchApi(`/faqs${params}`, undefined, []);
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