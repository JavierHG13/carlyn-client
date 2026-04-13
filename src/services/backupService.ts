import api from './axios.ts';
import type { Backup, BackupConfig, BackupStats, CreateBackupData, CreateBackupConfigData, TablaInfo } from '../types/backup';

export const backupService = {
  // ==========================================
  // GESTIÓN DE BACKUPS
  // ==========================================

  getAll: async (filters?: { tipo?: string; limit?: number; offset?: number }) => {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    
    const response = await api.get(`/admin/backups?${params.toString()}`);
    return response.data;
  },

  getRecent: async (limit: number = 10) => {
    const response = await api.get(`/admin/backups/recientes?limit=${limit}`);
    return response.data;
  },

  getStats: async (): Promise<{ estadisticas: BackupStats }> => {
    const response = await api.get('/admin/backups/estadisticas');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/admin/backups/${id}`);
    return response.data;
  },

  createManual: async (data: CreateBackupData) => {
    const response = await api.post('/admin/backups/manual', data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/backups/${id}`);
    return response.data;
  },

  cleanExpired: async () => {
    const response = await api.post('/admin/backups/limpiar-expirados');
    return response.data;
  },

  getTables: async (): Promise<TablaInfo[]> => {
    const response = await api.get('/admin/backups/tablas');
    return response.data;
  },

  verifyCloudinary: async () => {
    const response = await api.get('/admin/backups/cloudinary/verificar');
    return response.data;
  },

  // ==========================================
  // CONFIGURACIÓN DE BACKUPS AUTOMÁTICOS
  // ==========================================

  getConfigs: async () => {
    const response = await api.get('/admin/backups/configuracion');
    return response.data;
  },

  getConfigById: async (id: number) => {
    const response = await api.get(`/admin/backups/configuracion/${id}`);
    return response.data;
  },

  createConfig: async (data: CreateBackupConfigData) => {
    const response = await api.post('/admin/backups/configuracion', data);
    return response.data;
  },

  updateConfig: async (id: number, data: Partial<CreateBackupConfigData>) => {
    const response = await api.put(`/admin/backups/configuracion/${id}`, data);
    return response.data;
  },

  toggleConfig: async (id: number, activo: boolean) => {
    const response = await api.put(`/admin/backups/configuracion/${id}/toggle`, { activo });
    return response.data;
  },

  deleteConfig: async (id: number) => {
    const response = await api.delete(`/admin/backups/configuracion/${id}`);
    return response.data;
  },
};