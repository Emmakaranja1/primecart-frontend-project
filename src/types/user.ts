export type UserProfile = {
  id: number;
  username: string;
  email: string;
  role: string;
  phone_number?: string | null;
  address?: string | null;
  status: string;
  email_verified_at?: string | null;
};

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  phone_number?: string | null;
  address?: string | null;
  status: string;
};

export type AdminActivityLog = {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: number;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
};