import api from "./axios";
import type { DatabaseStats, QueryResult } from "../types/database";

export const databaseService = {
  // Obtener estadísticas de la base de datos
  getStats: async (): Promise<DatabaseStats> => {
    const response = await api.get('/admin/database/stats');
    return response.data.estadisticas;
  },

  // Descargar backup
  downloadBackup: async () => {
    try {
      const response = await api.get('/admin/database/backup', {
        responseType: 'blob',
      });
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extraer nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : `backup_${new Date().toISOString()}.sql`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading backup:', error);
      throw error;
    }
  },

  // Restaurar base de datos
  restoreDatabase: async (sqlContent: string): Promise<void> => {
    const response = await api.post('/admin/database/restore', { sqlContent });
    return response.data;
  },

  // Ejecutar query personalizada (solo SELECT)
  executeQuery: async (sql: string): Promise<QueryResult> => {
    const response = await api.post('/admin/database/query', { sql });
    return response.data;
  },
};