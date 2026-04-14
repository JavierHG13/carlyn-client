import api from './axios';
import type { PrediccionResponse } from '../types/prediccion';

export const prediccionService = {
    // Obtener resumen de datos históricos
    getResumen: async (): Promise<PrediccionResponse['resumen']> => {
        const response = await api.get('/prediccion/resumen');
        return response.data;
    },

    // Calcular predicción para una fecha objetivo
    calcularPrediccion: async (fechaObjetivo: string): Promise<PrediccionResponse> => {
        const response = await api.post('/prediccion', { fechaObjetivo });
        return response.data;
    },
};