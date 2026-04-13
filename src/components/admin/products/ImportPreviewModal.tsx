import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faInfoCircle,
  faEye,
  faUpload,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../styles/colors';

interface PreviewRow {
  index: number;
  nombre: string;
  descripcion: string | null;
  sku: string | null;
  categoria: string | null;
  precio: number;
  stock: number;
  stock_minimo: number;
  activo: boolean;
  isValid: boolean;
  errors: string[];
  existingProduct?: {
    id: number;
    nombre: string;
    sku: string | null;
    precio: number;
    stock: number;
    activo: boolean;
  };
  action: 'create' | 'update' | 'skip';
  selected: boolean;
}

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData: any[];
  existingProducts: any[];
  onConfirm: (selectedRows: PreviewRow[]) => Promise<void>;
}

// Función para normalizar los datos del CSV (convertir mayúsculas a minúsculas)
const normalizeRowData = (row: any): any => {
  const normalized: any = {};
  
  Object.keys(row).forEach(key => {
    const lowerKey = key.toLowerCase().trim();
    let value = row[key];
    
    // Limpiar comillas y espacios
    if (typeof value === 'string') {
      value = value.trim().replace(/^['"]|['"]$/g, '');
    }
    
    normalized[lowerKey] = value;
  });
  
  return normalized;
};

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  isOpen,
  onClose,
  csvData,
  existingProducts,
  onConfirm,
}) => {
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'create' | 'update' | 'error'>('all');

  useEffect(() => {
    if (isOpen && csvData.length > 0) {
      processPreviewData();
    }
  }, [isOpen, csvData, existingProducts]);

  const processPreviewData = () => {
    const processed: PreviewRow[] = csvData.map((rawRow, index) => {
      // Normalizar los datos (convertir mayúsculas a minúsculas)
      const row = normalizeRowData(rawRow);
      
      const errors: string[] = [];
      let isValid = true;

      // Obtener valores con soporte para mayúsculas/minúsculas
      const nombre = row.nombre || row.NOMBRE || '';
      const descripcion = row.descripcion || row.DESCRIPCION || null;
      const sku = row.sku || row.SKU || null;
      const categoria = row.categoria || row.CATEGORIA || null;
      const precioRaw = row.precio || row.PRECIO || 0;
      const stockRaw = row.stock || row.STOCK || 0;
      const stockMinimoRaw = row.stock_minimo || row.STOCK_MINIMO || 0;
      const activoRaw = row.activo || row.ACTIVO || 'true';

      // Validar nombre
      if (!nombre || nombre.toString().trim().length < 2) {
        errors.push('Nombre requerido (mínimo 2 caracteres)');
        isValid = false;
      }

      // Validar precio
      const precio = parseFloat(precioRaw);
      if (isNaN(precio) || precio < 0) {
        errors.push('Precio inválido');
        isValid = false;
      }

      // Validar stock
      const stock = parseInt(stockRaw) || 0;
      if (stock < 0) {
        errors.push('Stock inválido');
        isValid = false;
      }

      // Validar stock mínimo
      const stockMinimo = parseInt(stockMinimoRaw) || 0;
      if (stockMinimo < 0) {
        errors.push('Stock mínimo inválido');
        isValid = false;
      }

      // Determinar activo
      let activo = true;
      if (typeof activoRaw === 'string') {
        activo = activoRaw.toLowerCase() === 'true' || activoRaw === '1' || activoRaw === 'sí' || activoRaw === 'si';
      } else if (typeof activoRaw === 'boolean') {
        activo = activoRaw;
      } else if (typeof activoRaw === 'number') {
        activo = activoRaw === 1;
      }

      // Buscar producto existente
      let existingProduct = undefined;
      let action: 'create' | 'update' | 'skip' = 'create';

      // Buscar por SKU primero
      if (sku) {
        existingProduct = existingProducts.find(p => 
          p.sku && p.sku.toLowerCase() === sku.toLowerCase()
        );
      }

      // Si no por SKU, buscar por nombre
      if (!existingProduct && nombre) {
        existingProduct = existingProducts.find(p => 
          p.nombre && p.nombre.toLowerCase() === nombre.toLowerCase()
        );
      }

      if (existingProduct) {
        // Verificar si hay cambios
        const hasChanges = 
          (precio && Math.abs(precio - existingProduct.precio) > 0.01) ||
          (stock !== undefined && stock !== existingProduct.stock) ||
          (descripcion && descripcion !== existingProduct.descripcion) ||
          (categoria && categoria !== existingProduct.categoria);
        
        action = hasChanges ? 'update' : 'skip';
      }

      return {
        index: index + 1,
        nombre: nombre.toString(),
        descripcion: descripcion ? descripcion.toString() : null,
        sku: sku ? sku.toString() : null,
        categoria: categoria ? categoria.toString() : null,
        precio: precio || 0,
        stock: stock || 0,
        stock_minimo: stockMinimo || 0,
        activo,
        isValid,
        errors,
        existingProduct,
        action,
        selected: isValid && action !== 'skip',
      };
    });

    setPreviewData(processed);
    setSelectAll(processed.some(p => p.selected && p.isValid));
  };

  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setPreviewData(prev => prev.map(row => ({
      ...row,
      selected: newSelectAll && row.isValid && row.action !== 'skip',
    })));
  };

  const handleToggleRow = (index: number) => {
    setPreviewData(prev => prev.map((row, i) => 
      i === index ? { ...row, selected: !row.selected } : row
    ));
  };

  const handleConfirm = async () => {
    const selectedRows = previewData.filter(row => row.selected && row.isValid);
    if (selectedRows.length === 0) return;
    
    setLoading(true);
    await onConfirm(selectedRows);
    setLoading(false);
    onClose();
  };

  const getActionBadge = (action: string) => {
    const config = {
      create: { bg: '#D1FAE5', color: '#10B981', text: 'Nuevo', icon: faCheckCircle },
      update: { bg: '#FEF3C7', color: '#F59E0B', text: 'Actualizar', icon: faExclamationTriangle },
      skip: { bg: '#E2E8F0', color: '#64748B', text: 'Sin cambios', icon: faTimesCircle },
    };
    const style = config[action as keyof typeof config];
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color,
      }}>
        <FontAwesomeIcon icon={style.icon} style={{ fontSize: '10px' }} />
        {style.text}
      </span>
    );
  };

  const filteredData = previewData.filter(row => {
    if (filterType === 'all') return true;
    if (filterType === 'create') return row.action === 'create';
    if (filterType === 'update') return row.action === 'update';
    if (filterType === 'error') return !row.isValid;
    return true;
  });

  if (!isOpen) return null;

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
    maxWidth: '1200px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    flexWrap: 'wrap',
  };

  const statItemStyle = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: `1px solid ${color}30`,
  });

  const filterButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: active ? colors.doradoClasico : '#E2E8F0',
    color: active ? 'white' : '#475569',
    marginRight: '8px',
  });

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #E2E8F0',
    verticalAlign: 'middle',
  };

  const errorStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '11px',
    marginTop: '4px',
  };

  const checkboxStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  };

  const totalSelected = previewData.filter(r => r.selected && r.isValid).length;
  const totalCreate = previewData.filter(r => r.action === 'create' && r.isValid).length;
  const totalUpdate = previewData.filter(r => r.action === 'update' && r.isValid).length;
  const totalErrors = previewData.filter(r => !r.isValid).length;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.negroSuave, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FontAwesomeIcon icon={faEye} style={{ color: colors.doradoClasico }} />
            Previsualizar Importación
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} style={{ color: '#718096', fontSize: '18px' }} />
          </button>
        </div>

        {/* Estadísticas */}
        <div style={statsStyle}>
          <div style={statItemStyle(colors.doradoClasico)}>
       
            <span>Total: <strong>{previewData.length}</strong> registros</span>
          </div>
          <div style={statItemStyle('#10B981')}>
          
            <span>Nuevos: <strong>{totalCreate}</strong></span>
          </div>
          <div style={statItemStyle('#F59E0B')}>
       
            <span>Actualizar: <strong>{totalUpdate}</strong></span>
          </div>
          <div style={statItemStyle('#EF4444')}>
       
            <span>Errores: <strong>{totalErrors}</strong></span>
          </div>
          <div style={statItemStyle('#3B82F6')}>

            <span>Seleccionados: <strong>{totalSelected}</strong></span>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718096' }}>Filtrar:</span>
          <button style={filterButtonStyle(filterType === 'all')} onClick={() => setFilterType('all')}>
            Todos
          </button>
          <button style={filterButtonStyle(filterType === 'create')} onClick={() => setFilterType('create')}>
            Nuevos
          </button>
          <button style={filterButtonStyle(filterType === 'update')} onClick={() => setFilterType('update')}>
            Actualizar
          </button>
          <button style={filterButtonStyle(filterType === 'error')} onClick={() => setFilterType('error')}>
            Con errores
          </button>
          
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={selectAll && totalSelected > 0}
              onChange={handleToggleSelectAll}
              style={checkboxStyle}
            />
            <span style={{ fontSize: '13px' }}>Seleccionar todos válidos</span>
          </div>
        </div>

        {/* Tabla de previsualización */}
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle} style={{ width: '40px' }}></th>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Precio</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Acción</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.index} style={{ opacity: row.isValid ? 1 : 0.6, backgroundColor: !row.isValid ? '#FEF2F2' : 'white' }}>
                  <td style={tdStyle}>
                    {row.isValid && row.action !== 'skip' && (
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => handleToggleRow(row.index - 1)}
                        style={checkboxStyle}
                      />
                    )}
                    {(!row.isValid || row.action === 'skip') && (
                      <FontAwesomeIcon 
                        icon={!row.isValid ? faTimesCircle : faInfoCircle} 
                        style={{ color: !row.isValid ? '#EF4444' : '#A0AEC0', fontSize: '16px' }} 
                      />
                    )}
                  </td>
                  <td style={tdStyle}>{row.index}</td>
                  <td style={tdStyle}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{row.nombre || '—'}</div>
                      {row.descripcion && (
                        <div style={{ fontSize: '11px', color: '#718096' }}>{row.descripcion.substring(0, 50)}</div>
                      )}
                      {!row.isValid && row.errors.map((err, i) => (
                        <div key={i} style={errorStyle}>
                          <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '4px', fontSize: '10px' }} />
                          {err}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <code style={{ fontSize: '12px' }}>{row.sku || '—'}</code>
                  </td>
                  <td style={tdStyle}>{row.categoria || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: colors.doradoClasico }}>
                      ${row.precio}
                    </span>
                    {row.existingProduct && row.existingProduct.precio !== row.precio && (
                      <div style={{ fontSize: '11px', color: '#EF4444' }}>
                        Anterior: ${row.existingProduct.precio}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {row.stock}
                    {row.existingProduct && row.existingProduct.stock !== row.stock && (
                      <div style={{ fontSize: '11px', color: '#EF4444' }}>
                        Anterior: {row.existingProduct.stock}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>{getActionBadge(row.action)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: row.activo ? '#10B981' : '#EF4444',
                      marginRight: '6px',
                    }} />
                    {row.activo ? 'Activo' : 'Inactivo'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: 'white',
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={totalSelected === 0 || loading}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: colors.doradoClasico,
              color: 'white',
              cursor: totalSelected === 0 ? 'not-allowed' : 'pointer',
              opacity: totalSelected === 0 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <><FontAwesomeIcon icon={faSpinner} spin /> Importando...</>
            ) : (
              <><FontAwesomeIcon icon={faUpload} /> Importar {totalSelected} productos</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};