import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDatabase,
    faHistory,
    faCog,
    faClock,
    faPlus,
    faTrash,
    faEye,
    faSpinner,
    faCloud,
    faCheckCircle,
    faCalendar,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { backupService } from '../../services/backupService';
import type { Backup, BackupConfig, BackupStats } from '../../types/backup';
import { ManualBackupModal } from '../../components/admin/backups/ManualBackupModal';
import { BackupConfigModal } from '../../components/admin/backups/BackupConfigModal';
import { BackupHistoryTable } from '../../components/admin/backups/BackupHistoryTable';
import { LogViewerModal } from '../../components/admin/backups/LogViewerModal';
import { colors } from '../../styles/colors';
import { ScheduledTaskModal } from '../../components/admin/backups/ScheduledTaskModal';
export const AdminBackups: React.FC = () => {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [configs, setConfigs] = useState<BackupConfig[]>([]);
    const [stats, setStats] = useState<BackupStats | null>(null);
    const [cloudinaryStatus, setCloudinaryStatus] = useState<{ conectado: boolean; cloud_name?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'historial' | 'configuraciones'>('historial');

    // Modals state
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [logModalOpen, setLogModalOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
    const [selectedConfig, setSelectedConfig] = useState<BackupConfig | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [scheduledTaskModalOpen, setScheduledTaskModalOpen] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);

            const [backupsData, configsData, statsData, cloudStatus] = await Promise.all([
                backupService.getAll({ limit: 50 }),
                backupService.getConfigs(),
                backupService.getStats(),
                backupService.verifyCloudinary().catch(() => null),
            ]);

            setBackups(backupsData.backups || []);
            setConfigs(configsData.configuraciones || []);
            setStats(statsData.estadisticas);
            setCloudinaryStatus(cloudStatus);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleCreateScheduledTask = () => {
        setSelectedConfig(null);
        setScheduledTaskModalOpen(true);
    };


    const handleDeleteBackup = async (backup: Backup) => {
        if (!window.confirm(`¿Eliminar el backup "${backup.nombre_archivo}"?`)) return;
        try {
            await backupService.delete(backup.id);
            await loadAllData();
        } catch (error) {
            alert('Error al eliminar backup');
        }
    };

    const handleCleanExpired = async () => {
        if (!window.confirm('¿Eliminar todos los backups expirados?')) return;
        try {
            await backupService.cleanExpired();
            await loadAllData();
        } catch (error) {
            alert('Error al limpiar backups expirados');
        }
    };

    const handleToggleConfig = async (config: BackupConfig) => {
        try {
            await backupService.toggleConfig(config.id, !config.activo);
            await loadAllData();
        } catch (error) {
            alert('Error al cambiar estado');
        }
    };

    const handleDeleteConfig = async (config: BackupConfig) => {
        if (!window.confirm(`¿Eliminar la configuración "${config.nombre}"?`)) return;
        try {
            await backupService.deleteConfig(config.id);
            await loadAllData();
        } catch (error) {
            alert('Error al eliminar configuración');
        }
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
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

    const tabsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #EDF2F7',
        paddingBottom: '8px',
    };

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '10px 20px',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 500,
        backgroundColor: isActive ? `${colors.doradoClasico}15` : 'transparent',
        color: isActive ? colors.doradoClasico : '#718096',
        borderBottom: isActive ? `2px solid ${colors.doradoClasico}` : '2px solid transparent',
    });

    const statsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
    };

    const statCardStyle = (color: string): React.CSSProperties => ({
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #EDF2F7',
    });

    const actionButtonsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
    };

    const actionButtonStyle = (bgColor: string): React.CSSProperties => ({
        padding: '8px 12px',
        backgroundColor: bgColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    });

    const buttonStyle = (bgColor: string): React.CSSProperties => ({
        padding: '10px 20px',
        backgroundColor: bgColor,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    });

    const configCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #EDF2F7',
        marginBottom: '16px',
    };

    if (loading && backups.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
            </div>
        );
    }

    return (

        <div style={containerStyle}>
             {/* <div style={headerStyle}>
                <h1 style={titleStyle}>
                    <FontAwesomeIcon icon={faDatabase} style={{ color: colors.doradoClasico }} />
                    Gestión de Backups
                </h1>
            </div>


           
            {stats && (
                <div style={statsGridStyle}>
                    <div style={statCardStyle('#3B82F6')}>
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.total_backups}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Total Backups</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>Manuales: {stats.manuales} | Auto: {stats.automaticos}</div>
                    </div>
                    <div style={statCardStyle('#10B981')}>
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.tamaño_total_legible}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Tamaño Total</div>
                        <div style={{ fontSize: '12px' }}>Promedio: {stats.promedio_tamaño}</div>
                    </div>
                    <div style={statCardStyle('#F59E0B')}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Último Backup</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>{stats.ultimo_backup ? new Date(stats.ultimo_backup).toLocaleDateString() : 'Ninguno'}</div>
                    </div>
                </div>
            )} */}

            {/* Action Buttons */}
            <div style={actionButtonsStyle}>
                <button style={buttonStyle(colors.doradoClasico)} onClick={() => setManualModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    Nuevo Backup
                </button>
            </div>

            {/* Tabs */}
            <div style={tabsStyle}>
                <div style={tabStyle(activeTab === 'historial')} onClick={() => setActiveTab('historial')}>
                    <FontAwesomeIcon icon={faHistory} style={{ marginRight: '8px' }} />
                    Historial de Backups
                </div>
                <div style={tabStyle(activeTab === 'configuraciones')} onClick={() => setActiveTab('configuraciones')}>
                    <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
                    Configuraciones Automáticas
                </div>
            </div>

            {/* Tab: Historial */}
            {activeTab === 'historial' && (
                <BackupHistoryTable
                    backups={backups}
                    loading={loading}
                    onDownload={(backup) => window.open(backup.url_descarga, '_blank')}
                    onDelete={handleDeleteBackup}
                    onViewLog={(backup) => {
                        setSelectedBackup(backup);
                        setLogModalOpen(true);
                    }}
                />
            )}

            {activeTab === 'configuraciones' && (
                <div>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button style={buttonStyle(colors.doradoClasico)} onClick={handleCreateScheduledTask}>
                            <FontAwesomeIcon icon={faPlus} />
                            Nueva Tarea Automatizada
                        </button>
                    </div>

                    {configs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px' }}>
                            <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '48px', opacity: 0.5 }} />
                            <p>No hay tareas automatizadas configuradas</p>
                            <button style={buttonStyle(colors.doradoClasico)} onClick={handleCreateScheduledTask}>
                                <FontAwesomeIcon icon={faPlus} />
                                Crear primera tarea
                            </button>
                        </div>
                    ) : (
                        configs.map((config) => (
                            <div key={config.id} style={configCardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{config.nombre}</h3>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        backgroundColor: config.activo ? '#D1FAE5' : '#FEE2E2',
                                        color: config.activo ? '#10B981' : '#EF4444',
                                    }}>
                                        {config.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                <div style={{ fontSize: '13px', color: '#718096', marginBottom: '12px' }}>
                                    {config.frecuencia === 'Diario' && 'Diario a las '}
                                    {config.frecuencia === 'Semanal' && `Semanal (${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][config.dia_semana]}) a las `}
                                    {config.frecuencia === 'Mensual' && `Mensual (día ${config.dia_mes}) a las `}
                                    {config.hora_ejecucion} • Retención: {config.retencion_dias} días
                                </div>

                                {config.proximo_respaldo && (
                                    <div style={{ fontSize: '12px', color: '#10B981', marginBottom: '8px' }}>
                                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                                        Próxima ejecución: {new Date(config.proximo_respaldo).toLocaleString()}
                                    </div>
                                )}

                                {config.incluir_tablas && config.incluir_tablas.length > 0 && (
                                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>
                                        <strong>Tablas incluidas:</strong> {config.incluir_tablas.join(', ')}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                                    <button
                                        style={actionButtonStyle(colors.azulAcero)}
                                        onClick={() => {
                                            setSelectedConfig(config);
                                            setScheduledTaskModalOpen(true);
                                        }}
                                        title="Editar"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button
                                        style={actionButtonStyle(config.activo ? '#EF4444' : '#10B981')}
                                        onClick={() => handleToggleConfig(config)}
                                        title={config.activo ? 'Desactivar' : 'Activar'}
                                    >
                                        <FontAwesomeIcon icon={config.activo ? 'toggle-off' : 'toggle-on'} />
                                    </button>
                                    <button
                                        style={actionButtonStyle('#EF4444')}
                                        onClick={() => handleDeleteConfig(config)}
                                        title="Eliminar"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modals */}
            <ManualBackupModal
                isOpen={manualModalOpen}
                onClose={() => setManualModalOpen(false)}
                onSuccess={loadAllData}
            />

            <BackupConfigModal
                isOpen={configModalOpen}
                onClose={() => {
                    setConfigModalOpen(false);
                    setSelectedConfig(null);
                }}
                onSave={async (data) => {
                    if (selectedConfig) {
                        await backupService.updateConfig(selectedConfig.id, data);
                    } else {
                        await backupService.createConfig(data);
                    }
                    await loadAllData();
                }}
                config={selectedConfig}
                loading={modalLoading}
            />

            <ScheduledTaskModal
                isOpen={scheduledTaskModalOpen}
                onClose={() => {
                    setScheduledTaskModalOpen(false);
                    setSelectedConfig(null);
                }}
                onSuccess={loadAllData}
                config={selectedConfig}
                loading={modalLoading}
            />

            <LogViewerModal
                isOpen={logModalOpen}
                onClose={() => {
                    setLogModalOpen(false);
                    setSelectedBackup(null);
                }}
                logUrl={selectedBackup?.log_url || null}
                logFileName={selectedBackup?.nombre_archivo || ''}
            />
        </div>
    );
};