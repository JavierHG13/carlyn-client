import api from './axios';
import type { Barbero, BarberoFormData, ResumenBarbero, HistorialCitasResponse, CitaBarbero } from '../types/barbero';

export const barberoService = {
  // Obtener todos los barberos (admin)
  getAll: async (): Promise<Barbero[]> => {
    const response = await api.get('/barbero');
    return response.data.data;
  },

  // Obtener perfil de un barbero específico (admin)
  getById: async (usuarioId: number): Promise<Barbero> => {
    const barberos = await barberoService.getAll();
    const barbero = barberos.find(b => b.usuario_id === usuarioId);
    if (!barbero) throw new Error('Barbero no encontrado');
    return barbero;
  },

  getPerfil: async (): Promise<Barbero> => {
    const response = await api.get('/barbero/perfil');
    return response.data.data;
  },

  // Obtener resumen de un barbero
  getResumen: async (): Promise<ResumenBarbero> => {
    const response = await api.get('/barbero/resumen');
    return response.data.data;
  },

  // Obtener citas próximas de un barbero
  getProximasCitas: async (limit?: number): Promise<CitaBarbero[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/barbero/citas/proximas${params}`);
    return response.data.data;
  },

  // Obtener historial de citas
  getHistorialCitas: async (
    params?: { estado?: string; fecha_desde?: string; fecha_hasta?: string; page?: number; limit?: number }
  ): Promise<HistorialCitasResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
    if (params?.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
    const response = await api.get(`/barbero/citas/historial?${queryParams.toString()}`);
    return response.data;
  },

  // Actualizar perfil del barbero
  updatePerfil: async (data: BarberoFormData): Promise<Barbero> => {
    const response = await api.put('/barbero', data);
    return response.data.data;
  },

  updatePerfilAdmin: async (barberoId: number, data: BarberoFormData): Promise<Barbero> => {
    const response = await api.patch(`/barbero/${barberoId}/perfil`, data);
    return response.data.data;
  },

  assignLocal: async (barberoId: number, localId: number): Promise<Barbero> => {
    const response = await api.patch(`/barbero/${barberoId}/local`, { localId });
    return response.data.data;
  },

  // Obtener horarios
  getHorarios: async () => {
    const response = await api.get('/barbero/horarios');
    return response.data.data;
  },

  // Actualizar horarios
  updateHorarios: async (horarios: any[]) => {
    const response = await api.put('/barbero/horarios', { horarios });
    return response.data.data;
  },

  // Activar/Desactivar un día
  toggleDiaHorario: async (diaSemana: number, activo: boolean) => {
    const response = await api.patch(`/barbero/horarios/${diaSemana}/toggle`, { activo });
    return response.data.data;
  },

  // Activar/Desactivar barbero
  toggleStatus: async (barberoId: number, activo: boolean) => {
    const response = await api.patch(`/barbero/${barberoId}/toggle`, { activo });
    return response.data.data;
  },
};
