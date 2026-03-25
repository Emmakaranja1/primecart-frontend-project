import httpClient, { type ApiResponse } from './httpClient';

export type AdminActivityLogItem = {
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

export type AdminActivityLogsData = {
  logs: AdminActivityLogItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type AdminActivityLogsQuery = {
  user_id?: number;
  action?: string;
  start_date?: string; // Y-m-d format
  end_date?: string; // Y-m-d format
  page?: number;
  limit?: number;
};

export const activityLogService = {
  listAdminActivityLogs: async (
    params?: AdminActivityLogsQuery,
  ): Promise<ApiResponse<AdminActivityLogsData>> => {
    return httpClient.get<AdminActivityLogsData>('/admin/activity-logs', params);
  },
};

