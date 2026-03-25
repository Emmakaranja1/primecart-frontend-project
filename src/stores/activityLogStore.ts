import { create } from 'zustand';
import { activityLogService } from '../api/activityLogService';
import type {
  AdminActivityLogsData,
  AdminActivityLogsQuery,
} from '../api/activityLogService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type ActivityLogStoreState = {
  logs: AdminActivityLogsData | null;

  isLoading: boolean;
  error: ApiError | null;
  message: string | null;

  listAdminActivityLogs: (
    params?: AdminActivityLogsQuery,
  ) => Promise<ApiResponse<AdminActivityLogsData>>;
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

export const useActivityLogStore = create<ActivityLogStoreState>((set) => ({
  logs: null,
  isLoading: false,
  error: null,
  message: null,

  listAdminActivityLogs: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await activityLogService.listAdminActivityLogs(params);
      set({ logs: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },
}));

