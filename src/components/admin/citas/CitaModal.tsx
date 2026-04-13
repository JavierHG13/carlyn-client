import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSave,
  faUser,
  faUserTie,
  faCut,
  faCalendarAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { Cita, CreateCitaData, UpdateCitaData } from '../../../types/citas';
import { colors } from '../../../styles/colors';

interface CitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCitaData | UpdateCitaData) => Promise<void>;
  cita?: Cita | null;
  loading?: boolean;
  barberos?: Array<{ id: number; nombre: string }>;
  servicios?: Array<{ id: number; nombre: string; precio: number; duracion: number }>;
  estados?: Array<{ id: number; nombre: string }>;
}

const schema = yup.object({
  clienteId: yup.number().required('El cliente es obligatorio').positive(),
  barberoId: yup.number().required('El barbero es obligatorio').positive(),
  servicioId: yup.number().required('El servicio es obligatorio').positive(),
  fecha: yup.string().required('La fecha es obligatoria'),
  horaInicio: yup.string().required('La hora de inicio es obligatoria'),
  estadoId: yup.number().required('El estado es obligatorio').positive(),
  notas: yup.string().nullable(),
});

export const CitaModal: React.FC<CitaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cita,
  loading = false,
  barberos = [],
  servicios = [],
  estados = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateCitaData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (cita) {
      setValue('clienteId', cita.cliente_id);
      setValue('barberoId', cita.barbero_id);
      setValue('servicioId', cita.servicio_id);
      setValue('fecha', cita.fecha);
      setValue('horaInicio', cita.hora_inicio.slice(0, 5));
      setValue('estadoId', cita.estado_id);
      setValue('notas', cita.notas || '');
    } else {
      reset({
        clienteId: 0,
        barberoId: 0,
        servicioId: 0,
        fecha: '',
        horaInicio: '',
        estadoId: 1,
        notas: '',
      });
    }
  }, [cita, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateCitaData) => {
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

  const selectStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
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

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
            {cita ? 'Editar Cita' : 'Nueva Cita'}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Cliente ID</label>
              <input
                type="number"
                style={inputStyle(!!errors.clienteId)}
                {...register('clienteId', { valueAsNumber: true })}
                placeholder="ID del cliente"
              />
              {errors.clienteId && <p style={errorTextStyle}>{errors.clienteId.message}</p>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Barbero</label>
              <select
                style={selectStyle(!!errors.barberoId)}
                {...register('barberoId', { valueAsNumber: true })}
              >
                <option value={0}>Seleccionar barbero</option>
                {barberos.map(barbero => (
                  <option key={barbero.id} value={barbero.id}>{barbero.nombre}</option>
                ))}
              </select>
              {errors.barberoId && <p style={errorTextStyle}>{errors.barberoId.message}</p>}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Servicio</label>
              <select
                style={selectStyle(!!errors.servicioId)}
                {...register('servicioId', { valueAsNumber: true })}
              >
                <option value={0}>Seleccionar servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - ${servicio.precio} ({servicio.duracion} min)
                  </option>
                ))}
              </select>
              {errors.servicioId && <p style={errorTextStyle}>{errors.servicioId.message}</p>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Estado</label>
              <select
                style={selectStyle(!!errors.estadoId)}
                {...register('estadoId', { valueAsNumber: true })}
              >
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                ))}
              </select>
              {errors.estadoId && <p style={errorTextStyle}>{errors.estadoId.message}</p>}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Fecha</label>
              <input
                type="date"
                style={inputStyle(!!errors.fecha)}
                {...register('fecha')}
              />
              {errors.fecha && <p style={errorTextStyle}>{errors.fecha.message}</p>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Hora de Inicio</label>
              <input
                type="time"
                style={inputStyle(!!errors.horaInicio)}
                {...register('horaInicio')}
                step="60"
              />
              {errors.horaInicio && <p style={errorTextStyle}>{errors.horaInicio.message}</p>}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Notas</label>
            <textarea
              style={textareaStyle}
              {...register('notas')}
              placeholder="Notas adicionales sobre la cita..."
            />
          </div>

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};