// src/types/user.ts
export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  rol: string;
  foto: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol_id: number;
}

export interface UpdateUserData {
  nombre?: string;
  email?: string;
  telefono?: string;
  rol_id?: number;
  activo?: boolean;
}

export interface UserFilters {
  search?: string;
  rol?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}