import httpClient, { type ApiResponse } from './httpClient';

export type DateYmd = string; 

export type ExportReportFormat = 'excel' | 'pdf';
export type ExportReportType = 'users' | 'orders' | 'activity';

export type UsersReportQuery = {
  start_date?: DateYmd;
  end_date?: DateYmd;
  page?: number;
  limit?: number;
};

export type UsersReportUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export type UsersReportData = {
  users: UsersReportUser[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  filters: {
    start_date?: DateYmd | null;
    end_date?: DateYmd | null;
  };
};

export type OrdersReportQuery = {
  start_date?: DateYmd;
  end_date?: DateYmd;
  status?: 'pending' | 'approved' | 'rejected' | 'delivered';
  payment_status?: 'pending' | 'paid' | 'failed';
  page?: number;
  limit?: number;
};

export type OrdersReportOrder = {
  id: number;
  user_id: number;
  total_amount: number | string;
  status: 'pending' | 'approved' | 'rejected' | 'delivered' | string;
  payment_status: 'pending' | 'paid' | 'failed' | string;
  payment_method: string;
  created_at: string;
};

export type OrdersReportData = {
  orders: OrdersReportOrder[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  filters: {
    start_date?: DateYmd | null;
    end_date?: DateYmd | null;
    status?: string | null;
    payment_status?: string | null;
  };
};

export type ActivityReportQuery = {
  start_date?: DateYmd;
  end_date?: DateYmd;
  user_id?: number;
  action?: string;
  page?: number;
  limit?: number;
};

export type ActivityReportActivity = {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: number;
  ip_address?: string | null;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
};

export type ActivityReportData = {
  activities: ActivityReportActivity[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  filters: {
    start_date?: DateYmd | null;
    end_date?: DateYmd | null;
    user_id?: number | null;
    action?: string | null;
  };
};

export type ExportReportPayload = {
  report_type: ExportReportType;
  format: ExportReportFormat;
  start_date?: DateYmd;
  end_date?: DateYmd;
  status?: 'pending' | 'approved' | 'rejected' | 'delivered';
  payment_status?: 'pending' | 'paid' | 'failed';
  user_id?: number;
  action?: string;
};

export type ExportReportResponse = Blob;


export const reportService = {
  getUsersReport: async (
    params?: UsersReportQuery,
  ): Promise<ApiResponse<UsersReportData>> => {
    return httpClient.get<UsersReportData>('/admin/reports/users', params);
  },

  getOrdersReport: async (
    params?: OrdersReportQuery,
  ): Promise<ApiResponse<OrdersReportData>> => {
    return httpClient.get<OrdersReportData>('/admin/reports/orders', params);
  },

  getActivityReport: async (
    params?: ActivityReportQuery,
  ): Promise<ApiResponse<ActivityReportData>> => {
    return httpClient.get<ActivityReportData>('/admin/reports/activity', params);
  },

  exportReport: async (payload: ExportReportPayload): Promise<ExportReportResponse> => {
    const res = await httpClient.axiosInstance.post<Blob>(
      '/admin/reports/export',
      payload,
      {
        responseType: 'blob',
        headers: {
          'Accept': payload.format === 'excel' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,*/*'
            : 'application/pdf,*/*'
        }
      },
    );
    return res.data;
  },
};

