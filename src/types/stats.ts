export interface ServerStats {
  version: string;
  database: string;
  uptime: string;
  started_at: string;
  size: string;
  size_bytes: number;
  connections: {
    active: number;
    idle: number;
    total: number;
    max: number;
  };
}

export interface TransactionStats {
  commits: number;
  rollbacks: number;
  cache_hits: number;
  disk_reads: number;
  cache_hit_ratio: number;
  rows_returned: number;
  rows_fetched: number;
  rows_inserted: number;
  rows_updated: number;
  rows_deleted: number;
}

export interface AlertStats {
  deadlocks: number;
  conflicts: number;
  temp_file_count: number;
  temp_size: string;
  rollbacks: number;
}

export interface IndexEfficiency {
  table_name: string;
  seq_scan: number;
  idx_scan: number;
  index_usage_pct: number;
  live_rows: number;
}

export interface TableSize {
  table_name: string;
  total_size: string;
  total_bytes: number;
  table_size: string;
  index_size: string;
  live_rows: number;
  dead_rows: number;
  last_vacuum: string | null;
  last_autovacuum: string | null;
  last_analyze: string | null;
  last_autoanalyze: string | null;
}

export interface DeadTuple {
  table_name: string;
  dead_rows: number;
  live_rows: number;
  dead_ratio_pct: number;
  last_autovacuum: string | null;
  last_vacuum: string | null;
}

export interface ActiveLock {
  pid: number;
  username: string;
  locktype: string;
  mode: string;
  granted: boolean;
  duration: string;
  query_preview: string;
}

export interface ActiveConnection {
  pid: number;
  username: string;
  application_name: string;
  client_addr: string;
  state: string;
  wait_event_type: string | null;
  wait_event: string | null;
  duration: string;
  query_preview: string;
}

export interface SchemaSummary {
  schema: string;
  table_count: number;
  tables: string[];
}

export interface SlowQuery {
  query_preview: string;
  calls: number;
  avg_ms: number;
  total_ms: number;
  rows: number;
  stddev_ms: number;
}

export interface PoolMetrics {
  total: number;
  idle: number;
  waiting: number;
}

export interface FullSnapshot {
  server: ServerStats;
  transactions: TransactionStats;
  alerts: AlertStats;
  indexEfficiency: IndexEfficiency[];
  tableSizes: TableSize[];
  locks: ActiveLock[];
  schemas: SchemaSummary[];
}