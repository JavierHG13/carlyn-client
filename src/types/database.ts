export interface TableInfo {
  tablename: string;
}

export interface DatabaseStats {
  database_size: string;
  usuarios_count: number;
  barberos_count: number;
  servicios_count: number;
  citas_count: number;
  horarios_barbero_count: number;
  notificaciones_count: number;
  connections: {
    total_connections: number;
    active_connections: number;
    idle_connections: number;
  };
}

export interface QueryResult {
  rowCount: number;
  rows: any[];
}

export interface BackupHistory {
  id: number;
  filename: string;
  size: string;
  created_at: string;
  created_by: string;
}