import { create } from 'zustand';
import { cartService } from '../api/cartService';
import type { AddToCartRequest, CartData, CartMutationResponse, UpdateCartItemRequest } from '../api/cartService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type CartStoreState = {
  cart: CartData | null;
  isLoading: boolean;
  error: ApiError | null;
  message: string | null;

  getCart: () => Promise<ApiResponse<CartData>>;
  addToCart: (payload: AddToCartRequest) => Promise<CartMutationResponse>;
  updateCartItem: (id: number, payload: UpdateCartItemRequest) => Promise<CartMutationResponse>;
  removeCartItem: (id: number) => Promise<CartMutationResponse>;
};

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

export const useCartStore = create<CartStoreState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  message: null,

  getCart: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await cartService.getCart();
      set({ cart: res.data ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  addToCart: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await cartService.addToCart(payload);
      set({ message: res.message ?? null, isLoading: false });

      try {
        const cartRes = await cartService.getCart();
        set({ cart: cartRes.data ?? null });
      } catch {
        
      }

      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  updateCartItem: async (id, payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await cartService.updateCartItem(id, payload);
      set({ message: res.message ?? null, isLoading: false });

      try {
        const cartRes = await cartService.getCart();
        set({ cart: cartRes.data ?? null });
      } catch {
        
      }

      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  removeCartItem: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await cartService.removeCartItem(id);
      set({ message: res.message ?? null, isLoading: false });

      try {
        const cartRes = await cartService.getCart();
        set({ cart: cartRes.data ?? null });
      } catch {
        
      }

      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },
}));

