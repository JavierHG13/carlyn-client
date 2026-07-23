import api from './axios'
import type { CitaCliente, ResumenCitas } from '../types/misCitas';

const parseDateKey = (fecha: string) => {
    const [year, month, day] = String(fecha).slice(0, 10).split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
};

export const misCitasService = {
    // Obtener todas las citas del cliente
    getAll: async (): Promise<CitaCliente[]> => {
        const response = await api.get('/citas');
        return response.data.data;
    },

    buildResumen: (citas: CitaCliente[]): ResumenCitas => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const proximas = citas.filter(c => {
            const fechaCita = parseDateKey(c.fecha);
            return fechaCita >= hoy && (c.estado_nombre === 'Pendiente' || c.estado_nombre === 'Confirmada');
        });
        
        return {
            total: citas.length,
            pendientes: citas.filter(c => c.estado_nombre === 'Pendiente').length,
            confirmadas: citas.filter(c => c.estado_nombre === 'Confirmada').length,
            completadas: citas.filter(c => c.estado_nombre === 'Completada').length,
            canceladas: citas.filter(c => c.estado_nombre === 'Cancelada').length,
            proximas: proximas.length,
        };
    },

    // Cancelar cita
    cancelar: async (citaId: number, motivo?: string): Promise<void> => {
        await api.delete(`/citas/${citaId}`, { data: { motivo } });
    },

    reagendar: async (citaId: number, data: { fecha: string; horaInicio: string; notas?: string | null }): Promise<CitaCliente> => {
        const response = await api.put(`/citas/${citaId}`, data);
        return response.data.data;
    },

    getHorariosDisponibles: async (barberoId: number, fecha: string): Promise<Array<{ hora: string; disponible?: boolean; ocupado?: boolean }>> => {
        const response = await api.get('/citas/horarios-disponibles', {
            params: { barberoId, fecha },
        });
        return response.data.disponibles || [];
    },

    // Obtener cita por ID
    getById: async (id: number): Promise<CitaCliente> => {
        const response = await api.get(`/citas/${id}`);
        return response.data.data;
    },
};
