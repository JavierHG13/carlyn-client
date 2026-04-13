export interface Vacuum {
  id: number;
  configuracion_id: number | null;
  tipo: 'Manual' | 'Automatico';
  tablas: string[];
  vacuum_analyze: boolean;
  vacuum_verbose: boolean;
  estado: 'Completado' | 'En_Proceso' | 'Fallido';
  duracion_ms: number;
  log_url: string;
  log_cloud_key: string;
  descripcion: string | null;
  usuario_id: number;
  metadata?: any;
  created_at: string;
  usuario_nombre?: string;
  configuracion_nombre?: string;
}

export interface VacuumConfig {
  id: number;
  nombre: string;
  descripcion: string | null;
  frecuencia: 'Diario' | 'Semanal' | 'Mensual';
  hora_ejecucion: string;
  dia_semana?: number;
  dia_mes?: number;
  tablas: string[];
  vacuum_analyze: boolean;
  vacuum_verbose: boolean;
  notificar_email: boolean;
  emails_notificacion?: string[];
  activo: boolean;
  ultimo_vacuum?: string;
  proximo_vacuum?: string;
  total_ejecuciones: number;
  ultimo_estado?: 'Exitoso' | 'Fallido' | 'En_proceso';
  ultimo_error?: string;
  created_at: string;
  updated_at: string;
}

export interface RunVacuumData {
  tablas?: string[];
  analyze?: boolean;
  verbose?: boolean;
  descripcion?: string;
}

export interface VacuumStats {
  total_ejecuciones: number;
  ultima_ejecucion?: string;
  promedio_duracion_ms: number;
}