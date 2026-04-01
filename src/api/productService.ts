import httpClient, { type ApiResponse } from './httpClient';

export type Product = {
  id: number;
  title: string;
  description?: string | null;
  price: number | string;
  quantity?: number | string;
  category?: string | null;
  brand?: string | null;
  image?: string | null;
  is_active?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProductListQuery = {
  search?: string;
  category?: string;
  brand?: string; 
  min_price?: number | string;
  max_price?: number | string;
  featured?: boolean;
  page?: number;
  limit?: number;
};

export type ProductListData = {
  products: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type ProductShowData = {
  product: Product;
};

export type AdminProductListQuery = {
  search?: string;
  category?: string;
  brand?: string;
  min_price?: number | string;
  max_price?: number | string;
  is_active?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
};

export type AdminCreateProductRequest = {
  title: string;
  description?: string | null;
  price: number | string;
  quantity: number | string;
  category?: string | null;
  brand?: string | null;
  image?: string | null;
  is_active?: boolean;
  featured?: boolean;
};

export type AdminUpdateProductRequest = Omit<AdminCreateProductRequest, 'title'> & {
  title: string;
};

export type DeleteProductResponse = ApiResponse<never>;

export const productService = {
  listProducts: async (params?: ProductListQuery) => {
    return httpClient.get<ProductListData>('/products', params);
  },

  getProductById: async (id: number) => {
    return httpClient.get<ProductShowData>(`/products/${id}`);
  },

  listAdminProducts: async (params?: AdminProductListQuery) => {
    return httpClient.get<ProductListData>('/admin/products', params);
  },

  createProduct: async (payload: AdminCreateProductRequest) => {
    return httpClient.post<{ product: Product }>('/admin/products', payload);
  },

  updateProduct: async (id: number, payload: AdminUpdateProductRequest) => {
    return httpClient.post<{ product: Product }>(`/admin/products/${id}`, payload);
  },

  deleteProduct: async (id: number): Promise<DeleteProductResponse> => {
    return httpClient.delete<never>(`/admin/products/${id}`);
  },
};

