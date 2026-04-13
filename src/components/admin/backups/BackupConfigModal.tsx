import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSave,
  faClock,
  faCalendar,
  faEnvelope,
  faTable,
  faCloud,
} from '@fortawesome/free-solid-svg-icons';
import type { BackupConfig, CreateBackupConfigData } from '../../../types/backup';
import { colors } from '../../../styles/colors';

interface BackupConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBackupConfigData) => Promise<void>;
  config?: BackupConfig | null;
  loading?: boolean;
}

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  frecuencia: yup.string().oneOf(['Diario', 'Semanal', 'Mensual']).required(),
  hora_ejecucion: yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato HH:MM:SS'),
  retencion_dias: yup.number().min(1).max(365),
});

export const BackupConfigModal: React.FC<BackupConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  config,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateBackupConfigData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      frecuencia: 'Diario',
      hora_ejecucion: '02:00:00',
      retencion_dias: 30,
      notificar_email: false,
      emails_notificacion: [],
      cloud_folder: 'barberia-backups',
    },
  });

  const [newEmail, setNewEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    if (config) {
      setValue('nombre', config.nombre);
      setValue('frecuencia', config.frecuencia);
      setValue('hora_ejecucion', config.hora_ejecucion);
      setValue('retencion_dias', config.retencion_dias);
      setValue('notificar_email', config.notificar_email);
      setValue('cloud_folder', config.cloud_folder || 'barberia-backups');
      setEmails(config.emails_notificacion || []);
    } else {
      reset();
      setEmails([]);
    }
  }, [config, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateBackupConfigData) => {
    const submitData = {
      ...data,
      emails_notificacion: emails,
    };
    await onSave(submitData);
    onClose();
  };

  const addEmail = () => {
    if (!newEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Email inválido');
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail('');
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
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
  };

  const tagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#EDF2F7',
    borderRadius: '20px',
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
  });

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.negroSuave }}>
            {config ? 'Editar Configuración' : 'Nueva Configuración'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} style={{ color: '#718096', fontSize: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nombre de la configuración</label>
            <input type="text" style={inputStyle(!!errors.nombre)} {...register('nombre')} />
            {errors.nombre && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.nombre.message}</p>}
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Frecuencia</label>
              <select style={selectStyle()} {...register('frecuencia')}>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Hora de ejecución</label>
              <input type="text" style={inputStyle(!!errors.hora_ejecucion)} {...register('hora_ejecucion')} />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Días de retención</label>
            <input type="number" style={inputStyle(!!errors.retencion_dias)} {...register('retencion_dias', { valueAsNumber: true })} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Carpeta Cloudinary</label>
            <input type="text" style={inputStyle()} {...register('cloud_folder')} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <input type="checkbox" {...register('notificar_email')} style={{ marginRight: '8px' }} />
              Notificar por email
            </label>
          </div>

          {register('notificar_email') && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Emails de notificación</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  style={{ flex: 1, padding: '8px', border: '1px solid #E2E8F0', borderRadius: '6px' }}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@ejemplo.com"
                />
                <button type="button" onClick={addEmail} style={{ padding: '8px 16px', backgroundColor: colors.grafito, color: 'white', border: 'none', borderRadius: '6px' }}>
                  Agregar
                </button>
              </div>
              <div style={tagContainerStyle}>
                {emails.map((email, idx) => (
                  <span key={idx} style={tagStyle}>
                    {email}
                    <button type="button" onClick={() => removeEmail(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};