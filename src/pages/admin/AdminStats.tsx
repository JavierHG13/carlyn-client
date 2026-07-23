import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDatabase,
    faChartLine,
    faExclamationTriangle,
    faPlug,
    faTable,
    faClock,
    faArrowTrendUp,
    faRotateRight,
    faGaugeHigh,
    faChartSimple,
    faMemory,
    faMicrochip,
    faCheckCircle,
    faTimesCircle,
    faWarning,
    faServer,
    faKey,
    faHdd,
    faLayerGroup,
    faUser,
    faList,
    faEye,
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
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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

    useEffect(() => {
        loadAllStats();
        const interval = setInterval(loadAllStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (uptime: any) => {
        if (!uptime) return 'N/A';
        if (typeof uptime === 'object') {
            if (Object.keys(uptime).length === 0) return '—';
            const { days = 0, hours = 0, minutes = 0, seconds = 0 } = uptime;
            if (days > 0) return `${days} días ${hours} horas`;
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return uptime;
    };

    const formatNumber = (num: number) => num.toLocaleString();

    const getHealthColor = (value: number, isGood: boolean) => {
        if (isGood) return value > 95 ? '#10B981' : value > 80 ? '#F59E0B' : '#EF4444';
        return value < 10 ? '#10B981' : value < 30 ? '#F59E0B' : '#EF4444';
    };

    const getHealthText = (value: number, isGood: boolean) => {
        if (isGood) {
            if (value > 95) return 'Excelente';
            if (value > 80) return 'Bueno';
            return 'Necesita atención';
        }
        if (value < 10) return 'Excelente';
        if (value < 30) return 'Bueno';
        return 'Necesita atención';
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
        padding: '24px',
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
    };

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
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '12px',
    };

    const metricCardStyle = (color: string): React.CSSProperties => ({
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #EDF2F7',
        textAlign: 'center',
    });

    const healthBadgeStyle = (color: string): React.CSSProperties => ({
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: `${color}15`,
        color: color,
        marginTop: '8px',
    });

    const tableContainerStyle: React.CSSProperties = {
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        backgroundColor: 'white',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px',
    };

    const thStyle: React.CSSProperties = {
        textAlign: 'left',
        padding: '12px 16px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        color: '#475569',
        fontSize: '13px',
        fontWeight: 600,
    };

    const tdStyle: React.CSSProperties = {
        padding: '10px 16px',
        borderBottom: '1px solid #F1F5F9',
        fontSize: '13px',
        color: '#1E293B',
    };

    // Estilos para la gráfica de barras
    const chartContainerStyle: React.CSSProperties = {
        marginTop: '16px',
    };

    const barItemStyle: React.CSSProperties = {
        marginBottom: '16px',
    };

    const barLabelStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '13px',
    };

    const barBackgroundStyle: React.CSSProperties = {
        height: '8px',
        backgroundColor: '#E2E8F0',
        borderRadius: '4px',
        overflow: 'hidden',
    };

    const barFillStyle = (percentage: number): React.CSSProperties => ({
        width: `${Math.min(percentage, 100)}%`,
        height: '100%',
        backgroundColor: percentage > 70 ? '#10B981' : percentage > 40 ? colors.doradoClasico : '#F59E0B',
        borderRadius: '4px',
        transition: 'width 0.3s ease',
    });

    if (loading && !server) {
        return (
            <div style={{ textAlign: 'center', padding: '80px' }}>
                <FontAwesomeIcon icon={faRotateRight} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
                <p style={{ marginTop: '16px', color: colors.azulAcero }}>Cargando información...</p>
            </div>
        );
    }

    // Calcular el porcentaje de uso de índices para cada tabla
    const topIndexTables = [...indexes]
        .sort((a, b) => b.index_usage_pct - a.index_usage_pct)
        .slice(0, 8)
        .filter(t => t.index_usage_pct > 0);

    return (
        <div style={containerStyle}>

            {/* Resumen General */}
            {server && transactions && (
                <div style={statsGridStyle}>
                    <div style={metricCardStyle(colors.doradoClasico)}>
                        <FontAwesomeIcon icon={faDatabase} style={{ fontSize: '32px', color: colors.doradoClasico, marginBottom: '8px' }} />
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{server.size}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Tamaño de la Base de Datos</div>
                    </div>
                    <div style={metricCardStyle(colors.doradoClasico)}>
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: '32px', color: colors.doradoClasico, marginBottom: '8px' }} />
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatUptime(server.uptime)}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Tiempo Activo</div>
                    </div>
                    <div style={metricCardStyle(getHealthColor(transactions.cache_hit_ratio, true))}>
                        <FontAwesomeIcon icon={faMemory} style={{ fontSize: '32px', color: getHealthColor(transactions.cache_hit_ratio, true), marginBottom: '8px' }} />
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{transactions.cache_hit_ratio}%</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Rendimiento de Caché</div>
                        <div style={healthBadgeStyle(getHealthColor(transactions.cache_hit_ratio, true))}>
                            {getHealthText(transactions.cache_hit_ratio, true)}
                        </div>
                    </div>
                </div>
            )}

            {/* Estado General */}
            {alerts && (
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'green' }} />
                        Estado General
                    </h3>

                    <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Actividad de la Base de Datos</div>
                        <div style={{ fontSize: '16px', fontWeight: 500 }}>
                            {formatNumber(transactions?.rows_inserted || 0)} insertados
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 500 }}>
                            {formatNumber(transactions?.rows_updated || 0)} actualizados
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 500 }}>
                            {formatNumber(transactions?.rows_deleted || 0)} eliminados
                        </div>
                    </div>
                </div>

            )}

            {/* Tablas que necesitan mantenimiento */}
            {deadTuples.length > 0 && (
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>
                        <FontAwesomeIcon icon={faWarning} style={{ color: '#F59E0B' }} />
                        Tablas que Requieren Mantenimiento
                    </h3>
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Tabla</th>
                                    <th style={thStyle}>Registros para limpiar</th>
                                    <th style={thStyle}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deadTuples.slice(0, 5).map((tuple, idx) => (
                                    <tr key={idx}>
                                        <td style={tdStyle}>{tuple.table_name}</td>
                                        <td style={tdStyle}>{formatNumber(tuple.dead_rows)}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                backgroundColor: tuple.dead_ratio_pct > 10 ? '#FEE2E2' : '#D1FAE5',
                                                color: tuple.dead_ratio_pct > 10 ? '#EF4444' : '#10B981',
                                            }}>
                                                {tuple.dead_ratio_pct > 10 ? '⚠️ Requiere atención' : '✓ En buen estado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {/* Tamaño de Tablas */}
            {tables.length > 0 && (
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>
                        <FontAwesomeIcon icon={faTable} />
                        Tamaño de las Tablas
                    </h3>
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Tabla</th>
                                    <th style={thStyle}>Tamaño Total</th>
                                    <th style={thStyle}>Registros</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.slice(0, 8).map((table, idx) => (
                                    <tr key={idx}>
                                        <td style={tdStyle}>{table.table_name}</td>
                                        <td style={tdStyle}>{table.total_size}</td>
                                        <td style={tdStyle}>{formatNumber(table.live_rows)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Conexiones Activas */}
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
                                    <th style={thStyle}>Usuario</th>
                                    <th style={thStyle}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {connections.slice(0, 5).map((conn, idx) => (
                                    <tr key={idx}>
                                        <td style={tdStyle}>{conn.username}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                backgroundColor: conn.state === 'active' ? '#D1FAE5' : '#FEF3C7',
                                                color: conn.state === 'active' ? '#10B981' : '#F59E0B',
                                            }}>
                                                {conn.state === 'active' ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )}


            {/* GRÁFICA: Tablas que mejor usan los índices */}
            {topIndexTables.length > 0 && (
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>
                        <FontAwesomeIcon icon={faChartSimple} style={{ color: colors.doradoClasico }} />
                        Tablas con mejor rendimiento de búsqueda
                    </h3>
                    <p style={{ fontSize: '13px', color: '#718096', marginBottom: '16px' }}>
                        Porcentaje de consultas que usan índices correctamente
                    </p>
                    <div style={chartContainerStyle}>
                        {topIndexTables.map((item, idx) => {
                            const tableName = item.table_name.split('.').pop() || item.table_name;
                            const percentage = item.index_usage_pct;
                            let statusText = '';
                            let statusColor = '';

                           
                            return (
                                <div key={idx} style={barItemStyle}>
                                    <div style={barLabelStyle}>
                                        <span style={{ fontWeight: 500 }}>{tableName}</span>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <span style={{ color: statusColor, fontSize: '12px' }}>{statusText}</span>
                                            <span style={{ fontWeight: 600, color: colors.doradoClasico }}>{percentage}%</span>
                                        </div>
                                    </div>
                                    <div style={barBackgroundStyle}>
                                        <div style={barFillStyle(percentage)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#718096', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '2px', marginRight: '4px' }}></span> Excelente (&gt;70%)</span>
                        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: colors.doradoClasico, borderRadius: '2px', marginRight: '4px' }}></span> Bueno (40-70%)</span>
                        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#F59E0B', borderRadius: '2px', marginRight: '4px' }}></span> Mejorable (&lt;40%)</span>
                    </div>
                </div>
            )}


        </div>

        
    );
};