import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDatabase,
  faDownload,
  faUpload,
  faChartPie,
  faTable,
  faTerminal,
  faHistory,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faSync,
  faHdd,
  faUsers,
  faScissors,
  faCalendarCheck,
  faClock,
  faBell,
  faPlug,
  faPlay,
  faTrash,
  faCopy,
  faCode
} from '@fortawesome/free-solid-svg-icons';
import { databaseService } from '../../services/databaseService';
import type { DatabaseStats } from '../../types/database';
import { colors } from '../../styles/colors';

export const AdminDatabase: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'backup' | 'query' | 'tables'>('stats');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [restoreContent, setRestoreContent] = useState('');
  const [restoreMode, setRestoreMode] = useState<'file' | 'text'>('file');
  const [backupHistory, setBackupHistory] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await databaseService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      await databaseService.downloadBackup();
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Error al descargar el backup');
    }
  };

  const handleRestore = async () => {
    if (!restoreContent.trim()) {
      alert('Por favor ingresa el contenido SQL');
      return;
    }

    if (!window.confirm('¿Estás seguro? Esta acción puede modificar o eliminar datos existentes.')) {
      return;
    }

    try {
      await databaseService.restoreDatabase(restoreContent);
      alert('Base de datos restaurada exitosamente');
      setRestoreContent('');
      loadStats(); // Recargar estadísticas
    } catch (error: any) {
      alert(`Error al restaurar: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      alert('Por favor ingresa una consulta SQL');
      return;
    }

    // Verificar que sea SELECT
    if (!query.trim().toLowerCase().startsWith('select')) {
      setQueryError('Solo se permiten consultas SELECT');
      return;
    }

    setQueryLoading(true);
    setQueryError(null);

    try {
      const result = await databaseService.executeQuery(query);
      setQueryResult(result.rows);
    } catch (error: any) {
      setQueryError(error.response?.data?.error || error.message);
      setQueryResult(null);
    } finally {
      setQueryLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setRestoreContent(content);
    };
    reader.readAsText(file);
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
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
    transition: 'all 0.2s',
  });

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #EDF2F7',
  };

  const statItemStyle = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: `${color}10`,
    borderRadius: '10px',
  });

  const statIconStyle = (color: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    fontSize: '24px',
  });

  const queryEditorStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '200px',
    padding: '16px',
    fontFamily: 'monospace',
    fontSize: '14px',
    border: `1px solid ${queryError ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: '8px',
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    marginBottom: '16px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #EDF2F7',
    fontSize: '14px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #EDF2F7',
    fontWeight: 600,
  };

  const tdStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid #EDF2F7',
  };

  const codeBlockStyle: React.CSSProperties = {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    padding: '16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    overflow: 'auto',
    maxHeight: '400px',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          Cargando estadísticas...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FontAwesomeIcon icon={faDatabase} style={{ color: colors.doradoClasico }} />
            Administración de Base de Datos
          </h1>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <div style={tabStyle(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>
            <FontAwesomeIcon icon={faChartPie} style={{ marginRight: '8px' }} />
            Estadísticas
          </div>
          <div style={tabStyle(activeTab === 'backup')} onClick={() => setActiveTab('backup')}>
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
            Backup & Restore
          </div>
          <div style={tabStyle(activeTab === 'query')} onClick={() => setActiveTab('query')}>
            <FontAwesomeIcon icon={faTerminal} style={{ marginRight: '8px' }} />
            Consultas SQL
          </div>
        </div>

        {/* Tab: Estadísticas */}
        {activeTab === 'stats' && stats && (
          <div>
            <div style={statsGridStyle}>
              <div style={statItemStyle('#3B82F6')}>
                <div style={statIconStyle('#3B82F6')}>
                  <FontAwesomeIcon icon={faHdd} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Tamaño DB</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.database_size}</div>
                </div>
              </div>

              <div style={statItemStyle('#10B981')}>
                <div style={statIconStyle('#10B981')}>
                  <FontAwesomeIcon icon={faPlug} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Conexiones</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.connections.total_connections}</div>
                  <div style={{ fontSize: '12px' }}>
                    Activas: {stats.connections.active_connections} | Inactivas: {stats.connections.idle_connections}
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Registros por Tabla</h3>
            
            <div style={statsGridStyle}>
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faUsers} style={{ color: colors.doradoClasico }} />
                  <span style={{ fontWeight: 500 }}>Usuarios</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.usuarios_count}</div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faUsers} style={{ color: '#10B981' }} />
                  <span style={{ fontWeight: 500 }}>Barberos</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.barberos_count}</div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faScissors} style={{ color: '#8B5CF6' }} />
                  <span style={{ fontWeight: 500 }}>Servicios</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.servicios_count}</div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faCalendarCheck} style={{ color: '#F59E0B' }} />
                  <span style={{ fontWeight: 500 }}>Citas</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.citas_count}</div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: '#EF4444' }} />
                  <span style={{ fontWeight: 500 }}>Horarios</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.horarios_barbero_count}</div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faBell} style={{ color: '#EC4899' }} />
                  <span style={{ fontWeight: 500 }}>Notificaciones</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.notificaciones_count}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Backup & Restore */}
        {activeTab === 'backup' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Backup */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FontAwesomeIcon icon={faDownload} style={{ color: colors.doradoClasico }} />
                Descargar Backup
              </h3>
              
              <p style={{ marginBottom: '20px', color: '#718096', fontSize: '14px' }}>
                Descarga un backup completo de la base de datos incluyendo estructura y datos.
              </p>

              <button
                onClick={handleDownloadBackup}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.doradoClasico,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
                Descargar Backup
              </button>
            </div>

            {/* Restore */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FontAwesomeIcon icon={faUpload} style={{ color: '#EF4444' }} />
                Restaurar Backup
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      checked={restoreMode === 'file'}
                      onChange={() => setRestoreMode('file')}
                    />
                    Subir archivo
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      checked={restoreMode === 'text'}
                      onChange={() => setRestoreMode('text')}
                    />
                    Pegar SQL
                  </label>
                </div>

                {restoreMode === 'file' ? (
                  <input
                    type="file"
                    accept=".sql"
                    onChange={handleFileUpload}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px dashed #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <textarea
                    value={restoreContent}
                    onChange={(e) => setRestoreContent(e.target.value)}
                    placeholder="Pega aquí el contenido SQL del backup..."
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                    }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={handleRestore}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  Restaurar
                </button>
                <span style={{ fontSize: '13px', color: '#EF4444' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '4px' }} />
                  Esta acción puede sobrescribir datos
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Consultas SQL */}
        {activeTab === 'query' && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FontAwesomeIcon icon={faCode} style={{ color: colors.doradoClasico }} />
                Ejecutar Consulta SQL
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  backgroundColor: '#F0F4F8', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: '#4A5568'
                }}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '6px', color: colors.doradoClasico }} />
                  Solo se permiten consultas SELECT
                </div>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SELECT * FROM usuarios;"
                  rows={6}
                  style={queryEditorStyle}
                />
              </div>

              {queryError && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  color: '#EF4444',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
                  {queryError}
                </div>
              )}

              <button
                onClick={handleExecuteQuery}
                disabled={queryLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.doradoClasico,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                  opacity: queryLoading ? 0.7 : 1,
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
                {queryLoading ? 'Ejecutando...' : 'Ejecutar Consulta'}
              </button>

              {queryResult && (
                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
                    Resultados ({queryResult.length} filas)
                  </h4>
                  
                  {queryResult.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            {Object.keys(queryResult[0]).map(key => (
                              <th key={key} style={thStyle}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.map((row, i) => (
                            <tr key={i}>
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} style={tdStyle}>
                                  {val !== null ? String(val) : <span style={{ color: '#A0AEC0' }}>NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: '#718096' }}>No se encontraron resultados</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};