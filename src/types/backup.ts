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
  metadata?: {
    database?: string;
    host?: string;
    tablas_incluidas?: string[];
    tablas_excluidas?: string[];
    cloudinary_public_id?: string;
  };
  expires_at?: string;
  estado: 'Completado' | 'En_Proceso' | 'Fallido';
  created_at: string;
  updated_at: string;
  usuario_nombre?: string;
  usuario_email?: string;
  configuracion_nombre?: string;
  log_url?: string;
  log_cloud_key?: string;
}

export interface BackupConfig {
  id: number;
  nombre: string;
  frecuencia: 'Siario' | 'Semanal' | 'Mensual';
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

export interface TablaInfo {
  table_schema: string;
  table_name: string;
}

export interface BackupStats {
  total_backups: number;
  manuales: number;
  automaticos: number;
  tamaño_total_bytes: number;
  tamaño_total_legible: string;
  promedio_tamaño: string;
  ultimo_backup?: string;
  primer_backup?: string;
}

export interface CreateBackupData {
  descripcion?: string;
  incluir_tablas?: string[];
  excluir_tablas?: string[];
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