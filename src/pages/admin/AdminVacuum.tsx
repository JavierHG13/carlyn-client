import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDatabase,
  faHistory,
  faCog,
  faPlus,
  faTrash,
  faSpinner,
  faClock,
  faChartLine,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { vacuumService } from '../../services/vacuumService';
import type { Vacuum, VacuumConfig } from '../../types/vacuum';
import { RunVacuumModal } from '../../components/admin/vacuum/RunVacuumModal';
import { VacuumConfigModal } from '../../components/admin/vacuum/VacuumConfigModal';
import { VacuumHistoryTable } from '../../components/admin/vacuum/VacuumHistoryTable';
import { LogViewerModal } from '../../components/admin/backups/LogViewerModal';
import { colors } from '../../styles/colors';

export const AdminVacuum: React.FC = () => {
  const [vacuums, setVacuums] = useState<Vacuum[]>([]);
  const [configs, setConfigs] = useState<VacuumConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'historial' | 'configuraciones'>('historial');
  
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedVacuum, setSelectedVacuum] = useState<Vacuum | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<VacuumConfig | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [vacuumsData, configsData] = await Promise.all([
        vacuumService.getAll({ limit: 50 }),
        vacuumService.getConfigs(),
      ]);
      
      setVacuums(vacuumsData.vacuums || []);
      setConfigs(configsData.configuraciones || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVacuum = async (vacuum: Vacuum) => {
    if (!window.confirm(`¿Eliminar el registro de VACUUM #${vacuum.id}?`)) return;
    try {
      await vacuumService.delete(vacuum.id);
      await loadAllData();
    } catch (error) {
      alert('Error al eliminar registro');
    }
  };

  const handleToggleConfig = async (config: VacuumConfig) => {
    try {
      await vacuumService.toggleConfig(config.id, !config.activo);
      await loadAllData();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const handleDeleteConfig = async (config: VacuumConfig) => {
    if (!window.confirm(`¿Eliminar la configuración "${config.nombre}"?`)) return;
    try {
      await vacuumService.deleteConfig(config.id);
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

  const actionButtonStyle = (color: string): React.CSSProperties => ({
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: color,
    cursor: 'pointer',
    fontSize: '14px',
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  // Calcular estadísticas
  const totalEjecuciones = vacuums.length;
  const ultimaEjecucion = vacuums[0]?.created_at;
  const promedioDuracion = vacuums.length > 0 
    ? vacuums.reduce((acc, v) => acc + v.duracion_ms, 0) / vacuums.length 
    : 0;

  const formatDuracion = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (loading && vacuums.length === 0) {
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
            VACUUM ANALYZE
          </h1>
        </div>

  
        <div style={statsGridStyle}>
          <div style={statCardStyle('#3B82F6')}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{totalEjecuciones}</div>
            <div style={{ fontSize: '13px', color: '#718096' }}>Total ejecuciones</div>
          </div>
          <div style={statCardStyle('#10B981')}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatDuracion(promedioDuracion)}</div>
            <div style={{ fontSize: '13px', color: '#718096' }}>Duración promedio</div>
          </div>
          <div style={statCardStyle('#F59E0B')}>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>Última ejecución</div>
            <div style={{ fontSize: '13px', color: '#718096' }}>
              {ultimaEjecucion ? new Date(ultimaEjecucion).toLocaleDateString() : 'Ninguna'}
            </div>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div style={actionButtonsStyle}>
          <button style={buttonStyle(colors.doradoClasico)} onClick={() => setRunModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} />
            Ejecutar VACUUM
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <div style={tabStyle(activeTab === 'historial')} onClick={() => setActiveTab('historial')}>
            <FontAwesomeIcon icon={faHistory} style={{ marginRight: '8px' }} />
            Historial de Ejecuciones
          </div>
          <div style={tabStyle(activeTab === 'configuraciones')} onClick={() => setActiveTab('configuraciones')}>
            <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
            Tareas Automatizadas
          </div>
        </div>

        {/* Tab: Historial */}
        {activeTab === 'historial' && (
          <VacuumHistoryTable
            vacuums={vacuums}
            loading={loading}
            onViewLog={(vacuum) => {
              setSelectedVacuum(vacuum);
              setLogModalOpen(true);
            }}
            onDelete={handleDeleteVacuum}
          />
        )}

        {/* Tab: Configuraciones */}
        {activeTab === 'configuraciones' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={buttonStyle(colors.doradoClasico)} onClick={() => {
                setSelectedConfig(null);
                setConfigModalOpen(true);
              }}>
                <FontAwesomeIcon icon={faPlus} />
                Agregar tarea
              </button>
            </div>

            {configs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px' }}>
                <FontAwesomeIcon icon={faCog} style={{ fontSize: '48px', opacity: 0.5 }} />
                <p>No hay tareas configuradas</p>
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
                    {config.frecuencia === 'Semanal' && `Semanal (${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][config.dia_semana!]}) a las `}
                    {config.frecuencia === 'Mensual' && `Mensual (día ${config.dia_mes}) a las `}
                    {config.hora_ejecucion}
                  </div>

                  <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>
                    <strong>Opciones:</strong> {config.vacuum_analyze && 'ANALYZE '}{config.vacuum_verbose && 'VERBOSE'}
                    {!config.vacuum_analyze && !config.vacuum_verbose && 'Solo VACUUM'}
                  </div>

                  {config.tablas && config.tablas.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>
                      <strong>Tablas:</strong> {config.tablas.join(', ')}
                    </div>
                  )}

                  {config.proximo_vacuum && (
                    <div style={{ fontSize: '12px', color: '#10B981', marginBottom: '8px' }}>
                      <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                      Próxima ejecución: {new Date(config.proximo_vacuum).toLocaleString()}
                    </div>
                  )}

                  <div style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>
                    Total ejecuciones: {config.total_ejecuciones}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      style={actionButtonStyle(colors.azulAcero)}
                      onClick={() => {
                        setSelectedConfig(config);
                        setConfigModalOpen(true);
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
        <RunVacuumModal
          isOpen={runModalOpen}
          onClose={() => setRunModalOpen(false)}
          onSuccess={loadAllData}
        />

        <VacuumConfigModal
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
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
            setSelectedVacuum(null);
          }}
          logUrl={selectedVacuum?.log_url || null}
          logFileName={`vacuum_${selectedVacuum?.id || ''}`}
        />
      </div>
  );
};