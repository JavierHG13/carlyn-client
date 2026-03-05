import api from './axios';
import type { User, CreateUserData, UpdateUserData, UserFilters, PaginatedResponse } from '../types/user';

export const userService = {
  // Obtener todos los usuarios con filtros
  getAll: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.rol) params.append('rol', filters.rol);
      if (filters?.activo !== undefined) params.append('activo', String(filters.activo));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      
      const response = await api.get(`/admin/usuarios?${params.toString()}`);
      
      // Asegurarnos de que la respuesta tenga la estructura esperada
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: response.data.totalPages || 1
      };
    } catch (error) {
      console.error('Error en getAll:', error);
      // Devolver una estructura vacía en caso de error
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
      };
    }
  },

  // Obtener usuario por ID
  getById: async (id: number): Promise<User | null> => {
    try {
      const response = await api.get(`/admin/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getById:', error);
      return null;
    }
  },

  // Crear nuevo usuario
  create: async (data: CreateUserData): Promise<User | null> => {
    try {
      const response = await api.post('/admin/usuarios', data);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  // Actualizar usuario
  update: async (id: number, data: UpdateUserData): Promise<User | null> => {
    try {
      const response = await api.put(`/admin/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  // Eliminar usuario
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/admin/usuarios/${id}`);
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  },

  // Activar/Desactivar usuario
  toggleStatus: async (id: number): Promise<User | null> => {
    try {
      const response = await api.put(`/admin/usuarios/${id}/activar`);
      return response.data;
    } catch (error) {
      console.error('Error en toggleStatus:', error);
      throw error;
    }
  },

  // Obtener estadísticas generales (con manejo de error)
  getStats: async () => {
    try {
      const response = await api.get('/admin/usuarios/estadisticas/generales');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Devolver datos por defecto si hay error
      return {
        totalAppointments: 0,
        totalRevenue: 0,
        totalClients: 0,
        activeBarbers: 0,
        appointmentsToday: 0,
        appointmentsPending: 0,
        averageRating: 0,
        popularServices: []
      };
    }
  }
};