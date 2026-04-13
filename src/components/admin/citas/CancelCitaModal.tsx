import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../styles/colors';

interface CancelCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
  citaInfo?: { id: number; cliente_nombre: string; fecha: string; hora_inicio: string };
  loading?: boolean;
}

export const CancelCitaModal: React.FC<CancelCitaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  citaInfo,
  loading = false,
}) => {
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm(motivo);
    setMotivo('');
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
    maxWidth: '450px',
    position: 'relative',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#EF4444',
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

  const infoStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.azulAcero,
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    minHeight: '80px',
    marginBottom: '20px',
    resize: 'vertical',
  };

  const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  };

  const buttonStyle = (variant: 'danger' | 'secondary'): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: variant === 'danger' ? '#EF4444' : '#E2E8F0',
    color: variant === 'danger' ? 'white' : '#475569',
  });

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Cancelar Cita
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {citaInfo && (
          <div style={infoStyle}>
            <strong>{citaInfo.cliente_nombre}</strong>
            <br />
            {citaInfo.fecha} a las {citaInfo.hora_inicio.slice(0, 5)}
          </div>
        )}

        <label style={labelStyle}>Motivo de cancelación</label>
        <textarea
          style={textareaStyle}
          placeholder="Ej. Cliente canceló, falta de disponibilidad, etc."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <div style={modalFooterStyle}>
          <button style={buttonStyle('secondary')} onClick={onClose}>
            Volver
          </button>
          <button style={buttonStyle('danger')} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
          </button>
        </div>
      </div>
    </div>
  );
};