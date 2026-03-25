import { create } from 'zustand';
import { userService } from '../api/userService';
import type {
  AdminActivityLogsData,
  AdminActivityLogsQuery,
  AdminUserMutationResponse,
  AdminUsersData,
  AdminUsersQuery,
  ProfileResponse,
  ProfileUser,
} from '../api/userService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type UserStoreState = {
  profile: ProfileUser | null;
  adminUsers: AdminUsersData | null;
  adminActivityLogs: AdminActivityLogsData | null;

  isLoading: boolean;
  error: ApiError | null;
  message: string | null;

  getProfile: () => Promise<ProfileResponse>;
  listAdminUsers: (params?: AdminUsersQuery) => Promise<ApiResponse<AdminUsersData>>;
  activateUser: (id: number) => Promise<AdminUserMutationResponse>;
  deactivateUser: (id: number) => Promise<AdminUserMutationResponse>;
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

export const useUserStore = create<UserStoreState>((set) => ({
  profile: null,
  adminUsers: null,
  adminActivityLogs: null,

  isLoading: false,
  error: null,
  message: null,

  getProfile: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.getProfile();
      set({ profile: res.user ?? null, message: res.message ?? null, isLoading: false });
      return res as ProfileResponse;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  listAdminUsers: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.listAdminUsers(params);
      set({ adminUsers: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  activateUser: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.activateUser(id);
      set({ message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  deactivateUser: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.deactivateUser(id);
      set({ message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  listAdminActivityLogs: async (params) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.listAdminActivityLogs(params);
      set({ adminActivityLogs: res.data ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },
}));

