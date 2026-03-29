import httpClient, { type ApiResponse } from './httpClient';

export type PaymentGateway = 'MPESA' | 'Flutterwave';

export type InitiatePaymentRequest = {
  order_id: number;
  gateway: PaymentGateway;
  phone_number?: string;
  email?: string;
  callback_url?: string;
};

export type InitiatePaymentData = {
  payment_id: number;
  transaction_id: string;
  gateway: string;
  amount: number | string;
  currency: string;
  status: string;
  gateway_response: unknown;
};

export type VerifyPaymentRequest = {
  payment_id: number;
  reference?: string;
};

export type VerifyPaymentData = {
  payment_id: number;
  transaction_id: string;
  gateway: string;
  status: string;
  amount: number | string;
  currency: string;
  paid_at: string | null;
  verification_result: unknown;
};

export type PaymentMethodInfo = {
  name: PaymentGateway;
  display_name: string;
  description: string;
  currencies: string[];
  requires_phone: boolean;
  requires_email: boolean;
  active: boolean;
};

export type PaymentMethodsData = {
  payment_methods: PaymentMethodInfo[];
};

export type PaymentStatusData = {
  payment: {
    id: number;
    transaction_id: string;
    gateway: PaymentGateway | string;
    status: string;
    amount: number | string;
    currency: string;
    paid_at: string | null;
    failed_at: string | null;
    failure_reason: string | null;
    created_at: string;
  };
  order: {
    id: number;
    transaction_reference: string;
    payment_status: string;
    status: string;
  };
};

export type MpesaStkPushRequest = {
  order_id: number;
  phone_number: string;
  callback_url?: string;
};

export type MpesaStkPushData = {
  payment_id: number;
  transaction_id: string;
  checkout_request_id: string;
  merchant_request_id: string;
  customer_message: string;
};

export type MpesaStatusData = {
  payment_id: number;
  transaction_id: string;
  status: string;
  amount: number | string;
  currency: string;
  paid_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  verification_result: unknown;
};

export type FlutterwavePayRequest = {
  order_id: number;
  email: string;
  callback_url?: string;
};

export type FlutterwavePayData = {
  payment_id: number;
  transaction_id: string;
  payment_link: string;
  flutterwave_id: string;
  customer_message: string;
};

export type FlutterwaveVerifyData = {
  payment_id: number;
  transaction_id: string;
  gateway_reference: string;
  status: string;
  amount: number | string;
  currency: string;
  paid_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  verification_result: unknown;
};

export type DpoCreateRequest = {
  order_id: number;
  email: string;
  callback_url?: string;
};

export type DpoCreateData = {
  payment_id: number;
  transaction_id: string;
  payment_url: string;
  trans_token: string;
  customer_message: string;
};

export type DpoVerifyRequest = {
  trans_token: string;
};

export type DpoVerifyData = {
  payment_id: number;
  transaction_id: string;
  status: string;
  amount: number | string;
  currency: string;
  paid_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  verification_result: unknown;
};

export type PesapalCreateRequest = {
  order_id: number;
  email: string;
  callback_url?: string;
};

export type PesapalCreateData = {
  payment_id: number;
  transaction_id: string;
  payment_url: string | null;
  order_tracking_id: string | null;
  merchant_reference: string | null;
  customer_message: string;
};

export type PesapalStatusData = {
  payment_id: number;
  transaction_id: string;
  status: string;
  amount: number | string;
  currency: string;
  paid_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  status_result: unknown;
};

export type PaymentSuccessQuery = {
  payment_id?: number;
};

export type PaymentSuccessData = {
  payment_id: number;
  transaction_id: string;
  amount: number | string;
  currency: string;
  paid_at: string | null;
};

export type PaymentFailedData = {
  retry_url: string;
  support_email: string;
};

export const paymentService = {
  initiate: async (payload: InitiatePaymentRequest): Promise<ApiResponse<InitiatePaymentData>> => {
    return httpClient.post<InitiatePaymentData>('/payment/initiate', payload);
  },

  verify: async (payload: VerifyPaymentRequest): Promise<ApiResponse<VerifyPaymentData>> => {
    return httpClient.post<VerifyPaymentData>('/payment/verify', payload);
  },

  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethodsData>> => {
    return httpClient.get<PaymentMethodsData>('/payment/methods');
  },

  getPaymentStatus: async (paymentId: number): Promise<ApiResponse<PaymentStatusData>> => {
    return httpClient.get<PaymentStatusData>(`/payment/status/${paymentId}`);
  },

  mpesaStkPush: async (payload: MpesaStkPushRequest): Promise<ApiResponse<MpesaStkPushData>> => {
    return httpClient.post<MpesaStkPushData>('/payment/mpesa/stk-push', payload);
  },

  mpesaStatus: async (paymentId: number): Promise<ApiResponse<MpesaStatusData>> => {
    return httpClient.get<MpesaStatusData>(`/payment/mpesa/status/${paymentId}`);
  },

  flutterwavePay: async (
    payload: FlutterwavePayRequest,
  ): Promise<ApiResponse<FlutterwavePayData>> => {
    return httpClient.post<FlutterwavePayData>('/payment/flutterwave/pay', payload);
  },

  flutterwaveVerify: async (reference: string): Promise<ApiResponse<FlutterwaveVerifyData>> => {
    return httpClient.get<FlutterwaveVerifyData>(`/payment/flutterwave/verify/${reference}`);
  },

  dpoCreate: async (payload: DpoCreateRequest): Promise<ApiResponse<DpoCreateData>> => {
    return httpClient.post<DpoCreateData>('/payment/dpo/create', payload);
  },

  dpoVerify: async (payload: DpoVerifyRequest): Promise<ApiResponse<DpoVerifyData>> => {
    return httpClient.post<DpoVerifyData>('/payment/dpo/verify', payload);
  },

  pesapalCreate: async (payload: PesapalCreateRequest): Promise<ApiResponse<PesapalCreateData>> => {
    return httpClient.post<PesapalCreateData>('/payment/pesapal/create', payload);
  },

  pesapalStatus: async (orderTrackingId: string): Promise<ApiResponse<PesapalStatusData>> => {
    return httpClient.get<PesapalStatusData>(`/payment/pesapal/status/${orderTrackingId}`);
  },

  
  pesapalStatusByPaymentId: async (paymentId: number): Promise<ApiResponse<PesapalStatusData>> => {
    const res = await httpClient.get<PaymentStatusData>(`/payment/status/${paymentId}`);
    if (!res.data) {
      
      throw new Error('Missing payment status response data');
    }

    const payment = res.data.payment;

    return {
      ...res,
      data: {
        payment_id: payment.id,
        transaction_id: payment.transaction_id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paid_at: payment.paid_at,
        failed_at: payment.failed_at,
        failure_reason: payment.failure_reason,
        status_result: null,
      } satisfies PesapalStatusData,
    };
  },

  paymentSuccess: async (query: PaymentSuccessQuery): Promise<ApiResponse<PaymentSuccessData>> => {
    return httpClient.get<PaymentSuccessData>('/payment/success', query);
  },

  paymentFailed: async (): Promise<ApiResponse<PaymentFailedData>> => {
    return httpClient.get<PaymentFailedData>('/payment/failed');
  },
};

