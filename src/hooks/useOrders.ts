import { useOrderStore } from '../stores/orderStore';

export function useOrders() {
  const { 
    publicOrders, 
    publicOrderDetails, 
    isLoading, 
    error,
    getOrders, 
    getOrderById, 
    placeOrder, 
    listAdminOrders 
  } = useOrderStore();

  return {
    orders: publicOrders?.orders || [],
    orderDetails: publicOrderDetails || null,
    isLoading,
    error,
    getOrders,
    getOrderDetails: getOrderById,
    placeOrder,
    // Admin actions
    listAdminOrders
  };
}