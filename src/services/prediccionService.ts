import api from "./axios";

export const prediccionService = {
  // Obtener resumen de datos históricos
  getResumen: () => {
    return api.get("/prediccion/resumen");
  },

  // Calcular predicción con dos meses seleccionados
  calcularPrediccion: (mes1: string, mes2: string) => {
    return api.post("/prediccion/", { mes1, mes2 });
  },

  // Obtener meses disponibles
  getMesesDisponibles: () => {
    return api.get("/prediccion/meses-disponibles");
  },

  getCitasPorMes: async (params: {
    mes?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.mes) {
      query.append("mes", params.mes);
    } else if (params.fechaInicio && params.fechaFin) {
      query.append("fechaInicio", params.fechaInicio);
      query.append("fechaFin", params.fechaFin);
    }

    const response = await api.get(`/prediccion/citas?${query.toString()}`);
    return response.data;
  },

  getKnowledgeModule: async (tipo: "no-show" | "ingresos" | "segmentacion") => {
    const response = await api.get(`/prediccion/conocimiento/${tipo}`);
    return response.data;
  },

  entrenarKnowledgeModels: async (rows = 1000) => {
    const response = await api.post("/prediccion/conocimiento/entrenar", { rows });
    return response.data;
  },
};
