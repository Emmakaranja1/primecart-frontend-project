export type Product = {
  id: number;
  title: string;
  description?: string | null;
  price: number | string;
  quantity?: number | string;
  category?: string | null;
  brand?: string | null;
  image?: string | null;
  is_active?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProductFilters = {
  search: string;
  category: string;
  brand: string;
  min_price: string;
  max_price: string;
  featured: boolean;
  page: number;
};