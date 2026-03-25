import httpClient, { type ApiResponse } from './httpClient';

export type PaymentMethod = 'MPESA' | 'Flutterwave' | 'DPO' | 'PesaPal';

export type PlaceOrderRequest = {
  payment_method: PaymentMethod;
  shipping_address: string;
};

export type PlacedOrderData = {
  order_id: number;
  transaction_reference: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
};

export type OrderListItem = {
  id: number;
  transaction_reference: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items_count: number;
};

export type OrderListData = {
  orders: OrderListItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type OrderProduct = {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
};

export type OrderItem = {
  id: number;
  product: OrderProduct;
  quantity: number;
  price: number | string;
  subtotal: number | string;
};

export type OrderDetailsData = {
  order: {
    id: number;
    transaction_reference: string;
    total_amount: number | string;
    status: string;
    payment_status: string;
    payment_method: string;
    shipping_address: string;
    created_at: string;
    approved_at?: string | null;
    delivered_at?: string | null;
  };
  items: OrderItem[];
};

export type OrderListQuery = {
  per_page?: number;
};

export type AdminOrderListQuery = {
  search?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'delivered';
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_method?: PaymentMethod;
  start_date?: string; // `Y-m-d`
  end_date?: string; // `Y-m-d`
  page?: number;
  limit?: number;
};

export type AdminOrderListItem = {
  id: number;
  transaction_reference: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  total_amount: number | string;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items_count: number;
};

export type AdminOrderListData = {
  orders: AdminOrderListItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  filters: {
    search?: string | null;
    status?: string | null;
    payment_status?: string | null;
    payment_method?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  };
};

export const orderService = {
  placeOrder: async (payload: PlaceOrderRequest): Promise<ApiResponse<PlacedOrderData>> => {
    return httpClient.post<PlacedOrderData>('/orders', payload);
  },

  getOrders: async (params?: OrderListQuery): Promise<ApiResponse<OrderListData>> => {
    return httpClient.get<OrderListData>('/orders', params);
  },

  getOrderById: async (id: number): Promise<ApiResponse<OrderDetailsData>> => {
    return httpClient.get<OrderDetailsData>(`/orders/${id}`);
  },

  listAdminOrders: async (params?: AdminOrderListQuery): Promise<ApiResponse<AdminOrderListData>> => {
    return httpClient.get<AdminOrderListData>('/admin/orders', params);
  },
};

