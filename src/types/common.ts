export type PaginationMeta = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type SelectOption = { label: string; value: string };
export type ToastType = 'success' | 'error' | 'info' | 'warning';