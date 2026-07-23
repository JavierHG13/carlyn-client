import api from './axios';

export interface HorarioDia {
  id?: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

export interface HorarioBarbero {
  barbero_id: number;
  barbero_nombre: string;
  especialidad?: string | null;
  local_id?: number | null;
  local_nombre?: string | null;
  horarios: HorarioDia[];
}

export interface HorarioPlantilla {
  nombre: string;
  descripcion: string;
  horarios: HorarioDia[];
}

export const horarioService = {
  getAll: async (): Promise<HorarioBarbero[]> => {
    const response = await api.get('/admin/horarios');
    return response.data.horarios || [];
  },

  getPlantillas: async (): Promise<HorarioPlantilla[]> => {
    const response = await api.get('/admin/horarios/plantillas');
    return response.data.plantillas || [];
  },

  saveBarberoHorarios: async (barberoId: number, horarios: HorarioDia[]) => {
    const response = await api.post(`/admin/horarios/barbero/${barberoId}`, { horarios });
    return response.data;
  },
};
