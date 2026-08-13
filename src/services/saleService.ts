import api from './axios';
import type { Cita } from '../types/citas';

export interface SaleItemInput {
  productoId: number;
  cantidad: number;
}

export interface SaleRecord {
  id: number;
  metodo_pago: string;
  cliente_nombre?: string | null;
  notas?: string | null;
  total: string | number;
  vendida_por_nombre?: string;
  fecha_venta: string;
  detalles: Array<{
    id: number;
    producto_id: number;
    producto_nombre: string;
    cantidad: number;
    precio_unitario: string | number;
    subtotal: string | number;
  }>;
}

export interface WalkInServiceInput {
  localId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  horaInicio: string;
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
  clienteNombre?: string;
  clienteTelefono?: string;
  notas?: string;
}

export const saleService = {
  getByDay: async (fecha?: string) => {
    const response = await api.get('/admin/pos/ventas', { params: fecha ? { fecha } : undefined });
    return response.data;
  },

  create: async (data: {
    items: SaleItemInput[];
    metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
    clienteNombre?: string;
    notas?: string;
  }) => {
    const response = await api.post('/admin/pos/ventas', data);
    return response.data.data as SaleRecord;
  },

  cashCut: async (fecha?: string) => {
    const response = await api.post('/admin/pos/ventas/corte-caja', fecha ? { fecha } : {});
    return response.data.data;
  },

  registerWalkInService: async (data: WalkInServiceInput) => {
    const response = await api.post('/admin/pos/servicios-mostrador', data);
    return response.data.data as Cita;
  },
};
