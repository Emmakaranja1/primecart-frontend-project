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
  UpdateProfileRequest,
  UpdateAddressRequest,
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
  updateProfile: (payload: UpdateProfileRequest) => Promise<ProfileResponse>;
  updateAddress: (payload: UpdateAddressRequest) => Promise<ProfileResponse>;
  listAdminUsers: (params?: AdminUsersQuery) => Promise<ApiResponse<AdminUsersData>>;
  activateUser: (id: number) => Promise<AdminUserMutationResponse>;
  deactivateUser: (id: number) => Promise<AdminUserMutationResponse>;
  listAdminActivityLogs: (
    params?: AdminActivityLogsQuery,
  ) => Promise<ApiResponse<AdminActivityLogsData>>;
  deleteUser: (id: number) => Promise<ApiResponse<never>>;
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

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.updateProfile(payload);
      set({ profile: res.user ?? null, message: res.message ?? null, isLoading: false });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  updateAddress: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.updateAddress(payload);
      set({ profile: res.user ?? null, message: res.message ?? null, isLoading: false });
      return res;
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
      
      
      set(state => {
        if (state.adminUsers?.users) {
          const updatedUsers = state.adminUsers.users.map(user => 
            user.id === id ? { ...user, status: 'active' } : user
          );
          return {
            ...state,
            adminUsers: {
              ...state.adminUsers,
              users: updatedUsers
            },
            message: res.message ?? null,
            isLoading: false
          };
        }
        return { ...state, message: res.message ?? null, isLoading: false };
      });
      
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
      
      
      set(state => {
        if (state.adminUsers?.users) {
          const updatedUsers = state.adminUsers.users.map(user => 
            user.id === id ? { ...user, status: 'inactive' } : user
          );
          return {
            ...state,
            adminUsers: {
              ...state.adminUsers,
              users: updatedUsers
            },
            message: res.message ?? null,
            isLoading: false
          };
        }
        return { ...state, message: res.message ?? null, isLoading: false };
      });
      
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

  deleteUser: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await userService.deleteUser(id);
      
      
      set(state => {
        if (state.adminUsers?.users) {
          const updatedUsers = state.adminUsers.users.filter(user => user.id !== id);
          return {
            ...state,
            adminUsers: {
              ...state.adminUsers,
              users: updatedUsers,
              pagination: {
                ...state.adminUsers.pagination,
                total: state.adminUsers.pagination.total - 1
              }
            },
            message: res.message ?? null,
            isLoading: false
          };
        }
        return { ...state, message: res.message ?? null, isLoading: false };
      });
      
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },
}));

