import { create } from 'zustand';
import { paymentService } from '../api/paymentService';
import type {
  DpoCreateData,
  DpoCreateRequest,
  DpoVerifyData,
  DpoVerifyRequest,
  FlutterwavePayData,
  FlutterwavePayRequest,
  FlutterwaveVerifyData,
  InitiatePaymentData,
  InitiatePaymentRequest,
  MpesaStatusData,
  MpesaStkPushData,
  MpesaStkPushRequest,
  PaymentFailedData,
  PaymentMethodInfo,
  PaymentMethodsData,
  PaymentStatusData,
  PaymentSuccessData,
  PaymentSuccessQuery,
  PesapalCreateData,
  PesapalCreateRequest,
  PesapalStatusData,
  VerifyPaymentData,
  VerifyPaymentRequest,
} from '../api/paymentService';
import type { ApiError, ApiResponse } from '../api/httpClient';

type PaymentStoreState = {
  paymentMethods: PaymentMethodInfo[] | null;

  genericPaymentStatus: PaymentStatusData | null;
  mpesaPaymentStatus: MpesaStatusData | null;
  pesapalPaymentStatus: PesapalStatusData | null;

  initiatedPayment: InitiatePaymentData | null;
  verifiedPayment: VerifyPaymentData | null;

  mpesaStkPushResult: MpesaStkPushData | null;
  flutterwavePayResult: FlutterwavePayData | null;
  flutterwaveVerifyResult: FlutterwaveVerifyData | null;
  dpoCreateResult: DpoCreateData | null;
  dpoVerifyResult: DpoVerifyData | null;
  pesapalCreateResult: PesapalCreateData | null;

  successPayload: PaymentSuccessData | null;
  failedPayload: PaymentFailedData | null;

  isLoading: boolean;
  error: ApiError | null;
  message: string | null;

  getPaymentMethods: () => Promise<ApiResponse<PaymentMethodsData>>;
  getPaymentStatus: (paymentId: number) => Promise<ApiResponse<PaymentStatusData>>;

  initiate: (payload: InitiatePaymentRequest) => Promise<ApiResponse<InitiatePaymentData>>;
  verify: (payload: VerifyPaymentRequest) => Promise<ApiResponse<VerifyPaymentData>>;

  mpesaStkPush: (payload: MpesaStkPushRequest) => Promise<ApiResponse<MpesaStkPushData>>;
  mpesaStatus: (paymentId: number) => Promise<ApiResponse<MpesaStatusData>>;

  flutterwavePay: (payload: FlutterwavePayRequest) => Promise<ApiResponse<FlutterwavePayData>>;
  flutterwaveVerify: (reference: string) => Promise<ApiResponse<FlutterwaveVerifyData>>;

  dpoCreate: (payload: DpoCreateRequest) => Promise<ApiResponse<DpoCreateData>>;
  dpoVerify: (payload: DpoVerifyRequest) => Promise<ApiResponse<DpoVerifyData>>;

  pesapalCreate: (payload: PesapalCreateRequest) => Promise<ApiResponse<PesapalCreateData>>;
  pesapalStatus: (orderTrackingId: string) => Promise<ApiResponse<PesapalStatusData>>;
  pesapalStatusByPaymentId: (paymentId: number) => Promise<ApiResponse<PesapalStatusData>>;

  paymentSuccess: (query: PaymentSuccessQuery) => Promise<ApiResponse<PaymentSuccessData>>;
  paymentFailed: () => Promise<ApiResponse<PaymentFailedData>>;
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

export const usePaymentStore = create<PaymentStoreState>((set) => ({
  paymentMethods: null,

  genericPaymentStatus: null,
  mpesaPaymentStatus: null,
  pesapalPaymentStatus: null,

  initiatedPayment: null,
  verifiedPayment: null,

  mpesaStkPushResult: null,
  flutterwavePayResult: null,
  flutterwaveVerifyResult: null,
  dpoCreateResult: null,
  dpoVerifyResult: null,
  pesapalCreateResult: null,

  successPayload: null,
  failedPayload: null,

  isLoading: false,
  error: null,
  message: null,

  getPaymentMethods: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.getPaymentMethods();
      set({
        paymentMethods: res.data?.payment_methods ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  getPaymentStatus: async (paymentId) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.getPaymentStatus(paymentId);
      set({
        genericPaymentStatus: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  initiate: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.initiate(payload);
      set({
        initiatedPayment: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  verify: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.verify(payload);
      set({
        verifiedPayment: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  mpesaStkPush: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.mpesaStkPush(payload);
      set({
        mpesaStkPushResult: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  mpesaStatus: async (paymentId) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.mpesaStatus(paymentId);
      set({
        mpesaPaymentStatus: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  flutterwavePay: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.flutterwavePay(payload);
      set({
        flutterwavePayResult: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  flutterwaveVerify: async (reference) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.flutterwaveVerify(reference);
      set({
        flutterwaveVerifyResult: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  dpoCreate: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.dpoCreate(payload);
      set({
        dpoCreateResult: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  dpoVerify: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.dpoVerify(payload);
      set({
        dpoVerifyResult: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  pesapalCreate: async (payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.pesapalCreate(payload);
      set({
        pesapalCreateResult: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  pesapalStatus: async (orderTrackingId) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.pesapalStatus(orderTrackingId);
      set({
        pesapalPaymentStatus: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  pesapalStatusByPaymentId: async (paymentId) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.pesapalStatusByPaymentId(paymentId);
      set({
        pesapalPaymentStatus: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  paymentSuccess: async (query) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.paymentSuccess(query);
      set({
        successPayload: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },

  paymentFailed: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await paymentService.paymentFailed();
      set({
        failedPayload: res.data ?? null,
        message: res.message ?? null,
        isLoading: false,
      });
      return res;
    } catch (e) {
      const apiError = normalizeApiError(e);
      set({ error: apiError, isLoading: false });
      throw apiError;
    }
  },
}));

