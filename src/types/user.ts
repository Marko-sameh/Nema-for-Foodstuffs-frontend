export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  isDefault: boolean;
}
