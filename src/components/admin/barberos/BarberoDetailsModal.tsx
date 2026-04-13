import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faStar,
  faStarHalfAlt,
  faClock,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Barbero } from '../../../types/barbero';
import { colors } from '../../../styles/colors';

interface BarberoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbero: Barbero | null;
}

export const BarberoDetailsModal: React.FC<BarberoDetailsModalProps> = ({
  isOpen,
  onClose,
  barbero,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !barbero) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: '#FBBF24' }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} style={{ color: '#FBBF24' }} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: '#E2E8F0' }} />);
      }
    }
    return stars;
  };

  const getDiaNombre = (dia: number) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
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

  const avatarContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: colors.doradoClasico,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '40px',
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

  const horariosGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '8px',
    marginTop: '8px',
  };

  const horarioItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    fontSize: '13px',
  };

  const statusBadgeStyle = (activo: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: activo ? '#D1FAE5' : '#FEE2E2',
    color: activo ? '#10B981' : '#EF4444',
  });

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faUser} style={{ color: colors.doradoClasico }} />
            Detalles del Barbero
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={avatarContainerStyle}>
          {barbero.foto && !imageError ? (
            <img
              src={barbero.foto}
              alt={barbero.nombre}
              style={avatarStyle}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={avatarStyle}>
              {barbero.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div style={infoGridStyle}>
          <div style={infoItemStyle()}>
            <div style={infoIconStyle(colors.doradoClasico)}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Nombre Completo</div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>{barbero.nombre}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#3B82F6')}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Email</div>
                <div style={{ fontSize: '14px' }}>{barbero.email}</div>
              </div>
            </div>

            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#10B981')}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Teléfono</div>
                <div style={{ fontSize: '14px' }}>{barbero.telefono || 'No registrado'}</div>
              </div>
            </div>
          </div>

          <div style={infoItemStyle()}>
            <div style={infoIconStyle('#8B5CF6')}>
              <FontAwesomeIcon icon={faUserTie} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Especialidad</div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>{barbero.especialidad || '—'}</div>
              {barbero.descripcion && (
                <div style={{ fontSize: '13px', color: '#718096', marginTop: '8px' }}>
                  {barbero.descripcion}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#F59E0B')}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Experiencia</div>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>{barbero.años_experiencia} años</div>
              </div>
            </div>

            <div style={infoItemStyle()}>
              <div style={infoIconStyle('#FBBF24')}>
                <FontAwesomeIcon icon={faStar} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Calificación</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {renderStars(barbero.calificacion)}
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>({barbero.calificacion})</span>
                </div>
              </div>
            </div>
          </div>

          <div style={infoItemStyle()}>
            <div style={infoIconStyle('#718096')}>
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Horario de Trabajo</div>
              <div style={horariosGridStyle}>
                {barbero.horarios && barbero.horarios.length > 0 ? (
                  barbero.horarios.map((h) => (
                    <div key={h.dia_semana} style={horarioItemStyle}>
                      <span style={{ fontWeight: 500 }}>{getDiaNombre(h.dia_semana)}</span>
                      <span>
                        {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                      </span>
                      <span style={{ color: h.activo ? '#10B981' : '#EF4444', fontSize: '11px' }}>
                        {h.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#A0AEC0' }}>Sin horario configurado</span>
                )}
              </div>
            </div>
          </div>

          <div style={infoItemStyle()}>
            <div style={infoIconStyle(barbero.activo ? '#10B981' : '#EF4444')}>
              <FontAwesomeIcon icon={barbero.activo ? faCheckCircle : faTimesCircle} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Estado</div>
              <div>
                <span style={statusBadgeStyle(barbero.activo)}>
                  {barbero.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div style={infoItemStyle()}>
            <div style={infoIconStyle('#718096')}>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Fecha de Registro</div>
              <div style={{ fontSize: '14px' }}>{formatDate(barbero.created_at)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};