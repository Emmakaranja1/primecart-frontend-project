import httpClient, { type ApiResponse } from './httpClient';

export type ProfileUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  phone_number?: string | null;
  address?: string | null;
  status: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileResponse = ApiResponse<never> & {
  user: ProfileUser;
};

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  phone_number?: string | null;
  address?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AdminUsersData = {
  users: AdminUser[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type AdminUserMutationResponse = ApiResponse<never> & {
  user: {
    id: number;
    username: string;
    email: string;
    status: string;
  };
};

export type AdminUsersQuery = {
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
};

export type AdminActivityLogItem = {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: number;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
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
  page?: number;
  limit?: number;
};

export type UpdateProfileRequest = {
  username?: string;
  email?: string;
  phone_number?: string;
  address?: string;
};

export type UpdateAddressRequest = {
  address: string;
};

export const userService = {
  getProfile: async (): Promise<ProfileResponse> => {
    return (await httpClient.get<never>('/auth/profile')) as ProfileResponse;
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<ProfileResponse> => {
    return (await httpClient.put<never>('/auth/profile', payload)) as ProfileResponse;
  },

  updateAddress: async (payload: UpdateAddressRequest): Promise<ProfileResponse> => {
    return (await httpClient.put<never>('/auth/address', payload)) as ProfileResponse;
  },

  listAdminUsers: async (params?: AdminUsersQuery): Promise<ApiResponse<AdminUsersData>> => {
    return httpClient.get<AdminUsersData>('/admin/users', params);
  },

  activateUser: async (id: number): Promise<AdminUserMutationResponse> => {
    const res = await httpClient.put<never>(`/admin/users/${id}/activate`);
    return res as AdminUserMutationResponse;
  },

  deactivateUser: async (id: number): Promise<AdminUserMutationResponse> => {
    const res = await httpClient.put<never>(`/admin/users/${id}/deactivate`);
    return res as AdminUserMutationResponse;
  },

  listAdminActivityLogs: async (
    params?: AdminActivityLogsQuery,
  ): Promise<ApiResponse<AdminActivityLogsData>> => {
    return httpClient.get<AdminActivityLogsData>('/admin/activity-logs', params);
  },
};

