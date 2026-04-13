import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faTrash,
  faFileAlt,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import type { Backup } from '../../../types/backup';
import { colors } from '../../../styles/colors';

interface BackupHistoryTableProps {
  backups: Backup[];
  loading: boolean;
  onDownload: (backup: Backup) => void;
  onDelete: (backup: Backup) => void;
  onViewLog: (backup: Backup) => void;
}

export const BackupHistoryTable: React.FC<BackupHistoryTableProps> = ({
  backups,
  loading,
  onDownload,
  onDelete,
  onViewLog,
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
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Tamaño</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {backups.map((backup) => (
            <tr key={backup.id}>
              <td style={tdStyle}>
                <div style={{ fontWeight: 500 }}>{backup.nombre_archivo}</div>
                {backup.descripcion && <div style={{ fontSize: '11px', color: '#718096' }}>{backup.descripcion}</div>}
              </td>
              <td style={tdStyle}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 500,
                  backgroundColor: backup.tipo === 'Manual' ? '#EFF6FF' : '#F0FDF4',
                  color: backup.tipo === 'Manual' ? '#3B82F6' : '#10B981',
                }}>
                  {backup.tipo}
                </span>
              </td>
              <td style={tdStyle}>{backup.tamaño_legible}</td>
              <td style={tdStyle}>{formatDate(backup.created_at)}</td>
              <td style={tdStyle}>{getStatusBadge(backup.estado)}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {backup.log_url && (
                    <button
                      style={actionButtonStyle(colors.azulAcero)}
                      onClick={() => onViewLog(backup)}
                      title="Ver log"
                    >
                      <FontAwesomeIcon icon={faFileAlt} />
                    </button>
                  )}
                  <a
                    href={backup.url_descarga}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={actionButtonStyle(colors.doradoClasico)}
                    title="Descargar"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                  <button
                    style={actionButtonStyle('#EF4444')}
                    onClick={() => onDelete(backup)}
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