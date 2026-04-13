export interface Horario {
  id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

export interface Barbero {
  barbero_id: number;
  usuario_id: number;
  nombre: string;
  email: string;
  telefono: string;
  foto: string | null;
  especialidad: string;
  años_experiencia: number;
  descripcion: string | null;
  calificacion: number;
  activo: boolean;
  created_at: string;
  horarios: Horario[];
}

export interface BarberoFormData {
  especialidad: string;
  años_experiencia: number;
  descripcion?: string;
}

export interface ResumenBarbero {
  completadas: number;
  canceladas: number;
  no_asistio: number;
  proximas: number;
  hoy: number;
  ingresos_total: number;
  ticket_promedio: number;
}

export interface CitaBarbero {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  notas: string | null;
  motivo_cancelacion: string | null;
  estado: string;
  servicio: string;
  precio: number;
  metodo_pago: string | null;
  monto_pagado: number;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_foto?: string;
}

export interface HistorialCitasResponse {
  data: CitaBarbero[];
  total: number;
  page: number;
  totalPages: number;
}