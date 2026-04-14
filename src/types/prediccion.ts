export interface DatosHistoricos {
    mes: string;
    total: number;
}

export interface Proyeccion {
    mes: string;
    Nt: number;
}

export interface ModeloMatematico {
    tipo: 'lineal' | 'exponencial';
    ecuacion: string;
    tasaMensual: number;
    N0: number;
    k: number;
    r2?: number;
}

export interface PrediccionResponse {
    historico: DatosHistoricos[];
    proyeccion: Proyeccion[];
    modelo: ModeloMatematico;
    resumen: {
        total: number;
        primerRegistro: string;
        ultimoRegistro: string;
        tasaCrecimiento: number;
    };
}