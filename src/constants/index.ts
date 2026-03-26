export const APP_NAME = 'LuxeCommerce';
export const APP_DESCRIPTION = 'Premium eCommerce platform for high-end products.';

export const CATEGORIES = [
  { label: 'Electronics', value: 'Electronics', icon: 'laptop' },
  { label: 'Fashion', value: 'Fashion', icon: 'shirt' },
  { label: 'Home', value: 'Home', icon: 'sofa' },
  { label: 'Beauty', value: 'Beauty', icon: 'sparkles' },
  { label: 'Sports', value: 'Sports', icon: 'dumbbell' },
];

export const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'MPESA', description: 'Pay via Safaricom M-Pesa' },
  { id: 'flutterwave', name: 'Flutterwave', description: 'Pay via Card or Mobile Money' },
  { id: 'pesapal', name: 'PesaPal', description: 'Pay via PesaPal' },
  { id: 'dpo', name: 'DPO', description: 'Pay via DPO Group' },
];

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { id: 'processing', label: 'Processing', color: 'bg-blue-500' },
  { id: 'shipped', label: 'Shipped', color: 'bg-purple-500' },
  { id: 'delivered', label: 'Delivered', color: 'bg-green-500' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

export const PAYMENT_STATUSES = [
  { id: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { id: 'paid', label: 'Paid', color: 'bg-green-500' },
  { id: 'failed', label: 'Failed', color: 'bg-red-500' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-gray-500' },
];