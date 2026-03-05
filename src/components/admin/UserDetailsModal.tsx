// src/components/admin/UserDetailsModal.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faIdCard,
  faCheckCircle,
  faTimesCircle,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types/user';
import { colors } from '../../styles/colors';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString: string) => {
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
    maxWidth: '500px',
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

  const infoItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
  };

  const infoIconStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: `${colors.doradoClasico}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.doradoClasico,
  };

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '2px',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.negroSuave,
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

  const roleBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#EDF2F7',
    color: '#475569',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: colors.grafito,
    color: 'white',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faUser} style={{ color: colors.doradoClasico }} />
            Detalles del Usuario
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={avatarContainerStyle}>
          <div style={avatarStyle}>
            {user.foto ? (
              <img src={user.foto} alt={user.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.nombre.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <div style={infoLabelStyle}>Nombre completo</div>
              <div style={infoValueStyle}>{user.nombre}</div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <div style={infoLabelStyle}>Email</div>
              <div style={infoValueStyle}>{user.email}</div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div>
              <div style={infoLabelStyle}>Teléfono</div>
              <div style={infoValueStyle}>{user.telefono || 'No registrado'}</div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faIdCard} />
            </div>
            <div>
              <div style={infoLabelStyle}>ID</div>
              <div style={infoValueStyle}>{user.id}</div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faTag} />
            </div>
            <div>
              <div style={infoLabelStyle}>Rol</div>
              <div style={infoValueStyle}>
                <span style={roleBadgeStyle}>{user.rol}</span>
              </div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div>
              <div style={infoLabelStyle}>Estado</div>
              <div style={infoValueStyle}>
                <span style={statusBadgeStyle(user.activo)}>
                  <FontAwesomeIcon icon={user.activo ? faCheckCircle : faTimesCircle} style={{ fontSize: '10px' }} />
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div>
              <div style={infoLabelStyle}>Fecha de registro</div>
              <div style={infoValueStyle}>{formatDate(user.created_at)}</div>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoIconStyle}>
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div>
              <div style={infoLabelStyle}>Última actualización</div>
              <div style={infoValueStyle}>{formatDate(user.updated_at)}</div>
            </div>
          </div>
        </div>

        <div style={footerStyle}>
          <button style={buttonStyle} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};