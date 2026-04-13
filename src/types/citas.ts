export interface Cita {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  notas: string | null;
  recordatorio_enviado: boolean;
  motivo_cancelacion: string | null;
  monto_pagado: number | null;
  created_at: string;
  updated_at: string;
  
  // Cliente
  cliente_id: number;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string;
  
  // Barbero
  barbero_id: number;
  barbero_especialidad: string;
  barbero_usuario_id: number;
  barbero_nombre: string;
  barbero_telefono: string;
  
  // Servicio
  servicio_id: number;
  servicio_nombre: string;
  servicio_duracion: number;
  servicio_precio: number;
  
  // Estado
  estado_id: number;
  estado_nombre: string;
  
  // Método de pago
  metodo_pago_id: number | null;
  metodo_pago_nombre: string | null;
}

export interface CitaFilters {
  q?: string;
  telefono?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estadoId?: number;
  barberoId?: number;
  clienteId?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedCitasResponse {
  message: string;
  data: Cita[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCitaData {
  clienteId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  horaInicio: string;
  estadoId: number;
  notas?: string;
  metodoPagoId?: number;
  montoPagado?: number;
}

export interface UpdateCitaData {
  clienteId?: number;
  barberoId?: number;
  servicioId?: number;
  fecha?: string;
  horaInicio?: string;
  estadoId?: number;
  notas?: string | null;
  metodoPagoId?: number | null;
  montoPagado?: number | null;
  motivoCancelacion?: string | null;
}

export interface CalendarioCita {
  date: string;
  total: number;
  citas: Cita[];
}