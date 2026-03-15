import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBox,
  faTag,
  faBarcode,
  faDollarSign,
  faExclamationTriangle,
  faToggleOn,
  faSave,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Product } from '../../../types/product';
import { colors } from '../../../styles/colors';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  product?: Product | null;
  loading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sku: '',
    categoria: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    activo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        sku: product.sku || '',
        categoria: product.categoria || '',
        precio: String(product.precio),
        stock: String(product.stock),
        stockMinimo: String(product.stock_minimo),
        activo: product.activo,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        sku: '',
        categoria: '',
        precio: '',
        stock: '',
        stockMinimo: '0',
        activo: true,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const precio = parseFloat(formData.precio);
    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio';
    } else if (isNaN(precio) || precio < 0) {
      newErrors.precio = 'El precio debe ser un número válido y mayor o igual a 0';
    }

    const stock = parseInt(formData.stock);
    if (formData.stock && (isNaN(stock) || stock < 0)) {
      newErrors.stock = 'El stock debe ser un número entero mayor o igual a 0';
    }

    const stockMinimo = parseInt(formData.stockMinimo);
    if (formData.stockMinimo && (isNaN(stockMinimo) || stockMinimo < 0)) {
      newErrors.stockMinimo = 'El stock mínimo debe ser un número entero mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSend: any = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null,
      sku: formData.sku.trim() || null,
      categoria: formData.categoria.trim() || null,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock || '0'),
      stockMinimo: parseInt(formData.stockMinimo || '0'),
      activo: formData.activo,
    };

    await onSave(dataToSend);
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
    transition: 'border-color 0.2s',
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
            <FontAwesomeIcon icon={faBox} style={{ color: colors.doradoClasico }} />
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faBox} style={{ marginRight: '8px' }} />
              Nombre del Producto *
            </label>
            <input
              type="text"
              style={inputStyle(!!errors.nombre)}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej. Tijera Profesional"
            />
            {errors.nombre && (
              <div style={errorStyle}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {errors.nombre}
              </div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
              Descripción
            </label>
            <textarea
              style={textareaStyle}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faBarcode} style={{ marginRight: '8px' }} />
                SKU
              </label>
              <input
                type="text"
                style={inputStyle()}
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ej. TIJ-001"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px' }} />
                Categoría
              </label>
              <input
                type="text"
                style={inputStyle()}
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ej. Herramientas"
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} />
                Precio *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                style={inputStyle(!!errors.precio)}
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="0.00"
              />
              {errors.precio && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.precio}
                </div>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faBox} style={{ marginRight: '8px' }} />
                Stock
              </label>
              <input
                type="number"
                min="0"
                step="1"
                style={inputStyle(!!errors.stock)}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
              {errors.stock && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.stock}
                </div>
              )}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                step="1"
                style={inputStyle(!!errors.stockMinimo)}
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                placeholder="0"
              />
              {errors.stockMinimo && (
                <div style={errorStyle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {errors.stockMinimo}
                </div>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <FontAwesomeIcon icon={faToggleOn} style={{ marginRight: '8px' }} />
                Estado
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="radio"
                    checked={formData.activo === true}
                    onChange={() => setFormData({ ...formData, activo: true })}
                  />
                  Activo
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="radio"
                    checked={formData.activo === false}
                    onChange={() => setFormData({ ...formData, activo: false })}
                  />
                  Inactivo
                </label>
              </div>
            </div>
          </div>

          <div style={modalFooterStyle}>
            <button type="button" style={buttonStyle('secondary')} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={buttonStyle('primary')} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};