import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faFileAlt,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import type { Vacuum } from '../../../types/vacuum';
import { colors } from '../../../styles/colors';

interface VacuumHistoryTableProps {
  vacuums: Vacuum[];
  loading: boolean;
  onViewLog: (vacuum: Vacuum) => void;
  onDelete: (vacuum: Vacuum) => void;
}

export const VacuumHistoryTable: React.FC<VacuumHistoryTableProps> = ({
  vacuums,
  loading,
  onViewLog,
  onDelete,
}) => {
  const getStatusBadge = (estado: string) => {
    const config = {
      Completado: { bg: '#D1FAE5', color: '#10B981', icon: faCheckCircle },
      EnProceso: { bg: '#FEF3C7', color: '#F59E0B', icon: faClock },
      Fallido: { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle },
    };
    const style = config[estado as keyof typeof config] || config.Completado;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color,
      }}>
        <FontAwesomeIcon icon={style.icon} style={{ fontSize: '10px' }} />
        {estado}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuracion = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
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

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #EDF2F7',
    backgroundColor: 'white',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '14px 16px',
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #EDF2F7',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
  };

  const tdStyle: React.CSSProperties = {
    padding: '14px 16px',
    borderBottom: '1px solid #EDF2F7',
    fontSize: '13px',
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando historial...</div>;
  }

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Tablas</th>
            <th style={thStyle}>Opciones</th>
            <th style={thStyle}>Duración</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vacuums.map((vacuum) => (
            <tr key={vacuum.id}>
              <td style={tdStyle}>#{vacuum.id}</td>
              <td style={tdStyle}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 500,
                  backgroundColor: vacuum.tipo === 'Manual' ? '#EFF6FF' : '#F0FDF4',
                  color: vacuum.tipo === 'Manual' ? '#3B82F6' : '#10B981',
                }}>
                  {vacuum.tipo}
                </span>
              </td>
              <td style={tdStyle}>
                {vacuum.tablas.length === 0 ? (
                  <span style={{ color: '#718096' }}>Todas las tablas</span>
                ) : (
                  <span title={vacuum.tablas.join(', ')}>
                    {vacuum.tablas.length} tabla(s)
                  </span>
                )}
              </td>
              <td style={tdStyle}>
                <span style={{ fontSize: '11px' }}>
                  {vacuum.vacuum_analyze && 'ANALYZE '}
                  {vacuum.vacuum_verbose && 'VERBOSE'}
                  {!vacuum.vacuum_analyze && !vacuum.vacuum_verbose && 'Solo VACUUM'}
                </span>
              </td>
              <td style={tdStyle}>{formatDuracion(vacuum.duracion_ms)}</td>
              <td style={tdStyle}>{formatDate(vacuum.created_at)}</td>
              <td style={tdStyle}>{getStatusBadge(vacuum.estado)}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    style={actionButtonStyle(colors.azulAcero)}
                    onClick={() => onViewLog(vacuum)}
                    title="Ver log"
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
                  </button>
                  <button
                    style={actionButtonStyle('#EF4444')}
                    onClick={() => onDelete(vacuum)}
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};