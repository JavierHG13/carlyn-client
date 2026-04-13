import api from './axios';
import type { Vacuum, VacuumConfig, RunVacuumData } from '../types/vacuum';

export const vacuumService = {
  // ==========================================
  // EJECUCIONES
  // ==========================================

  getAll: async (params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const response = await api.get(`/admin/vacuums?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/admin/vacuums/${id}`);
    return response.data;
  },

  runManual: async (data: RunVacuumData) => {
    const response = await api.post('/admin/vacuums/manual', data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/vacuums/${id}`);
    return response.data;
  },

  // ==========================================
  // CONFIGURACIONES
  // ==========================================

  getConfigs: async () => {
    const response = await api.get('/admin/vacuums/configuracion');
    return response.data;
  },

  getConfigById: async (id: number) => {
    const response = await api.get(`/admin/vacuums/configuracion/${id}`);
    return response.data;
  },

  createConfig: async (data: Partial<VacuumConfig>) => {
    const response = await api.post('/admin/vacuums/configuracion', data);

    console.log(response)
    
    return response.data;
  },

  updateConfig: async (id: number, data: Partial<VacuumConfig>) => {
    const response = await api.put(`/admin/vacuums/configuracion/${id}`, data);
    return response.data;
  },

  toggleConfig: async (id: number, activo: boolean) => {
    const response = await api.put(`/admin/vacuums/configuracion/${id}/toggle`, { activo });
    return response.data;
  },

  deleteConfig: async (id: number) => {
    const response = await api.delete(`/admin/vacuums/configuracion/${id}`);
    return response.data;
  },
};