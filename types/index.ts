export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  estimatePriceMin: number;
  estimatePriceMax: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  brand?: string;
  model?: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface PickupRequest {
  id?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  items: {
    category: string;
    description: string;
    quantity: number;
    condition: string;
  }[];
  images?: string[];
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  comment: string;
  location: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: string;
  readTime: number;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl: string;
  businessHours: {
    [key: string]: string;
  };
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  count: number;
  totalElements: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}