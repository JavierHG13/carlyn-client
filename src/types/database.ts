export interface Backup {
  id: number;
  nombre_archivo: string;
  tipo: 'Manual' | 'Automatico';
  tamaño_bytes: number;
  tamaño_legible: string;
  url_descarga: string;
  cloud_key: string;
  cloud_provider: string;
  descripcion?: string;
  usuario_id: number;
  configuracion_id?: number;
  metadata?: any;
  expires_at?: string;
  estado: 'Completado' | 'En_proceso' | 'Fallido';
  created_at: string;
  updated_at: string;
  usuario_nombre?: string;
  usuario_email?: string;
  configuracion_nombre?: string;
}

export interface BackupConfig {
  id: number;
  nombre: string;
  frecuencia: 'Diario' | 'Semanal' | 'Mensual';
  hora_ejecucion: string;
  dia_semana?: number;
  dia_mes?: number;
  retencion_dias: number;
  incluir_tablas?: string[];
  excluir_tablas?: string[];
  notificar_email: boolean;
  emails_notificacion?: string[];
  cloud_folder?: string;
  activo: boolean;
  ultimo_respaldo?: string;
  proximo_respaldo?: string;
  total_respaldos: number;
  ultimo_estado?: 'Exitoso' | 'Fallido' | 'En_proceso';
  ultimo_error?: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseStats {
  database_size: string;
  usuarios_count: number;
  barberos_count: number;
  tbl_servicios_count: number;
  connections: {
    total_connections: number;
    active_connections: number;
    idle_connections: number;
  };
}

export interface CloudinaryStatus {
  conectado: boolean;
  cloud_name: string;
  status: string;
}

export interface PaginatedBackups {
  backups: Backup[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
  };
}

export interface CleanExpiredResult {
  message: string;
  total_eliminados: number;
  backups: string[];
}

export interface CreateBackupConfigData {
  nombre: string;
  frecuencia: 'Diario' | 'Semanal' | 'Mensual';
  hora_ejecucion?: string;
  dia_semana?: number;
  dia_mes?: number;
  retencion_dias?: number;
  incluir_tablas?: string[];
  excluir_tablas?: string[];
  notificar_email?: boolean;
  emails_notificacion?: string[];
  cloud_folder?: string;
  descripcion?: string;
}

export interface UpdateBackupConfigData extends Partial<CreateBackupConfigData> {}