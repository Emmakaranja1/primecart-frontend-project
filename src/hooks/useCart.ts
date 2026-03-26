import { useCartStore } from '../stores/cartStore';

export function useCart() {
  const { 
    cart, 
    isLoading, 
    error,
    getCart, 
    addToCart, 
    updateCartItem, 
    removeCartItem 
  } = useCartStore();

  return {
    cart,
    items: cart?.cart_items || [],
    totalAmount: Number(cart?.total_price) || 0,
    totalQuantity: cart?.total_items || 0,
    isLoading,
    error,
    getCart,
    addItem: addToCart,
    updateItem: updateCartItem,
    removeItem: removeCartItem,
    clearCart: async () => {
      // Placeholder for clearCart
    }
  };
}