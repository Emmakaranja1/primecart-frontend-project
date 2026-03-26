export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status?: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
  token_type: 'bearer' | string;
  expires_in: number;
};