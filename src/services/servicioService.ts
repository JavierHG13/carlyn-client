import api from "./axios.ts";
import type {
  Servicio,
  CreateServicioData,
  UpdateServicioData,
  ServicioStats,
} from "../types/servicio.ts";

export const servicioService = {
  // Obtener todos los servicios (admin)
  getAll: async (filters?: {
    activo?: boolean;
    search?: string;
  }): Promise<Servicio[]> => {
    const params = new URLSearchParams();
    if (filters?.activo !== undefined)
      params.append("activo", String(filters.activo));
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(`/servicios?${params.toString()}`);
    return response.data.servicios;
  },

  getById: async (id: number): Promise<Servicio> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data.servicio;
  },

  // Obtener servicios activos (público)
  getActive: async (): Promise<Servicio[]> => {
    const response = await api.get("/servicios/activos");
    return response.data.servicios;
  },

  // Obtener servicios populares
  getPopular: async (limit: number = 5): Promise<Servicio[]> => {
    const response = await api.get(`/servicios/populares?limit=${limit}`);
    return response.data.servicios;
  },

  // Obtener servicio por ID
  getById: async (id: number): Promise<Servicio> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data.servicio;
  },

  // Obtener estadísticas de un servicio
  getStats: async (id: number): Promise<ServicioStats> => {
    const response = await api.get(`/servicios/${id}/estadisticas`);
    return response.data.estadisticas;
  },

  // Crear servicio (con imagen)
  create: async (data: CreateServicioData): Promise<Servicio> => {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    if (data.descripcion) formData.append("descripcion", data.descripcion);
    formData.append("duracion", String(data.duracion));
    formData.append("precio", String(data.precio));
    if (data.imagen) formData.append("imagen", data.imagen);

    const response = await api.post("/servicios", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.servicio;
  },

  // Actualizar servicio
  update: async (id: number, data: UpdateServicioData): Promise<Servicio> => {
    const formData = new FormData();
    if (data.nombre) formData.append("nombre", data.nombre);
    if (data.descripcion !== undefined)
      formData.append("descripcion", data.descripcion || "");
    if (data.duracion) formData.append("duracion", String(data.duracion));
    if (data.precio) formData.append("precio", String(data.precio));
    if (data.activo !== undefined)
      formData.append("activo", String(data.activo));
    if (data.imagen) formData.append("imagen", data.imagen);

    const response = await api.put(`/servicios/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.servicio;
  },

  // Desactivar servicio (soft delete)
  deactivate: async (id: number): Promise<Servicio> => {
    const response = await api.delete(`/servicios/${id}`);
    return response.data.servicio;
  },

  // Activar servicio
  activate: async (id: number): Promise<Servicio> => {
    const response = await api.put(`/servicios/${id}/activar`);
    return response.data.servicio;
  },

  // Eliminar permanentemente
  deletePermanently: async (id: number): Promise<void> => {
    await api.delete(`/servicios/${id}?permanente=true`);
  },

  // Obtener estadísticas generales
  getGeneralStats: async (): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    mas_populares: Servicio[];
  }> => {
    const response = await api.get("/servicios/estadisticas/generales");
    return response.data.estadisticas;
  },
};
