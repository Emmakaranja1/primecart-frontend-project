import httpClient, { type ApiResponse } from './httpClient';

type ApiUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status?: string;
};

export type AuthRegisterRequest = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number?: string;
  address?: string;
};

export type AuthRegisterResponse = {
  user: ApiUser;
  token: string;
  token_type: 'bearer' | string;
  expires_in: number;
};

export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthLoginResponse = AuthRegisterResponse;

export type AuthAdminLoginRequest = {
  email: string;
  password: string;
};

export type AuthAdminLoginResponse = AuthRegisterResponse;

export type AuthForgotPasswordRequest = {
  email: string;
};

export type AuthVerifyOtpRequest = {
  email: string;
  otp: string;
};

export type AuthResetPasswordRequest = {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
};

export type LogoutResponse = ApiResponse<never>;

export type AuthService = {
  register: (payload: AuthRegisterRequest) => Promise<ApiResponse<never> & AuthRegisterResponse>;
  login: (payload: AuthLoginRequest) => Promise<ApiResponse<never> & AuthLoginResponse>;
  adminLogin: (
    payload: AuthAdminLoginRequest,
  ) => Promise<ApiResponse<never> & AuthAdminLoginResponse>;
  forgotPassword: (payload: AuthForgotPasswordRequest) => Promise<ApiResponse<never>>;
  verifyOtp: (payload: AuthVerifyOtpRequest) => Promise<ApiResponse<never>>;
  resetPassword: (payload: AuthResetPasswordRequest) => Promise<ApiResponse<never>>;
  logout: () => Promise<LogoutResponse>;
};

export const authService: AuthService = {
  async register(payload) {
    const res = await httpClient.post<unknown>('/auth/register', payload);
    return res as ApiResponse<never> & AuthRegisterResponse;
  },

  async login(payload) {
    const res = await httpClient.post<unknown>('/auth/login', payload);
    return res as ApiResponse<never> & AuthLoginResponse;
  },

  async adminLogin(payload) {
    const res = await httpClient.post<unknown>('/auth/admin/login', payload);
    return res as ApiResponse<never> & AuthAdminLoginResponse;
  },

  async forgotPassword(payload) {
    return httpClient.post<never>('/auth/forgot-password', payload);
  },

  async verifyOtp(payload) {
    return httpClient.post<never>('/auth/verify-otp', payload);
  },

  async resetPassword(payload) {
    return httpClient.post<never>('/auth/reset-password', payload);
  },

  async logout() {
    return httpClient.post<never>('/auth/logout');
  },
};

