export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  duracion: number;
  precio: number;
  imagen_url: string | null;
  imagen_public_id: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  total_citas?: number;
}

export interface CreateServicioData {
  nombre: string;
  descripcion?: string;
  duracion: number;
  precio: number;
  imagen?: File;
}

export interface UpdateServicioData {
  nombre?: string;
  descripcion?: string | null;
  duracion?: number;
  precio?: number;
  activo?: boolean;
  imagen?: File;
}

export interface ServicioStats {
  total_citas: number;
  citas_completadas: number;
  ingresos_totales: number;
}