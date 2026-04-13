import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faUserTie,
  faCut,
  faCalendarAlt,
  faClock,
  faDollarSign,
  faInfoCircle,
  faPhone,
  faEnvelope,
  faTag,
  faCheckCircle,
  faTimesCircle,
  faClock as faClockIcon,
} from '@fortawesome/free-solid-svg-icons';
import type { Cita } from '../../../types/citas';
import { colors } from '../../../styles/colors';

interface CitaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
}

export const CitaDetailsModal: React.FC<CitaDetailsModalProps> = ({
  isOpen,
  onClose,
  cita,
}) => {
  if (!isOpen || !cita) return null;

  const getEstadoBadge = () => {
    const estadoConfig: Record<string, { bg: string; color: string; icon: any }> = {
      'Pendiente': { bg: '#FEF3C7', color: '#F59E0B', icon: faClockIcon },
      'Confirmada': { bg: '#DBEAFE', color: '#3B82F6', icon: faCheckCircle },
      'Completada': { bg: '#D1FAE5', color: '#10B981', icon: faCheckCircle },
      'Cancelada': { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle },
      'No_asistio': { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle },
    };
    
    const config = estadoConfig[cita.estado_nombre] || { bg: '#E2E8F0', color: '#475569', icon: faClockIcon };
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
      }}>
        <FontAwesomeIcon icon={config.icon} />
        {cita.estado_nombre}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '800px',
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

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.negroSuave,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '8px',
  };

  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  };

  const infoItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const infoIconStyle = (color: string): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
  });

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#718096',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.negroSuave,
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: colors.doradoClasico }} />
            Detalles de la Cita #{cita.id}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: colors.doradoClasico }}>
              {formatFecha(cita.fecha)}
            </div>
            <div style={{ fontSize: '16px', color: '#718096', marginTop: '4px' }}>
              {cita.hora_inicio.slice(0, 5)} - {cita.hora_fin.slice(0, 5)}
            </div>
          </div>
          {getEstadoBadge()}
        </div>

        {/* Información del Cliente */}
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>
            <FontAwesomeIcon icon={faUser} style={{ color: colors.doradoClasico }} />
            Información del Cliente
          </h4>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <div style={infoIconStyle(colors.doradoClasico)}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>
                <div style={infoLabelStyle}>Nombre</div>
                <div style={infoValueStyle}>{cita.cliente_nombre}</div>
              </div>
            </div>
            <div style={infoItemStyle}>
              <div style={infoIconStyle('#3B82F6')}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <div style={infoLabelStyle}>Email</div>
                <div style={infoValueStyle}>{cita.cliente_email}</div>
              </div>
            </div>
            <div style={infoItemStyle}>
              <div style={infoIconStyle('#10B981')}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <div style={infoLabelStyle}>Teléfono</div>
                <div style={infoValueStyle}>{cita.cliente_telefono}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Barbero */}
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>
            <FontAwesomeIcon icon={faUserTie} style={{ color: colors.doradoClasico }} />
            Información del Barbero
          </h4>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <div style={infoIconStyle(colors.doradoClasico)}>
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <div>
                <div style={infoLabelStyle}>Nombre</div>
                <div style={infoValueStyle}>{cita.barbero_nombre}</div>
              </div>
            </div>
            <div style={infoItemStyle}>
              <div style={infoIconStyle('#8B5CF6')}>
                <FontAwesomeIcon icon={faTag} />
              </div>
              <div>
                <div style={infoLabelStyle}>Especialidad</div>
                <div style={infoValueStyle}>{cita.barbero_especialidad}</div>
              </div>
            </div>
            <div style={infoItemStyle}>
              <div style={infoIconStyle('#10B981')}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <div style={infoLabelStyle}>Teléfono</div>
                <div style={infoValueStyle}>{cita.barbero_telefono}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Servicio */}
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>
            <FontAwesomeIcon icon={faCut} style={{ color: colors.doradoClasico }} />
            Información del Servicio
          </h4>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <div style={infoIconStyle(colors.doradoClasico)}>
                <FontAwesomeIcon icon={faCut} />
              </div>
              <div>
                <div style={infoLabelStyle}>Servicio</div>
                <div style={infoValueStyle}>{cita.servicio_nombre}</div>
              </div>
            </div>
            <div style={infoItemStyle}>
              <div style={infoIconStyle('#F59E0B')}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <div style={infoLabelStyle}>Duración</div>
                <div style={infoValueStyle}>{cita.servicio_duracion} minutos</div>
              </div>
            </div>
            <div style={infoItemStyle}>
              <div style={infoIconStyle(colors.doradoClasico)}>
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div>
                <div style={infoLabelStyle}>Precio</div>
                <div style={infoValueStyle}>${cita.servicio_precio.toFixed(2)}</div>
              </div>
            </div>
            {cita.monto_pagado && (
              <div style={infoItemStyle}>
                <div style={infoIconStyle('#10B981')}>
                  <FontAwesomeIcon icon={faDollarSign} />
                </div>
                <div>
                  <div style={infoLabelStyle}>Monto Pagado</div>
                  <div style={infoValueStyle}>${cita.monto_pagado.toFixed(2)}</div>
                </div>
              </div>
            )}
            {cita.metodo_pago_nombre && (
              <div style={infoItemStyle}>
                <div style={infoIconStyle('#8B5CF6')}>
                  <FontAwesomeIcon icon={faTag} />
                </div>
                <div>
                  <div style={infoLabelStyle}>Método de Pago</div>
                  <div style={infoValueStyle}>{cita.metodo_pago_nombre}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        {cita.notas && (
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: colors.doradoClasico }} />
              Notas
            </h4>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#475569' }}>{cita.notas}</p>
          </div>
        )}

        {/* Motivo de Cancelación */}
        {cita.motivo_cancelacion && (
          <div style={{ ...sectionStyle, backgroundColor: '#FEE2E2' }}>
            <h4 style={{ ...sectionTitleStyle, color: '#EF4444' }}>
              <FontAwesomeIcon icon={faTimesCircle} />
              Motivo de Cancelación
            </h4>
            <p style={{ margin: 0, color: '#EF4444' }}>{cita.motivo_cancelacion}</p>
          </div>
        )}
      </div>
    </div>
  );
};