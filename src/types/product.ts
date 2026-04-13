export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  sku: string | null;
  categoria: string | null;
  precio: number;
  stock: number;
  stock_minimo: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  nombre: string;
  descripcion?: string;
  sku?: string;
  categoria?: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
}

export interface UpdateProductData {
  nombre?: string;
  descripcion?: string | null;
  sku?: string | null;
  categoria?: string | null;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  activo?: boolean;
}

export interface ProductFilters {
  q?: string;
  categoria?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}
export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ fila: number; nombre: string; error: string }>;
  changes: Array<{
    id: number;
    nombre: string;
    cambios: string[];
    detalle: any;
  }>;
}
