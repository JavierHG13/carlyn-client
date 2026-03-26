import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSave,
  faClock,
  faCalendar,
  faEnvelope,
  faTable,
  faCloud,
  faExclamationTriangle,
  faInfoCircle,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import type { BackupConfig, CreateBackupConfigData } from '../../../types/database';
import { colors } from '../../../styles/colors';

interface BackupConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBackupConfigData) => Promise<void>;
  config?: BackupConfig | null;
  loading?: boolean;
}

export const BackupConfigModal: React.FC<BackupConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  config,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateBackupConfigData>({
    nombre: '',
    frecuencia: 'Diario',
    hora_ejecucion: '02:00:00',
    dia_semana: 1,
    dia_mes: 1,
    retencion_dias: 30,
    incluir_tablas: [],
    excluir_tablas: [],
    notificar_email: true,
    emails_notificacion: [],
    cloud_folder: 'barberia-backups',
    descripcion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newEmail, setNewEmail] = useState('');
  const [newIncluirTabla, setNewIncluirTabla] = useState('');
  const [newExcluirTabla, setNewExcluirTabla] = useState('');

  useEffect(() => {
    if (config) {
      setFormData({
        nombre: config.nombre,
        frecuencia: config.frecuencia,
        hora_ejecucion: config.hora_ejecucion,
        dia_semana: config.dia_semana,
        dia_mes: config.dia_mes,
        retencion_dias: config.retencion_dias,
        incluir_tablas: config.incluir_tablas || [],
        excluir_tablas: config.excluir_tablas || [],
        notificar_email: config.notificar_email,
        emails_notificacion: config.emails_notificacion || [],
        cloud_folder: config.cloud_folder || 'barberia-backups',
        descripcion: config.descripcion || '',
      });
    } else {
      setFormData({
        nombre: '',
        frecuencia: 'Diario',
        hora_ejecucion: '02:00:00',
        dia_semana: 1,
        dia_mes: 1,
        retencion_dias: 30,
        incluir_tablas: [],
        excluir_tablas: [],
        notificar_email: true,
        emails_notificacion: [],
        cloud_folder: 'barberia-backups',
        descripcion: '',
      });
    }
    setErrors({});
  }, [config, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.hora_ejecucion) {
      newErrors.hora_ejecucion = 'La hora de ejecución es requerida';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(formData.hora_ejecucion)) {
      newErrors.hora_ejecucion = 'Formato de hora inválido (HH:MM:SS)';
    }

    if (formData.frecuencia === 'Semanal' && (formData.dia_semana === undefined || formData.dia_semana < 0 || formData.dia_semana > 6)) {
      newErrors.dia_semana = 'Día de semana inválido (0-6)';
    }

    if (formData.frecuencia === 'Mensual' && (formData.dia_mes === undefined || formData.dia_mes < 1 || formData.dia_mes > 31)) {
      newErrors.dia_mes = 'Día del mes inválido (1-31)';
    }

    if (formData.retencion_dias && (formData.retencion_dias < 1 || formData.retencion_dias > 365)) {
      newErrors.retencion_dias = 'La retención debe ser entre 1 y 365 días';
    }

    if (formData.notificar_email && formData.emails_notificacion?.length === 0) {
      newErrors.emails = 'Debes agregar al menos un email para notificaciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData)
    if (!validateForm()) return;

    try {
      await onSave(formData);
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const addEmail = () => {
    if (!newEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Email inválido');
      return;
    }
    setFormData({
      ...formData,
      emails_notificacion: [...(formData.emails_notificacion || []), newEmail],
    });
    setNewEmail('');
  };

  const removeEmail = (index: number) => {
    setFormData({
      ...formData,
      emails_notificacion: formData.emails_notificacion?.filter((_, i) => i !== index),
    });
  };

  const addIncluirTabla = () => {
    if (!newIncluirTabla) return;
    setFormData({
      ...formData,
      incluir_tablas: [...(formData.incluir_tablas || []), newIncluirTabla],
    });
    setNewIncluirTabla('');
  };

  const removeIncluirTabla = (index: number) => {
    setFormData({
      ...formData,
      incluir_tablas: formData.incluir_tablas?.filter((_, i) => i !== index),
    });
  };

  const addExcluirTabla = () => {
    if (!newExcluirTabla) return;
    setFormData({
      ...formData,
      excluir_tablas: [...(formData.excluir_tablas || []), newExcluirTabla],
    });
    setNewExcluirTabla('');
  };

  const removeExcluirTabla = (index: number) => {
    setFormData({
      ...formData,
      excluir_tablas: formData.excluir_tablas?.filter((_, i) => i !== index),
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
    maxWidth: '700px',
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
  };

  const errorStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '12px',
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  };

  const tagContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '8px',
  };

  const tagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#EDF2F7',
    borderRadius: '4px',
    fontSize: '12px',
  };

  const addButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#EDF2F7',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
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
    opacity: loading ? 0.7 : 1,
  });

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faCloud} style={{ color: colors.doradoClasico }} />
            {config ? 'Editar Configuración' : 'Nueva Configuración de Backup'}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Nombre de la configuración *
            </label>
            <input
              type="text"
              style={inputStyle(!!errors.nombre)}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej. Backup Diario Completo"
            />
            {errors.nombre && (
              <div style={errorStyle}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {errors.nombre}
              </div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              style={textareaStyle}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción opcional de la configuración..."
            />
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Frecuencia *</label>
              <select
                style={selectStyle()}
                value={formData.frecuencia}
                onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value as any })}
              >
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                Hora de ejecución *
              </label>
              <input
                type="text"
                style={inputStyle(!!errors.hora_ejecucion)}
                value={formData.hora_ejecucion}
                onChange={(e) => setFormData({ ...formData, hora_ejecucion: e.target.value })}
                placeholder="02:00:00"
              />
              {errors.hora_ejecucion && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.hora_ejecucion}
                </div>
              )}
            </div>
          </div>

          {formData.frecuencia === 'Semanal' && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Día de la semana</label>
              <select
                style={selectStyle(!!errors.dia_semana)}
                value={formData.dia_semana}
                onChange={(e) => setFormData({ ...formData, dia_semana: parseInt(e.target.value) })}
              >
                <option value={0}>Domingo</option>
                <option value={1}>Lunes</option>
                <option value={2}>Martes</option>
                <option value={3}>Miércoles</option>
                <option value={4}>Jueves</option>
                <option value={5}>Viernes</option>
                <option value={6}>Sábado</option>
              </select>
              {errors.dia_semana && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.dia_semana}
                </div>
              )}
            </div>
          )}

          {formData.frecuencia === 'Mensual' && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Día del mes (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                style={inputStyle(!!errors.dia_mes)}
                value={formData.dia_mes}
                onChange={(e) => setFormData({ ...formData, dia_mes: parseInt(e.target.value) })}
              />
              {errors.dia_mes && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.dia_mes}
                </div>
              )}
            </div>
          )}

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Retención (días)</label>
              <input
                type="number"
                min="1"
                max="365"
                style={inputStyle(!!errors.retencion_dias)}
                value={formData.retencion_dias}
                onChange={(e) => setFormData({ ...formData, retencion_dias: parseInt(e.target.value) })}
              />
              {errors.retencion_dias && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.retencion_dias}
                </div>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Carpeta Cloudinary</label>
              <input
                type="text"
                style={inputStyle()}
                value={formData.cloud_folder}
                onChange={(e) => setFormData({ ...formData, cloud_folder: e.target.value })}
                placeholder="barberia-backups"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faTable} style={{ marginRight: '4px' }} />
              Tablas a incluir (vacío = todas)
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                style={{ flex: 1, padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px' }}
                value={newIncluirTabla}
                onChange={(e) => setNewIncluirTabla(e.target.value)}
                placeholder="nombre_tabla"
              />
              <button type="button" style={addButtonStyle} onClick={addIncluirTabla}>
                <FontAwesomeIcon icon={faPlus} /> Agregar
              </button>
            </div>
            <div style={tagContainerStyle}>
              {formData.incluir_tablas?.map((tabla, index) => (
                <span key={index} style={tagStyle}>
                  {tabla}
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ cursor: 'pointer', marginLeft: '4px', fontSize: '10px' }}
                    onClick={() => removeIncluirTabla(index)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faTable} style={{ marginRight: '4px' }} />
              Tablas a excluir
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                style={{ flex: 1, padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px' }}
                value={newExcluirTabla}
                onChange={(e) => setNewExcluirTabla(e.target.value)}
                placeholder="nombre_tabla"
              />
              <button type="button" style={addButtonStyle} onClick={addExcluirTabla}>
                <FontAwesomeIcon icon={faPlus} /> Agregar
              </button>
            </div>
            <div style={tagContainerStyle}>
              {formData.excluir_tablas?.map((tabla, index) => (
                <span key={index} style={tagStyle}>
                  {tabla}
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ cursor: 'pointer', marginLeft: '4px', fontSize: '10px' }}
                    onClick={() => removeExcluirTabla(index)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={formData.notificar_email}
                onChange={(e) => setFormData({ ...formData, notificar_email: e.target.checked })}
              />
              <FontAwesomeIcon icon={faEnvelope} style={{ color: colors.azulAcero }} />
              Notificar por email
            </label>

            {formData.notificar_email && (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="email"
                    style={{ flex: 1, padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px' }}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                  <button type="button" style={addButtonStyle} onClick={addEmail}>
                    <FontAwesomeIcon icon={faPlus} /> Agregar
                  </button>
                </div>
                <div style={tagContainerStyle}>
                  {formData.emails_notificacion?.map((email, index) => (
                    <span key={index} style={tagStyle}>
                      {email}
                      <FontAwesomeIcon
                        icon={faTimes}
                        style={{ cursor: 'pointer', marginLeft: '4px', fontSize: '10px' }}
                        onClick={() => removeEmail(index)}
                      />
                    </span>
                  ))}
                </div>
                {errors.emails && (
                  <div style={errorStyle}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {errors.emails}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : config ? 'Actualizar' : 'Crear Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};