import api from './axios';
import type {
  ServerStats,
  TransactionStats,
  AlertStats,
  IndexEfficiency,
  TableSize,
  ActiveLock,
  ActiveConnection,
  SlowQuery,
  DeadTuple,
  SchemaSummary,
  PoolMetrics,
  FullSnapshot,
} from '../types/stats';

export const statsService = {
  // Dashboard completo
  getSnapshot: async (): Promise<FullSnapshot> => {
    const response = await api.get('/stats/snapshot');
    return response.data.data;
  },

  // Estado del servidor
  getServer: async (): Promise<ServerStats> => {
    const response = await api.get('/stats/server');
    return response.data.data;
  },

  // Estadísticas de transacciones
  getTransactions: async (): Promise<TransactionStats> => {
    const response = await api.get('/stats/transactions');
    return response.data.data;
  },

  // Alertas del sistema
  getAlerts: async (): Promise<AlertStats> => {
    const response = await api.get('/stats/alerts');
    return response.data.data;
  },

  // Conexiones activas
  getConnections: async (): Promise<ActiveConnection[]> => {
    const response = await api.get('/stats/connections');
    return response.data.data;
  },

  // Consultas lentas
  getSlowQueries: async (): Promise<SlowQuery[]> => {
    const response = await api.get('/stats/slow-queries');
    return response.data.data;
  },

  // Eficiencia de índices
  getIndexes: async (): Promise<IndexEfficiency[]> => {
    const response = await api.get('/stats/indexes');
    return response.data.data;
  },

  // Tamaño de tablas
  getTables: async (): Promise<TableSize[]> => {
    const response = await api.get('/stats/tables');
    return response.data.data;
  },

  // Filas muertas
  getDeadTuples: async (): Promise<DeadTuple[]> => {
    const response = await api.get('/stats/dead-tuples');
    return response.data.data;
  },

  // Locks activos
  getLocks: async (): Promise<ActiveLock[]> => {
    const response = await api.get('/stats/locks');
    return response.data.data;
  },

  // Resumen de schemas
  getSchemas: async (): Promise<SchemaSummary[]> => {
    const response = await api.get('/stats/schemas');
    return response.data.data;
  },

  // Pool de conexiones
  getPool: async (): Promise<PoolMetrics> => {
    const response = await api.get('/stats/pool');
    return response.data.data;
  },
};