export type PaymentGateway = 'MPESA' | 'Flutterwave' | 'DPO' | 'PesaPal';

export type PaymentMethodInfo = {
  name: PaymentGateway;
  display_name: string;
  description: string;
  currencies: string[];
  requires_phone: boolean;
  requires_email: boolean;
  active: boolean;
};

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

export type InitiatePaymentData = {
  payment_id: number;
  transaction_id: string;
  gateway: string;
  amount: number | string;
  currency: string;
  status: string;
  gateway_response: unknown;
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

export type PaymentInitiateResponse = {
  success: boolean;
  message: string;
  data: InitiatePaymentData;
};

export type PaymentVerificationResponse = {
  success: boolean;
  message: string;
  data: VerifyPaymentData;
};