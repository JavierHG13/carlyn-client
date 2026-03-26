import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faFileArchive,
  faUser,
  faCalendar,
  faClock,
  faCloud,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faDownload,
  faTrash,
  faInfoCircle,
  faDatabase,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import type { Backup } from '../../../types/database';
import { colors } from '../../../styles/colors';

interface BackupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backup: Backup | null;
  onDownload: (backup: Backup) => void;
  onDelete: (backup: Backup) => void;
}

export const BackupDetailsModal: React.FC<BackupDetailsModalProps> = ({
  isOpen,
  onClose,
  backup,
  onDownload,
  onDelete,
}) => {
  if (!isOpen || !backup) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusIcon = () => {
    switch (backup.estado) {
      case 'Completado':
        return { icon: faCheckCircle, color: '#10B981' };
      case 'En_proceso':
        return { icon: faHourglassHalf, color: '#F59E0B' };
      case 'Fallido':
        return { icon: faTimesCircle, color: '#EF4444' };
      default:
        return { icon: faInfoCircle, color: '#718096' };
    }
  };

  const statusIcon = getStatusIcon();

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#718096',
  };

  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginBottom: '24px',
  };

  const infoItemStyle = (bgColor: string = '#F8FAFC'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: bgColor,
    borderRadius: '10px',
  });

  const infoIconStyle = (color: string): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    fontSize: '18px',
  });

  const infoContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '4px',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: colors.negroSuave,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #EDF2F7',
  };

  const buttonStyle = (variant: 'primary' | 'danger' | 'secondary'): React.CSSProperties => {
    const colorsMap = {
      primary: { bg: colors.doradoClasico, text: 'white' },
      danger: { bg: '#EF4444', text: 'white' },
      secondary: { bg: '#E2E8F0', text: '#475569' },
    };
    return {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      backgroundColor: colorsMap[variant].bg,
      color: colorsMap[variant].text,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    };
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faFileArchive} style={{ color: colors.doradoClasico }} />
            Detalles del Backup
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={infoGridStyle}>
          {/* Archivo */}
          <div style={infoItemStyle()}>
            <div style={infoIconStyle(colors.doradoClasico)}>
              <FontAwesomeIcon icon={faFileArchive} />
            </div>
            <div style={infoContentStyle}>
              <div style={infoLabelStyle}>Archivo</div>
              <div style={infoValueStyle}>{backup.nombre_archivo}</div>
            </div>
          </div>

          {/* Estado */}
          <div style={infoItemStyle(statusIcon.color + '10')}>
            <div style={infoIconStyle(statusIcon.color)}>
              <FontAwesomeIcon icon={statusIcon.icon} />
            </div>
            <div style={infoContentStyle}>
              <div style={infoLabelStyle}>Estado</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 500, color: statusIcon.color }}>
                  {backup.estado === 'Completado' ? 'Completado' :
                   backup.estado === 'En_proceso' ? 'En Proceso' : 'Fallido'}
                </span>
              </div>
            </div>
          </div>

          {/* Tipo y Tamaño */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#3B82F6')}>
                <FontAwesomeIcon icon={faDatabase} />
              </div>
              <div>
                <div style={infoLabelStyle}>Tipo</div>
                <div style={{ fontWeight: 500 }}>{backup.tipo}</div>
              </div>
            </div>

            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#10B981')}>
                <FontAwesomeIcon icon={faDatabase} />
              </div>
              <div>
                <div style={infoLabelStyle}>Tamaño</div>
                <div style={{ fontWeight: 500 }}>{backup.tamaño_legible}</div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div style={infoItemStyle()}>
            <div style={infoIconStyle('#8B5CF6')}>
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div style={infoContentStyle}>
              <div style={infoLabelStyle}>Fecha de Creación</div>
              <div style={infoValueStyle}>{formatDate(backup.created_at)}</div>
            </div>
          </div>

          {backup.expires_at && (
            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#EF4444')}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div style={infoContentStyle}>
                <div style={infoLabelStyle}>Fecha de Expiración</div>
                <div style={infoValueStyle}>{formatDate(backup.expires_at)}</div>
              </div>
            </div>
          )}

          {/* Usuario */}
          <div style={infoItemStyle()}>
            <div style={infoIconStyle('#718096')}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div style={infoContentStyle}>
              <div style={infoLabelStyle}>Creado por</div>
              <div style={infoValueStyle}>
                {backup.usuario_nombre || backup.usuario_email || '—'}
              </div>
            </div>
          </div>

          {/* Cloudinary */}
          <div style={infoItemStyle()}>
            <div style={infoIconStyle('#F59E0B')}>
              <FontAwesomeIcon icon={faCloud} />
            </div>
            <div style={infoContentStyle}>
              <div style={infoLabelStyle}>Cloudinary Key</div>
              <div style={{ fontSize: '13px', fontFamily: 'monospace' }}>{backup.cloud_key}</div>
            </div>
          </div>

          {/* Descripción */}
          {backup.descripcion && (
            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#718096')}>
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <div style={infoContentStyle}>
                <div style={infoLabelStyle}>Descripción</div>
                <div style={infoValueStyle}>{backup.descripcion}</div>
              </div>
            </div>
          )}

          {/* Metadata - Tablas incluidas/excluidas */}
          {backup.metadata && (
            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#718096')}>
                <FontAwesomeIcon icon={faTable} />
              </div>
              <div style={infoContentStyle}>
                <div style={infoLabelStyle}>Información adicional</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>
                  {backup.metadata.tablas_incluidas?.length > 0 && (
                    <div>Tablas incluidas: {backup.metadata.tablas_incluidas.join(', ')}</div>
                  )}
                  {backup.metadata.tablas_excluidas?.length > 0 && (
                    <div>Tablas excluidas: {backup.metadata.tablas_excluidas.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <button style={buttonStyle('secondary')} onClick={onClose}>
            Cerrar
          </button>
          <button style={buttonStyle('primary')} onClick={() => onDownload(backup)}>
            <FontAwesomeIcon icon={faDownload} />
            Descargar
          </button>
          <button style={buttonStyle('danger')} onClick={() => onDelete(backup)}>
            <FontAwesomeIcon icon={faTrash} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};