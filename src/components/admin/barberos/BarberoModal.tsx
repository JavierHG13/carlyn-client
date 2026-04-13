import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSave,
  faClock,
  faUserTie,
  faCalendarAlt,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Barbero, BarberoFormData } from '../../../types/barbero';
import { colors } from '../../../styles/colors';

interface BarberoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BarberoFormData) => Promise<void>;
  barbero: Barbero | null;
  loading?: boolean;
}

const schema = yup.object({
  especialidad: yup.string()
    .required('La especialidad es obligatoria')
    .min(3, 'La especialidad debe tener al menos 3 caracteres')
    .max(100, 'La especialidad no puede exceder 100 caracteres'),
  años_experiencia: yup.number()
    .required('La experiencia es obligatoria')
    .min(0, 'La experiencia debe ser mayor o igual a 0')
    .max(50, 'La experiencia no puede exceder 50 años'),
  descripcion: yup.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .nullable(),
});

export const BarberoModal: React.FC<BarberoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  barbero,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<BarberoFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (barbero) {
      setValue('especialidad', barbero.especialidad);
      setValue('años_experiencia', barbero.años_experiencia);
      setValue('descripcion', barbero.descripcion || '');
    } else {
      reset({
        especialidad: '',
        años_experiencia: 0,
        descripcion: '',
      });
    }
  }, [barbero, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: BarberoFormData) => {
    await onSave(data);
    onClose();
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

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  });

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical',
  };

  const errorTextStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '12px',
    color: '#EF4444',
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
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faUserTie} style={{ color: colors.doradoClasico }} />
            Editar Barbero: {barbero?.nombre}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '4px' }} />
              Especialidad *
            </label>
            <input
              type="text"
              style={inputStyle(!!errors.especialidad)}
              {...register('especialidad')}
              placeholder="Ej. Cortes Clásicos, Barba, etc."
            />
            {errors.especialidad && <p style={errorTextStyle}>{errors.especialidad.message}</p>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
              Años de Experiencia *
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="1"
              style={inputStyle(!!errors.años_experiencia)}
              {...register('años_experiencia', { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.años_experiencia && <p style={errorTextStyle}>{errors.años_experiencia.message}</p>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '4px' }} />
              Descripción
            </label>
            <textarea
              style={textareaStyle}
              {...register('descripcion')}
              placeholder="Descripción de la especialidad del barbero..."
            />
          </div>

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};