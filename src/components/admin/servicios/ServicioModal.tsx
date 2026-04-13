import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSave,
  faClock,
  faDollarSign,
  faImage,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import type { Servicio, CreateServicioData } from '../../../types/servicio';
import { colors } from '../../../styles/colors';

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateServicioData) => Promise<void>;
  servicio?: Servicio | null;
  loading?: boolean;
}

const schema = yup.object({
  nombre: yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion: yup.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .nullable(),
  duracion: yup.number()
    .required('La duración es obligatoria')
    .min(5, 'La duración mínima es 5 minutos')
    .max(480, 'La duración máxima es 480 minutos'),
  precio: yup.number()
    .required('El precio es obligatorio')
    .min(0.01, 'El precio debe ser mayor a 0')
    .max(999999, 'Precio demasiado alto'),
  imagen: yup.mixed()
    .nullable(),
});

export const ServicioModal: React.FC<ServicioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  servicio,
  loading = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateServicioData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      duracion: 30,
      precio: 0,
    },
  });

  useEffect(() => {
    if (servicio) {
      setValue('nombre', servicio.nombre);
      setValue('descripcion', servicio.descripcion || '');
      setValue('duracion', servicio.duracion);
      setValue('precio', servicio.precio);
      if (servicio.imagen_url) {
        setImagePreview(servicio.imagen_url);
      }
    } else {
      reset();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [servicio, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateServicioData) => {
    const formData = { ...data };
    if (imageFile) {
      formData.imagen = imageFile;
    }
    await onSave(formData);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  };

  const errorTextStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '12px',
    color: '#EF4444',
  };

  const imageContainerStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const imagePreviewStyle: React.CSSProperties = {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  };

  const imageButtonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const imageButtonStyle = (color: string): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

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
            {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nombre del Servicio *</label>
            <input
              type="text"
              style={inputStyle(!!errors.nombre)}
              {...register('nombre')}
              placeholder="Ej. Corte de Cabello"
            />
            {errors.nombre && <p style={errorTextStyle}>{errors.nombre.message}</p>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              style={textareaStyle}
              {...register('descripcion')}
              placeholder="Descripción detallada del servicio..."
            />
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                Duración (minutos) *
              </label>
              <input
                type="number"
                style={inputStyle(!!errors.duracion)}
                {...register('duracion', { valueAsNumber: true })}
                placeholder="30"
              />
              {errors.duracion && <p style={errorTextStyle}>{errors.duracion.message}</p>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '4px' }} />
                Precio *
              </label>
              <input
                type="number"
                step="0.01"
                style={inputStyle(!!errors.precio)}
                {...register('precio', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.precio && <p style={errorTextStyle}>{errors.precio.message}</p>}
            </div>
          </div>

          <div style={imageContainerStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faImage} style={{ marginRight: '4px' }} />
              Imagen del Servicio
            </label>
            
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="Vista previa" style={imagePreviewStyle} />
                <div style={imageButtonContainerStyle}>
                  <label style={imageButtonStyle('#3B82F6')}>
                    <FontAwesomeIcon icon={faImage} />
                    Cambiar imagen
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    type="button"
                    style={imageButtonStyle('#EF4444')}
                    onClick={removeImage}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
            
            {!imagePreview && (
              <label style={{
                ...imageButtonStyle(colors.doradoClasico),
                display: 'inline-flex',
                cursor: 'pointer',
              }}>
                <FontAwesomeIcon icon={faImage} />
                Seleccionar imagen
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};