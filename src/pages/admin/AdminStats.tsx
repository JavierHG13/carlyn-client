import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDatabase,
    faChartLine,
    faExclamationTriangle,
    faPlug,
    faTable,
    faSearch,
    faClock,
    faArrowTrendUp,
    faRotateRight,
    faGaugeHigh,
    faMemory,
    faMicrochip,
    faCircleInfo,
    faCheckCircle,
    faTimesCircle,
    faWarning,
    faServer,
    faArrowRight,
    faArrowLeft,
    faList,
    faKey,
    faHdd,
    faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { statsService } from '../../services/statsService';
import type {
    ServerStats,
    TransactionStats,
    AlertStats,
    IndexEfficiency,
    TableSize,
    ActiveConnection,
    SlowQuery,
    DeadTuple,
    ActiveLock,
    SchemaSummary,
    PoolMetrics,
} from '../../types/stats';
import { MetricCard } from '../../components/admin/stats/MetricCard';
import { CacheHitChart } from '../../components/admin/stats/CacheHitChart';
import { IndexUsageChart } from '../../components/admin/stats/IndexUsageChart';
import { TableSizeChart } from '../../components/admin/stats/TableSizeChart';
import { QueryPerformanceChart } from '../../components/admin/stats/QueryPerformanceChart';
import { colors } from '../../styles/colors';

export const AdminStats: React.FC = () => {
    const [server, setServer] = useState<ServerStats | null>(null);
    const [transactions, setTransactions] = useState<TransactionStats | null>(null);
    const [alerts, setAlerts] = useState<AlertStats | null>(null);
    const [indexes, setIndexes] = useState<IndexEfficiency[]>([]);
    const [tables, setTables] = useState<TableSize[]>([]);
    const [connections, setConnections] = useState<ActiveConnection[]>([]);
    const [slowQueries, setSlowQueries] = useState<SlowQuery[]>([]);
    const [deadTuples, setDeadTuples] = useState<DeadTuple[]>([]);
    const [locks, setLocks] = useState<ActiveLock[]>([]);
    const [schemas, setSchemas] = useState<SchemaSummary[]>([]);
    const [pool, setPool] = useState<PoolMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'queries' | 'tables' | 'connections' | 'locks'>('overview');
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    console.log(connections)
    const loadAllStats = async () => {
        try {
            setLoading(true);
            const [
                serverData,
                transactionsData,
                alertsData,
                indexesData,
                tablesData,
                connectionsData,
                slowQueriesData,
                deadTuplesData,
                locksData,
                schemasData,
                poolData,
            ] = await Promise.all([
                statsService.getServer(),
                statsService.getTransactions(),
                statsService.getAlerts(),
                statsService.getIndexes(),
                statsService.getTables(),
                statsService.getConnections(),
                statsService.getSlowQueries(),
                statsService.getDeadTuples(),
                statsService.getLocks(),
                statsService.getSchemas(),
                statsService.getPool(),
            ]);

            setServer(serverData);
            setTransactions(transactionsData);
            setAlerts(alertsData);
            setIndexes(indexesData);
            setTables(tablesData);
            setConnections(connectionsData);
            setSlowQueries(slowQueriesData);
            setDeadTuples(deadTuplesData);
            setLocks(locksData);
            setSchemas(schemasData);
            setPool(poolData);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    //console.log("Consultas lentas", slowQueries)

    useEffect(() => {
        loadAllStats();
        const interval = setInterval(loadAllStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (uptime: any) => {
        if (!uptime) return 'N/A';


        if (typeof uptime === 'object') {
            const { days = 0, hours = 0, minutes = 0, seconds = 0 } = uptime;

            if (days > 0) {
                return `${days} días ${hours} horas`;
            }

            return `${hours}h ${minutes}m ${seconds}s`;
        }

        return 'Formato inválido';
    };

    const getStatusBadge = (value: number, threshold: number, isHigherBad: boolean = true) => {
        const isBad = isHigherBad ? value > threshold : value < threshold;
        return {
            bg: isBad ? '#FEE2E2' : '#D1FAE5',
            color: isBad ? '#EF4444' : '#10B981',
            icon: isBad ? faWarning : faCheckCircle,
        };
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
        padding: '20px',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 600,
        color: colors.negroSuave,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };

    const refreshButtonStyle: React.CSSProperties = {
        padding: '10px 20px',
        backgroundColor: colors.grafito,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'opacity 0.2s',
    };

    const tabsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '8px',
        flexWrap: 'wrap',
    };

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '10px 20px',
        borderRadius: '10px 10px 0 0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: isActive ? `${colors.doradoClasico}15` : 'transparent',
        color: isActive ? colors.doradoClasico : '#64748B',
        borderBottom: isActive ? `2px solid ${colors.doradoClasico}` : '2px solid transparent',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    });

    const statsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '24px',
    };

    const cardTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: colors.negroSuave,
    };

    const chartGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
        marginBottom: '24px',
    };

    const tableContainerStyle: React.CSSProperties = {
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        backgroundColor: 'white',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px',
    };

    const thStyle: React.CSSProperties = {
        textAlign: 'left',
        padding: '14px 16px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        color: '#475569',
        fontSize: '13px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const tdStyle: React.CSSProperties = {
        padding: '12px 16px',
        borderBottom: '1px solid #F1F5F9',
        fontSize: '13px',
        color: '#1E293B',
    };

    const metricRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #F1F5F9',
    };

    if (loading && !server) {
        return (
            <div style={{ textAlign: 'center', padding: '80px' }}>
                <div style={{ color: colors.azulAcero, fontSize: '16px' }}>
                    <FontAwesomeIcon icon={faRotateRight} spin style={{ marginRight: '8px' }} />
                    Cargando estadísticas...
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h1 style={titleStyle}>
                    <FontAwesomeIcon icon={faChartLine} style={{ color: colors.doradoClasico }} />
                    Monitoreo de Base de Datos
                </h1>
                <button style={refreshButtonStyle} onClick={loadAllStats}>
                    <FontAwesomeIcon icon={faRotateRight} />
                    Actualizar
                    <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>
                        {lastUpdate.toLocaleTimeString()}
                    </span>
                </button>
            </div>

            {/* Tabs */}
            <div style={tabsStyle}>
                <div style={tabStyle(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
                    <FontAwesomeIcon icon={faGaugeHigh} />
                    Vista General
                </div>
                <div style={tabStyle(activeTab === 'queries')} onClick={() => setActiveTab('queries')}>
                    <FontAwesomeIcon icon={faSearch} />
                    Consultas
                </div>
                <div style={tabStyle(activeTab === 'tables')} onClick={() => setActiveTab('tables')}>
                    <FontAwesomeIcon icon={faTable} />
                    Tablas e Índices
                </div>
                <div style={tabStyle(activeTab === 'connections')} onClick={() => setActiveTab('connections')}>
                    <FontAwesomeIcon icon={faPlug} />
                    Conexiones
                </div>
                <div style={tabStyle(activeTab === 'locks')} onClick={() => setActiveTab('locks')}>
                    <FontAwesomeIcon icon={faKey} />
                    Locks
                </div>
            </div>

            {/* ========== VISTA GENERAL ========== */}
            {activeTab === 'overview' && server && transactions && (
                <>
                    {/* Métricas principales */}
                    <div style={statsGridStyle}>
                        <MetricCard
                            title="Tamaño DB"
                            value={server.size}
                            icon={faDatabase}
                        />
                        <MetricCard
                            title="Uptime"
                            value={formatUptime(server.uptime)}
                            icon={faClock}
                        />
                        <MetricCard
                            title="Conexiones"
                            value={`${server.connections.active}/${server.connections.max}`}
                            icon={faPlug}
                        />
                        <MetricCard
                            title="Cache Hit Ratio"
                            value={`${transactions.cache_hit_ratio}%`}
                            icon={faMemory}
                        />
                    </div>

                    {/* Gráficos */}
                    <div style={chartGridStyle}>
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faMicrochip} />
                                Cache Hit Ratio
                            </h3>
                            <CacheHitChart cacheHitRatio={transactions.cache_hit_ratio} />
                            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '16px', textAlign: 'center' }}>
                                {transactions.cache_hit_ratio > 95
                                    ? '✅ Excelente: La mayoría de las consultas usan caché'
                                    : '⚠️ Optimizable: Considera aumentar shared_buffers'}
                            </p>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faArrowTrendUp} />
                                Actividad de Transacciones
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#10B981' }}>
                                        {formatNumber(transactions.commits)}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748B' }}>Commits</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#EF4444' }}>
                                        {formatNumber(transactions.rollbacks)}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748B' }}>Rollbacks</div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                                <div style={metricRowStyle}>
                                    <span>Filas Insertadas</span>
                                    <strong>{formatNumber(transactions.rows_inserted)}</strong>
                                </div>
                                <div style={metricRowStyle}>
                                    <span>Filas Actualizadas</span>
                                    <strong>{formatNumber(transactions.rows_updated)}</strong>
                                </div>
                                <div style={metricRowStyle}>
                                    <span>Filas Eliminadas</span>
                                    <strong>{formatNumber(transactions.rows_deleted)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alertas */}
                    {alerts && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#F59E0B' }} />
                                Alertas del Sistema
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>Deadlocks</div>
                                    <div style={{ fontSize: '24px', fontWeight: 600, ...getStatusBadge(alerts.deadlocks, 0) }}>
                                        {alerts.deadlocks}
                                    </div>
                                </div>
                                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>Conflictos</div>
                                    <div style={{ fontSize: '24px', fontWeight: 600, ...getStatusBadge(alerts.conflicts, 10) }}>
                                        {alerts.conflicts}
                                    </div>
                                </div>
                                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>Archivos Temp</div>
                                    <div style={{ fontSize: '24px', fontWeight: 600, ...getStatusBadge(alerts.temp_file_count, 100) }}>
                                        {alerts.temp_file_count}
                                    </div>
                                </div>
                                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>Tamaño Temp</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600 }}>{alerts.temp_size}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filas Muertas */}
                    {deadTuples.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faWarning} style={{ color: '#F59E0B' }} />
                                Tablas que Requieren VACUUM
                            </h3>
                            <div style={tableContainerStyle}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Tabla</th>
                                            <th style={thStyle}>Filas Muertas</th>
                                            <th style={thStyle}>Filas Vivas</th>
                                            <th style={thStyle}>Ratio</th>
                                            <th style={thStyle}>Último VACUUM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deadTuples.slice(0, 5).map((tuple, idx) => {
                                            const status = getStatusBadge(tuple.dead_ratio_pct, 10);
                                            return (
                                                <tr key={idx}>
                                                    <td style={tdStyle}>{tuple.table_name}</td>
                                                    <td style={tdStyle}>{formatNumber(tuple.dead_rows)}</td>
                                                    <td style={tdStyle}>{formatNumber(tuple.live_rows)}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '4px 8px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            backgroundColor: status.bg,
                                                            color: status.color,
                                                        }}>
                                                            <FontAwesomeIcon icon={status.icon} style={{ fontSize: '10px' }} />
                                                            {tuple.dead_ratio_pct}%
                                                        </span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {tuple.last_vacuum ? new Date(tuple.last_vacuum).toLocaleDateString() : 'Nunca'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ========== CONSULTAS ========== */}
            {activeTab === 'queries' && (
                <>
                    {slowQueries.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faClock} />
                                Top 10 Consultas Más Lentas
                            </h3>
                            <QueryPerformanceChart data={slowQueries} />
                            <div style={tableContainerStyle}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Consulta</th>
                                            <th style={thStyle}>Llamadas</th>
                                            <th style={thStyle}>Promedio (ms)</th>
                                            <th style={thStyle}>Total (ms)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {slowQueries.map((query, idx) => (
                                            <tr key={idx}>
                                                <td style={tdStyle}>
                                                    <code style={{ fontSize: '11px', color: '#1E293B' }}>{query.query_preview}</code>
                                                </td>
                                                <td style={tdStyle}>{formatNumber(query.calls)}</td>
                                                <td style={tdStyle}>
                                                    <span style={{ color: query.avg_ms > 100 ? '#EF4444' : '#10B981' }}>
                                                        {query.avg_ms}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>{query.total_ms}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Locks activos */}
                    {locks.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faKey} />
                                Locks Activos
                            </h3>
                            <div style={tableContainerStyle}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>PID</th>
                                            <th style={thStyle}>Usuario</th>
                                            <th style={thStyle}>Tipo</th>
                                            <th style={thStyle}>Modo</th>
                                            <th style={thStyle}>Concedido</th>
                                            <th style={thStyle}>Duración</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locks.slice(0, 10).map((lock, idx) => (
                                            <tr key={idx}>
                                                <td style={tdStyle}>{lock.pid}</td>
                                                <td style={tdStyle}>{lock.username}</td>
                                                <td style={tdStyle}>{lock.locktype}</td>
                                                <td style={tdStyle}>{lock.mode}</td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        color: lock.granted ? '#10B981' : '#EF4444',
                                                        fontWeight: 500,
                                                    }}>
                                                        {lock.granted ? 'Sí' : 'No'}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>{lock.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ========== TABLAS E ÍNDICES ========== */}
            {activeTab === 'tables' && (
                <>
                    {/* Eficiencia de Índices */}
                    {indexes.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faArrowTrendUp} />
                                Eficiencia de Índices
                            </h3>
                            <IndexUsageChart data={indexes.slice(0, 10)} />
                        </div>
                    )}

                    {/* Tamaño de Tablas */}
                    {tables.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faTable} />
                                Tamaño de Tablas
                            </h3>
                            <TableSizeChart data={tables.slice(0, 10)} />
                            <div style={tableContainerStyle}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Tabla</th>
                                            <th style={thStyle}>Tamaño Total</th>
                                            <th style={thStyle}>Tamaño Tabla</th>
                                            <th style={thStyle}>Tamaño Índices</th>
                                            <th style={thStyle}>Filas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tables.slice(0, 10).map((table, idx) => (
                                            <tr key={idx}>
                                                <td style={tdStyle}>{table.table_name}</td>
                                                <td style={tdStyle}>{table.total_size}</td>
                                                <td style={tdStyle}>{table.table_size}</td>
                                                <td style={tdStyle}>{table.index_size}</td>
                                                <td style={tdStyle}>{formatNumber(table.live_rows)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Schemas */}
                    {schemas.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faLayerGroup} />
                                Esquemas de la Base de Datos
                            </h3>
                            <div style={statsGridStyle}>
                                {schemas.map((schema, idx) => (
                                    <div key={idx} style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: colors.doradoClasico }}>
                                            {schema.schema}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                                            {schema.table_count} tablas
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ========== CONEXIONES ========== */}
            {activeTab === 'connections' && (
                <>
                    <div style={statsGridStyle}>
                        <MetricCard title="Conexiones Totales" value={pool?.total || 0} icon={faPlug} />
                        <MetricCard title="Conexiones Inactivas" value={pool?.idle || 0} icon={faClock} />
                        <MetricCard title="Conexiones en Espera" value={pool?.waiting || 0} icon={faWarning} />
                    </div>

                    {connections.length > 0 && (
                        <div style={cardStyle}>
                            <h3 style={cardTitleStyle}>
                                <FontAwesomeIcon icon={faPlug} />
                                Conexiones Activas
                            </h3>
                            <div style={tableContainerStyle}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>PID</th>
                                            <th style={thStyle}>Usuario</th>
                                            <th style={thStyle}>Aplicación</th>
                                            <th style={thStyle}>Estado</th>
                                            <th style={thStyle}>Duración</th>
                                            <th style={thStyle}>Consulta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {connections.map((conn, idx) => (
                                            <tr key={idx}>
                                                <td style={tdStyle}>{conn.pid}</td>
                                                <td style={tdStyle}>{conn.username}</td>
                                                <td style={tdStyle}>{conn.application_name || '—'}</td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '4px 8px',
                                                        borderRadius: '20px',
                                                        fontSize: '11px',
                                                        backgroundColor: conn.state === 'active' ? '#D1FAE5' : '#FEF3C7',
                                                        color: conn.state === 'active' ? '#10B981' : '#F59E0B',
                                                    }}>
                                                        {conn.state || 'idle'}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    {conn.duration?.minutes !== undefined
                                                        ? `${conn.duration.minutes}m ${conn.duration.seconds ?? 0}s`
                                                        : '—'}
                                                </td>
                                                <td style={tdStyle}>
                                                    <code style={{ fontSize: '11px' }}>{conn.query_preview}</code>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ========== LOCKS ========== */}
            {activeTab === 'locks' && (
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>
                        <FontAwesomeIcon icon={faKey} />
                        Locks Activos en la Base de Datos
                    </h3>
                    {locks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '48px', marginBottom: '16px', color: '#10B981' }} />
                            <p>No hay locks activos en este momento</p>
                        </div>
                    ) : (
                        <div style={tableContainerStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>PID</th>
                                        <th style={thStyle}>Usuario</th>
                                        <th style={thStyle}>Tipo</th>
                                        <th style={thStyle}>Modo</th>
                                        <th style={thStyle}>Concedido</th>
                                        <th style={thStyle}>Duración</th>
                                        <th style={thStyle}>Consulta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locks.map((lock, idx) => (
                                        <tr key={idx}>
                                            <td style={tdStyle}>{lock.pid}</td>
                                            <td style={tdStyle}>{lock.username}</td>
                                            <td style={tdStyle}>{lock.locktype}</td>
                                            <td style={tdStyle}>{lock.mode}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 8px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    backgroundColor: lock.granted ? '#D1FAE5' : '#FEE2E2',
                                                    color: lock.granted ? '#10B981' : '#EF4444',
                                                }}>
                                                    <FontAwesomeIcon icon={lock.granted ? faCheckCircle : faTimesCircle} style={{ fontSize: '10px' }} />
                                                    {lock.granted ? 'Concedido' : 'Esperando'}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{lock.duration}</td>
                                            <td style={tdStyle}>
                                                <code style={{ fontSize: '11px' }}>{lock.query_preview}</code>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};