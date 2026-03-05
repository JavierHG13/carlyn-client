// src/components/admin/UserModal.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faTag,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import type { User, CreateUserData, UpdateUserData } from '../../types/user';
import { colors } from '../../styles/colors';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserData | UpdateUserData) => void;
  user?: User | null;
  loading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    rol_id: 3, // Por defecto Cliente (ajusta según tu BD)
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        password: '',
        telefono: user.telefono || '',
        rol_id: user.rol === 'Admin' ? 1 : user.rol === 'Barbero' ? 2 : 3,
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        rol_id: 3,
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#718096',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.azulAcero,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid #E2E8F0`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid #E2E8F0`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
  };

  const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: variant === 'primary' ? colors.doradoClasico : '#E2E8F0',
    color: variant === 'primary' ? 'white' : '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
              Nombre Completo
            </label>
            <input
              type="text"
              style={inputStyle}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
              Email
            </label>
            <input
              type="email"
              style={inputStyle}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="usuario@email.com"
            />
          </div>

          {!user && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
                Contraseña
              </label>
              <input
                type="password"
                style={inputStyle}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
              Teléfono
            </label>
            <input
              type="tel"
              style={inputStyle}
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px' }} />
              Rol
            </label>
            <select
              style={selectStyle}
              value={formData.rol_id}
              onChange={(e) => setFormData({ ...formData, rol_id: parseInt(e.target.value) })}
            >
              <option value="3">Cliente</option>
              <option value="2">Barbero</option>
              <option value="1">Administrador</option>
            </select>
          </div>

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};