import { create } from 'zustand';
import { productService } from '../api/productService';
import type { 
  Product, 
  ProductListQuery, 
  ProductListData,
  AdminProductListQuery,
  AdminCreateProductRequest,
  AdminUpdateProductRequest,
  DeleteProductResponse,
} from '../api/productService';
import type { ApiError, ApiResponse } from '../api/httpClient';

function normalizeApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null) {
    const maybe = error as Partial<ApiError>;
    if (maybe.success === false && typeof maybe.message === 'string') {
      return {
        success: false,
        message: maybe.message,
        status: typeof maybe.status === 'number' ? maybe.status : undefined,
        errors: maybe.errors,
      };
    }
  }

  return { success: false, message: 'Request failed' };
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  adminProducts: ProductListData | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  error: ApiError | null;
  productError: ApiError | null;
  message: string | null;
}

interface ProductActions {
  
  listProducts: (params?: ProductListQuery) => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  clearCurrentProduct: () => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  

  listAdminProducts: (params?: AdminProductListQuery) => Promise<void>;
  createProduct: (payload: AdminCreateProductRequest) => Promise<ApiResponse<{ product: Product }>>;
  updateProduct: (id: number, payload: AdminUpdateProductRequest) => Promise<ApiResponse<{ product: Product }>>;
  deleteProduct: (id: number) => Promise<DeleteProductResponse>;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set) => ({
  
  products: [],
  currentProduct: null,
  adminProducts: null,
  pagination: null,
  isLoading: false,
  isLoadingProduct: false,
  error: null,
  productError: null,
  message: null,

  
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
          error: normalizeApiError(response),
        });
      }
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({
        isLoading: false,
        error: apiError,
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
          productError: normalizeApiError(response),
        });
      }
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({
        isLoadingProduct: false,
        productError: apiError,
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
      message: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  
  listAdminProducts: async (params?: AdminProductListQuery) => {
    set({ isLoading: true, error: null, message: null });
    
    try {
      const response = await productService.listAdminProducts(params);
      
      if (response.success && response.data) {
        set({
          adminProducts: response.data,
          isLoading: false,
          error: null,
          message: response.message || null,
        });
      } else {
        set({
          isLoading: false,
          error: normalizeApiError(response),
          message: null,
        });
      }
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({
        isLoading: false,
        error: apiError,
        message: null,
      });
    }
  },

  createProduct: async (payload: AdminCreateProductRequest) => {
    set({ isLoading: true, error: null, message: null });
    
    try {
      const response = await productService.createProduct(payload);
      
      if (response.success) {
        set({
          isLoading: false,
          error: null,
          message: response.message || 'Product created successfully',
        });
        return response;
      } else {
        set({
          isLoading: false,
          error: normalizeApiError(response),
          message: null,
        });
        return response;
      }
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({
        isLoading: false,
        error: apiError,
        message: null,
      });
      throw apiError;
    }
  },

  updateProduct: async (id: number, payload: AdminUpdateProductRequest) => {
    set({ isLoading: true, error: null, message: null });
    
    try {
      const response = await productService.updateProduct(id, payload);
      
      
      set(state => {
        if (state.adminProducts?.products) {
          const updatedProducts = state.adminProducts.products.map(product => 
            product.id === id ? { ...product, ...payload } : product
          );
          return {
            ...state,
            adminProducts: {
              ...state.adminProducts,
              products: updatedProducts
            },
            isLoading: false,
            error: null,
            message: response.message || 'Product updated successfully',
          };
        }
        return { ...state, isLoading: false, error: null, message: null };
      });
      
      return response;
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({
        isLoading: false,
        error: apiError,
        message: null,
      });
      throw apiError;
    }
  },

  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null, message: null });
    
    try {
      const response = await productService.deleteProduct(id);
      
      
      set(state => {
        if (state.adminProducts?.products) {
          const updatedProducts = state.adminProducts.products.filter(product => product.id !== id);
          return {
            ...state,
            adminProducts: {
              ...state.adminProducts,
              products: updatedProducts,
              pagination: {
                ...state.adminProducts.pagination,
                total: state.adminProducts.pagination.total - 1
              }
            },
            isLoading: false,
            error: null,
            message: response.message || 'Product deleted successfully',
          };
        }
        return { ...state, isLoading: false, error: null, message: null };
      });
      
      return response;
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({
        isLoading: false,
        error: apiError,
        message: null,
      });
      throw apiError;
    }
  },
}));
