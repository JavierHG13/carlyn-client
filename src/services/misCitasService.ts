import api from './axios'
import type { CitaCliente, ResumenCitas } from '../types/misCitas';

export const misCitasService = {
    // Obtener todas las citas del cliente
    getAll: async (): Promise<CitaCliente[]> => {
        const response = await api.get('/citas');
        return response.data.data;
    },

    // Obtener resumen de citas
    getResumen: async (): Promise<ResumenCitas> => {
        const citas = await misCitasService.getAll();
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const proximas = citas.filter(c => {
            const fechaCita = new Date(c.fecha);
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

    // Obtener cita por ID
    getById: async (id: number): Promise<CitaCliente> => {
        const response = await api.get(`/citas/${id}`);
        return response.data.data;
    },
};