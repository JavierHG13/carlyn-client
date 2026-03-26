import api from './axios';
import type { 
  Backup, 
  BackupConfig, 
  DatabaseStats, 
  CloudinaryStatus,
  PaginatedBackups,
  CleanExpiredResult,
  CreateBackupConfigData,
  UpdateBackupConfigData
} from '../types/database';

export const databaseService = {
  // ==========================================
  // ESTADÍSTICAS
  // ==========================================
  
  getStats: async (): Promise<DatabaseStats> => {
    const response = await api.get('/admin/database/stats');
    return response.data.estadisticas;
  },

  // ==========================================
  // GESTIÓN DE BACKUPS
  // ==========================================

  getAllBackups: async (filters?: { tipo?: string; limit?: number; offset?: number }): Promise<PaginatedBackups> => {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    
    const response = await api.get(`/admin/backups?${params.toString()}`);
    return response.data;
  },

  getRecentBackups: async (limit: number = 10): Promise<{ backups: Backup[] }> => {
    const response = await api.get(`/admin/backups/recientes?limit=${limit}`);
    return response.data;
  },

  verifyCloudinary: async (): Promise<CloudinaryStatus> => {
    const response = await api.get('/admin/backups/cloudinary/verificar');
    return response.data;
  },

  getBackupById: async (id: number): Promise<{ backup: Backup }> => {
    const response = await api.get(`/admin/backups/${id}`);
    return response.data;
  },

  createManualBackup: async (data: {
    descripcion?: string;
    incluir_tablas?: string[];
    excluir_tablas?: string[];
  }): Promise<{ message: string; backup: Backup }> => {
    const response = await api.post('/admin/backups/manual', data);
    return response.data;
  },

  deleteBackup: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/backups/${id}`);
    return response.data;
  },

  cleanExpiredBackups: async (): Promise<CleanExpiredResult> => {
    const response = await api.post('/admin/backups/limpiar-expirados');
    return response.data;
  },

  // ==========================================
  // CONFIGURACIÓN DE BACKUPS AUTOMÁTICOS
  // ==========================================

  getConfigs: async (): Promise<{ configuraciones: BackupConfig[] }> => {
    const response = await api.get('/admin/backups/configuracion');
    return response.data;
  },

  getConfigById: async (id: number): Promise<{ configuracion: BackupConfig }> => {
    const response = await api.get(`/admin/backups/configuracion/${id}`);
    return response.data;
  },

  createConfig: async (data: CreateBackupConfigData): Promise<{ message: string; configuracion: BackupConfig }> => {
    const response = await api.post('/admin/backups/configuracion', data);
    return response.data;
  },

  updateConfig: async (id: number, data: UpdateBackupConfigData): Promise<{ message: string; configuracion: BackupConfig }> => {
    const response = await api.put(`/admin/backups/configuracion/${id}`, data);
    return response.data;
  },

  toggleConfig: async (id: number, activo: boolean): Promise<{ message: string; configuracion: BackupConfig }> => {
    const response = await api.put(`/admin/backups/configuracion/${id}/toggle`, { activo });
    return response.data;
  },

  deleteConfig: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/backups/configuracion/${id}`);
    return response.data;
  },
};