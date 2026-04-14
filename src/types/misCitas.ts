export interface CitaCliente {
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

    // Barbero
    barbero_id: number;
    barbero_especialidad: string;
    barbero_nombre: string;
    barbero_telefono: string;
    barbero_foto?: string;

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

export interface ResumenCitas {
    total: number;
    pendientes: number;
    confirmadas: number;
    completadas: number;
    canceladas: number;
    proximas: number;
}