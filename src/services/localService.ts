import api from './axios';

export interface Local {
  id: number;
  nombre: string;
  direccion: string;
  ciudad?: string | null;
  estado?: string | null;
  codigo_postal?: string | null;
  telefono?: string | null;
  email?: string | null;
  latitud?: string | number | null;
  longitud?: string | number | null;
  hora_apertura?: string | null;
  hora_cierre?: string | null;
  activo?: boolean;
  es_principal?: boolean;
}

export type LocalFormData = Omit<Local, 'id'>;

export const localService = {
  getAll: async (activo?: boolean): Promise<Local[]> => {
    const response = await api.get('/locales', {
      params: activo === undefined ? undefined : { activo },
    });
    return response.data.data || [];
  },

  getActivos: async (): Promise<Local[]> => {
    const response = await api.get('/locales', { params: { activo: true } });
    return response.data.data || [];
  },

  create: async (data: LocalFormData): Promise<Local> => {
    const response = await api.post('/locales', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<LocalFormData>): Promise<Local> => {
    const response = await api.put(`/locales/${id}`, data);
    return response.data.data;
  },

  deactivate: async (id: number): Promise<Local> => {
    const response = await api.delete(`/locales/${id}`);
    return response.data.data;
  },
};
