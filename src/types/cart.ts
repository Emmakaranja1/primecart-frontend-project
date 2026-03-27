import type { CartProduct } from '../api/cartService';

export type CartItem = {
  id: number;
  product: CartProduct;
  quantity: number;
  price: number | string;
  subtotal: number | string;
};

export type Cart = {
  cart_items: CartItem[];
  total_price: number | string;
  total_items: number;
};