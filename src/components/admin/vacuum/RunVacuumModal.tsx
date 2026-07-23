import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPlay,
  faSpinner,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { vacuumService } from '../../../services/vacuumService';
import { colors } from '../../../styles/colors';

interface RunVacuumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RunVacuumModal: React.FC<RunVacuumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data: any = {
        analyze: true,
        verbose: false,
        descripcion: descripcion || undefined,
      };
      
      await vacuumService.runManual(data);
      onSuccess();
      onClose();
      setDescripcion('');
    } catch (error) {
      console.error('Error running vacuum:', error);
      alert('Error al ejecutar VACUUM');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
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

  const formGroupStyle: React.CSSProperties = { marginBottom: '20px' };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.azulAcero,
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '60px',
  };

  const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #EDF2F7',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.negroSuave, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FontAwesomeIcon icon={faDatabase} style={{ color: colors.doradoClasico }} />
            Ejecutar VACUUM ANALYZE
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} style={{ color: '#718096', fontSize: '18px' }} />
          </button>
        </div>


        <div style={modalFooterStyle}>
          <button style={buttonStyle('secondary')} onClick={onClose}>
            Cancelar
          </button>
          <button
            style={buttonStyle('primary')}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Ejecutando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlay} />
                Ejecutar VACUUM
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};