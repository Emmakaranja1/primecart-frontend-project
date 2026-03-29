import { create } from 'zustand';
import { orderService } from '../api/orderService';
import type {
  AdminOrderListData,
  AdminOrderListQuery,
  OrderDetailsData,
  OrderListData,
  OrderListQuery,
  PlaceOrderRequest,
  PlacedOrderData,
  UpdateOrderStatusRequest,
  UpdateOrderStatusData,
} from '../api/orderService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type OrderStoreState = {
  placedOrder: PlacedOrderData | null;
  publicOrders: OrderListData | null;
  publicOrderDetails: OrderDetailsData | null;
  adminOrders: AdminOrderListData | null;

  isLoading: boolean;
  error: ApiError | null;
  message: string | null;

  placeOrder: (payload: PlaceOrderRequest) => Promise<ApiResponse<PlacedOrderData>>;
  getOrders: (params?: OrderListQuery) => Promise<ApiResponse<OrderListData>>;
  getOrderById: (id: number) => Promise<ApiResponse<OrderDetailsData>>;
  listAdminOrders: (params?: AdminOrderListQuery) => Promise<ApiResponse<AdminOrderListData>>;
  updateOrderStatus: (id: number, payload: UpdateOrderStatusRequest) => Promise<ApiResponse<UpdateOrderStatusData>>;
  deleteOrder: (id: number) => Promise<ApiResponse<never>>;
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

export const useOrderStore = create<OrderStoreState>((set) => ({
  placedOrder: null,
  publicOrders: null,
  publicOrderDetails: null,
  adminOrders: null,

  isLoading: false,
  error: null,
  message: null,

  placeOrder: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await orderService.placeOrder(payload);
      set({ placedOrder: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  getOrders: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await orderService.getOrders(params);
      set({ publicOrders: res.data ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  getOrderById: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await orderService.getOrderById(id);
      set({ publicOrderDetails: res.data ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  listAdminOrders: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await orderService.listAdminOrders(params);
      set({ adminOrders: res.data ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  updateOrderStatus: async (id, payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await orderService.updateOrderStatus(id, payload);
      set({ message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  deleteOrder: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await orderService.deleteOrder(id);
      set({ message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },
}));

