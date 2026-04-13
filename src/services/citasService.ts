import api from './axios';
import type { Cita, CitaFilters, PaginatedCitasResponse, CreateCitaData, UpdateCitaData, CalendarioCita } from '../types/citas';

export const citaService = {
  // Obtener todas las citas con filtros
  getAll: async (filters?: CitaFilters): Promise<PaginatedCitasResponse> => {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.telefono) params.append('telefono', filters.telefono);
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters?.estadoId) params.append('estadoId', String(filters.estadoId));
    if (filters?.barberoId) params.append('barberoId', String(filters.barberoId));
    if (filters?.clienteId) params.append('clienteId', String(filters.clienteId));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    const response = await api.get(`/citas?${params.toString()}`);
    return response.data;
  },

  // Buscar citas (búsqueda avanzada)
  search: async (filters?: CitaFilters): Promise<PaginatedCitasResponse> => {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.telefono) params.append('telefono', filters.telefono);
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters?.estadoId) params.append('estadoId', String(filters.estadoId));
    if (filters?.barberoId) params.append('barberoId', String(filters.barberoId));
    if (filters?.clienteId) params.append('clienteId', String(filters.clienteId));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    const response = await api.get(`/citas/search?${params.toString()}`);
    return response.data;
  },

  // Obtener citas próximas
  getProximas: async (dias?: number): Promise<Cita[]> => {
    const params = dias ? `?dias=${dias}` : '';
    const response = await api.get(`/citas/proximas${params}`);
    return response.data.data;
  },

  // Obtener calendario
  getCalendario: async (from?: string, to?: string, barberoId?: number): Promise<CalendarioCita[]> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (barberoId) params.append('barberoId', String(barberoId));
    
    const response = await api.get(`/citas/calendario?${params.toString()}`);
    return response.data.data;
  },

  // Obtener cita por ID
  getById: async (id: number): Promise<Cita> => {
    const response = await api.get(`/citas/${id}`);
    return response.data.data;
  },

  // Crear cita
  create: async (data: CreateCitaData): Promise<Cita> => {
    const response = await api.post('/citas', data);
    return response.data.data;
  },

  // Actualizar cita
  update: async (id: number, data: UpdateCitaData): Promise<Cita> => {
    const response = await api.put(`/citas/${id}`, data);
    return response.data.data;
  },

  // Cancelar cita
  cancel: async (id: number, motivo?: string): Promise<Cita> => {
    const response = await api.delete(`/citas/${id}`, { data: { motivo } });
    return response.data.data;
  },

  // Completar cita
  complete: async (id: number, metodoPagoId?: number): Promise<Cita> => {
    const response = await api.put(`/citas/${id}/completar`, { metodoPagoId });
    return response.data.data;
  },

  // Marcar como no asistió
  markNoShow: async (fechaLimite?: string): Promise<{ updated: number }> => {
    const response = await api.post('/citas/mark-no-show', { fechaLimite });
    return response.data;
  },
};