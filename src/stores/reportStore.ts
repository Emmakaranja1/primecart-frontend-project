import { create } from 'zustand';
import { reportService } from '../api/reportService';
import type {
  ActivityReportData,
  ActivityReportQuery,
  ExportReportPayload,
  OrdersReportData,
  OrdersReportQuery,
  UsersReportData,
  UsersReportQuery,
} from '../api/reportService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type ReportStoreState = {
  usersReport: UsersReportData | null;
  ordersReport: OrdersReportData | null;
  activityReport: ActivityReportData | null;
  exportedBlob: Blob | null;

  isLoading: boolean;
  error: ApiError | null;
  message: string | null;
  exportProgress: number | null;

  getUsersReport: (params?: UsersReportQuery) => Promise<ApiResponse<UsersReportData>>;
  getOrdersReport: (params?: OrdersReportQuery) => Promise<ApiResponse<OrdersReportData>>;
  getActivityReport: (
    params?: ActivityReportQuery,
  ) => Promise<ApiResponse<ActivityReportData>>;

  exportReport: (payload: ExportReportPayload, onProgress?: (progress: number) => void) => Promise<Blob>;
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

export const useReportStore = create<ReportStoreState>((set) => ({
  usersReport: null,
  ordersReport: null,
  activityReport: null,
  exportedBlob: null,

  isLoading: false,
  error: null,
  message: null,
  exportProgress: null,

  getUsersReport: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await reportService.getUsersReport(params);
      set({ usersReport: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  getOrdersReport: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await reportService.getOrdersReport(params);
      set({ ordersReport: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  getActivityReport: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await reportService.getActivityReport(params);
      set({ activityReport: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  exportReport: async (payload, onProgress) => {
    set({ isLoading: true, error: null, message: null, exportProgress: 0 });
    try {
      const blob = await reportService.exportReport(payload, (progress) => {
        set({ exportProgress: progress });
        onProgress?.(progress);
      });
      set({ exportedBlob: blob, message: 'Report exported', isLoading: false, exportProgress: null });
      return blob;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false, exportProgress: null });
      throw apiError;
    }
  },
}));

