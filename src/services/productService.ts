import api from './axios';
import type{ 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductFilters, 
  PaginatedResponse,
  ImportResult 
} from '../types/product';

export const productService = {
  // Listar productos con filtros
  list: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.categoria) params.append('categoria', filters.categoria);
    if (filters?.activo !== undefined) params.append('activo', String(filters.activo));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    const response = await api.get(`/productos?${params.toString()}`);
    return response.data;
  },

  // Obtener producto por ID
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/productos/${id}`);
    return response.data.data;
  },

  // Crear producto
  create: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post('/productos', data);
    return response.data.data;
  },

  // Actualizar producto
  update: async (id: number, data: UpdateProductData): Promise<Product> => {
    const response = await api.patch(`/productos/${id}`, data);
    return response.data.data;
  },

  // Eliminar producto
  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
  },

  // Exportar a CSV
  exportCsv: async (filters?: Omit<ProductFilters, 'page' | 'limit'>) => {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.categoria) params.append('categoria', filters.categoria);
    if (filters?.activo !== undefined) params.append('activo', String(filters.activo));
    
    const response = await api.get(`/productos/export?${params.toString()}`, {
      responseType: 'blob',
    });
    
    // Crear URL del blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `productos_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Importar desde CSV (archivo)
  importFromFile: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/productos/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Importar desde texto CSV
  importFromText: async (csvText: string): Promise<ImportResult> => {
    const response = await api.post('/productos/import', csvText, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
    return response.data;
  },

  // Obtener categorías únicas (para filtros)
  getUniqueCategories: async (): Promise<string[]> => {
    const response = await api.get('/productos');
    const categories = response.data.data
      .map((p: Product) => p.categoria)
      .filter((c: string | null, i: number, arr: (string | null)[]) => 
        c && arr.indexOf(c) === i
      );
    return categories;
  },
};