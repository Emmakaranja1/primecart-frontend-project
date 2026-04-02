import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse } from 'axios';

export interface ApiError {
  success: false;
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
};

type ZustandAuthStoreShape = {
  token?: string;
  logout?: () => void;
};

type WindowWithZustand = Window & {
  __ZUSTAND_STORE__?: {
    getState?: () => unknown;
  };
};

class HttpClient {
  private readonly instance: AxiosInstance;

  constructor() {
    const apiBaseFromEnv = import.meta.env.VITE_API_BASE_URL;

    if (!apiBaseFromEnv) {
      
      throw new Error('Missing `VITE_API_BASE_URL` environment variable.');
    }

    
    const host = apiBaseFromEnv.replace(/\/+$/, '');
    const baseURL = host.endsWith('/api') ? host : `${host}/api`;

    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private getAuthStoreFromZustand(): ZustandAuthStoreShape | null {
    try {
      const root = (window as WindowWithZustand).__ZUSTAND_STORE__;
      const state = root?.getState?.();
      const stateObj = state && typeof state === 'object' ? (state as Record<string, unknown>) : null;
      const authStoreUnknown = stateObj?.authStore;
      if (!authStoreUnknown || typeof authStoreUnknown !== 'object') return null;
      return authStoreUnknown as ZustandAuthStoreShape;
    } catch {
      return null;
    }
  }

  private getToken(): string | null {
    const authStore = this.getAuthStoreFromZustand();
    const tokenFromStore = authStore?.token;
    if (tokenFromStore) return tokenFromStore;

    
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  private setupRequestInterceptor(): void {
    this.instance.interceptors.request.use((config) => {
      const token = this.getToken();
      
      
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        headers: config.headers
      });
      
      if (!token) {
        console.warn('No authentication token found for request:', config.url);
        return config;
      }

      const headers = config.headers;
      const maybeHeadersWithSet = headers as unknown as { set?: unknown };
      if (maybeHeadersWithSet?.set && typeof maybeHeadersWithSet.set === 'function') {
        
        (maybeHeadersWithSet as { set: (name: string, value: string) => unknown }).set(
          'Authorization',
          `Bearer ${token}`,
        );
      } else {
        
        const requestHeaders = (headers ?? {}) as AxiosRequestHeaders;
        requestHeaders.Authorization = `Bearer ${token}`;
        config.headers = requestHeaders;
      }
      
      console.log('Request with auth:', {
        url: config.url,
        method: config.method,
        authHeader: config.headers?.Authorization
      });
      
      return config;
    });
  }

  private setupResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        
        if (response.config.responseType === 'blob') {
          return response;
        }
        return response;
      },
      (error: AxiosError) => {
        
        if (error.config?.responseType === 'blob' && error.response?.data instanceof Blob) {
          return new Promise<never>((_, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const errorText = reader.result as string;
                const errorObj = JSON.parse(errorText);
                reject(this.normalizeError({ 
                  ...error, 
                  response: error.response ? { ...error.response, data: errorObj } : undefined
                } as AxiosError));
              } catch {
                reject(error);
              }
            };
            reader.onerror = () => reject(error);
            if (error.response) {
              reader.readAsText(error.response.data as Blob);
            } else {
              reject(error);
            }
          });
        }
        
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data
    };
    
    console.error('API Error Details:', errorDetails);

    if (!error.response) {
      return {
        success: false,
        message: 'Network error. Please check your internet connection.',
      };
    }

    const { status, data } = error.response;
    const payload = data as unknown;
    const payloadObj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;

    
    if (status === 422 && payloadObj?.errors) {
      console.error('Validation Errors:', payloadObj.errors);
    }
    
    
    if (status === 400) {
      console.error('400 Bad Request Details:', {
        message: payloadObj?.message,
        errors: payloadObj?.errors,
        debug: payloadObj?.debug
      });
    }

    const message =
      typeof payloadObj?.message === 'string'
        ? payloadObj.message
        : this.getDefaultErrorMessage(status);

    const errors =
      payloadObj?.errors && typeof payloadObj.errors === 'object'
        ? (payloadObj.errors as Record<string, string[]>)
        : undefined;

    return {
      success: false,
      message,
      status,
      errors,
    };
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad request';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource not found';
      case 422:
        return 'Validation error';
      case 429:
        return 'Too many requests';
      case 500:
        return 'Internal server error';
      case 502:
        return 'Bad gateway';
      case 503:
        return 'Service unavailable';
      default:
        return 'An error occurred';
    }
  }

  private handleUnauthorized(): void {
    try {
      
      try {
        localStorage.removeItem('token');
      } catch {
        
      }

      const authStore = this.getAuthStoreFromZustand();
      authStore?.logout?.();
    } finally {
      
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  public async get<T = unknown>(url: string, params?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, { params });
    return response.data as ApiResponse<T>;
  }

  public async post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data);
    return response.data as ApiResponse<T>;
  }

  public async put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data);
    return response.data as ApiResponse<T>;
  }

  public async patch<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data);
    return response.data as ApiResponse<T>;
  }

  public async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data as ApiResponse<T>;
  }

  
  public async postBlob(url: string, data?: unknown, onProgress?: (progress: number) => void): Promise<Blob> {
    const response = await this.instance.post(url, data, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,*/*'
      },
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
    return response.data;
  }

  
  public get axiosInstance(): AxiosInstance {
    return this.instance;
  }
}


const httpClient = new HttpClient();
export default httpClient;

export { HttpClient };