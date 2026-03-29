import { create } from 'zustand';
import { authService } from '../api/authService';
import type {
  AuthAdminLoginRequest,
  AuthForgotPasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthResetPasswordRequest,
  AuthVerifyOtpRequest,
} from '../api/authService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status?: string;
};

type AuthRegisterResult = ApiResponse<never> & AuthRegisterResponse;
type AuthLoginResult = AuthRegisterResult;
type AuthAdminLoginResult = AuthRegisterResult;

type WindowWithZustand = Window & {
  __ZUSTAND_STORE__?: {
    getState?: () => { authStore?: AuthStoreState };
  };
};

type AuthStoreState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  isLoading: boolean;
  error: ApiError | null;
  message: string | null;

  register: (payload: AuthRegisterRequest) => Promise<AuthRegisterResult>;
  login: (payload: AuthLoginRequest) => Promise<AuthLoginResult>;
  adminLogin: (payload: AuthAdminLoginRequest) => Promise<AuthAdminLoginResult>;

  forgotPassword: (payload: AuthForgotPasswordRequest) => Promise<ApiResponse<never>>;
  verifyOtp: (payload: AuthVerifyOtpRequest) => Promise<ApiResponse<never>>;
  resetPassword: (payload: AuthResetPasswordRequest) => Promise<ApiResponse<never>>;

  logout: () => Promise<void>;
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

  return {
    success: false,
    message: 'Request failed',
  };
}

function loadTokenFromStorage(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStoreState>((set, get) => {
  const initialToken = loadTokenFromStorage();

  return {
    token: initialToken,
    user: null,
    isAuthenticated: Boolean(initialToken),

    isLoading: false,
    error: null,
    message: null,

    register: async (payload) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await authService.register(payload);

        
        set({
          isLoading: false,
        });

        return res as AuthRegisterResult;
      } catch (e) {
        const apiError = normalizeApiError(e);
        set({ error: apiError, isLoading: false });
        throw apiError;
      }
    },

    login: async (payload) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await authService.login(payload);

        try {
          localStorage.setItem('token', res.token);
        } catch {
          
        }

        set({
          token: res.token,
          user: res.user as AuthUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return res as AuthLoginResult;
      } catch (e) {
        const apiError = normalizeApiError(e);
        set({ error: apiError, isLoading: false });
        throw apiError;
      }
    },

    adminLogin: async (payload) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await authService.adminLogin(payload);

        try {
          localStorage.setItem('token', res.token);
        } catch {
          
        }

        set({
          token: res.token,
          user: res.user as AuthUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return res as AuthAdminLoginResult;
      } catch (e) {
        const apiError = normalizeApiError(e);
        set({ error: apiError, isLoading: false });
        throw apiError;
      }
    },

    forgotPassword: async (payload) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await authService.forgotPassword(payload);
        set({ isLoading: false, message: res.message ?? null });
        return res;
      } catch (e) {
        const apiError = normalizeApiError(e);
        set({ error: apiError, isLoading: false });
        throw apiError;
      }
    },

    verifyOtp: async (payload) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await authService.verifyOtp(payload);
        set({ isLoading: false, message: res.message ?? null });
        return res;
      } catch (e) {
        const apiError = normalizeApiError(e);
        set({ error: apiError, isLoading: false });
        throw apiError;
      }
    },

    resetPassword: async (payload) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await authService.resetPassword(payload);
        set({ isLoading: false, message: res.message ?? null });
        return res;
      } catch (e) {
        const apiError = normalizeApiError(e);
        set({ error: apiError, isLoading: false });
        throw apiError;
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null, message: null });
      
      try {
        await authService.logout();
      } catch (e) {
        
        const apiError = normalizeApiError(e);
        set({ error: apiError });
      } finally {
        
        const currentUser = get().user;
        
        try {
          localStorage.removeItem('token');
        } catch {
          
        }

        set({ token: null, user: null, isAuthenticated: false, isLoading: false, message: null });

        
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          
          
          if (!currentUser?.role?.includes('admin') || currentPath !== '/') {
            window.location.href = '/';
          }
        }
      }
    },
  };
});


if (typeof window !== 'undefined') {
  const win = window as WindowWithZustand;
  win.__ZUSTAND_STORE__ = {
    getState: () => ({
      authStore: useAuthStore.getState(),
    }),
  };
}

