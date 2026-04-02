import httpClient, { type ApiResponse } from './httpClient';

export type CartProduct = {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
};

export type CartItem = {
  id: number;
  product: CartProduct;
  quantity: number;
  price: number | string;
  subtotal: number | string;
};

export type CartData = {
  cart_items: CartItem[];
  total_price: number | string;
  total_items: number;
};

export type AddToCartRequest = {
  product_id: number;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};

export type CartMutationResponse = ApiResponse<never>;

export const cartService = {
  addToCart: async (payload: AddToCartRequest): Promise<CartMutationResponse> => {
    return httpClient.post<never>('/cart/add', payload);
  },

  getCart: async (): Promise<ApiResponse<CartData>> => {
    return httpClient.get<CartData>('/cart');
  },

  updateCartItem: async (
    id: number,
    payload: UpdateCartItemRequest,
  ): Promise<CartMutationResponse> => {
    return httpClient.post<never>(`/cart/${id}`, payload);
  },

  removeCartItem: async (id: number): Promise<CartMutationResponse> => {
    return httpClient.delete<never>(`/cart/${id}`);
  },
};

