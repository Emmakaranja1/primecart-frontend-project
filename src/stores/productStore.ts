import { create } from 'zustand';
import { productService } from '../api/productService';
import type { 
  Product, 
  ProductListQuery, 
} from '../api/productService';
import type { ApiError } from '../api/httpClient';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  error: string | null;
  productError: string | null;
}

interface ProductActions {
  listProducts: (params?: ProductListQuery) => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  clearCurrentProduct: () => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set) => ({
  
  products: [],
  currentProduct: null,
  pagination: null,
  isLoading: false,
  isLoadingProduct: false,
  error: null,
  productError: null,

  
  listProducts: async (params?: ProductListQuery) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await productService.listProducts(params);
      
      if (response.success && response.data) {
        set({
          products: response.data.products,
          pagination: {
            currentPage: response.data.pagination.current_page,
            perPage: response.data.pagination.per_page,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.total_pages,
          },
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch products',
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch products',
      });
    }
  },

  getProductById: async (id: number) => {
    set({ isLoadingProduct: true, productError: null });
    
    try {
      const response = await productService.getProductById(id);
      
      if (response.success && response.data) {
        set({
          currentProduct: response.data.product,
          isLoadingProduct: false,
          productError: null,
        });
      } else {
        set({
          isLoadingProduct: false,
          productError: response.message || 'Failed to fetch product',
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoadingProduct: false,
        productError: apiError.message || 'Failed to fetch product',
      });
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },

  clearErrors: () => {
    set({
      error: null,
      productError: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
