export const CATEGORIES = [
  { label: 'Electronics', value: 'Electronics', icon: '📱' },
  { label: 'Fashion', value: 'Fashion', icon: '👕' },
  { label: 'Home', value: 'Home', icon: '🏠' },
  { label: 'Accessories', value: 'Accessories', icon: '⌚' },
  { label: 'Gaming', value: 'Gaming', icon: '🎮' },
];

export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
];

export const PAYMENT_METHODS = [
  { id: 'MPESA', label: 'M-PESA', icon: '📱', description: 'Pay via M-PESA STK push' },
  { id: 'Flutterwave', label: 'Flutterwave', icon: '💳', description: 'Card & mobile money' },
  { id: 'DPO', label: 'DPO Pay', icon: '🌍', description: 'DPO payment gateway' },
  { id: 'PesaPal', label: 'PesaPal', icon: '💰', description: 'PesaPal payment' },
] as const;