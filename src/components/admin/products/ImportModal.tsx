// Asegúrate de instalar papaparse
// npm install papaparse @types/papaparse

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUpload,
  faFileCsv,
  faExclamationTriangle,
  faInfoCircle,
  faDownload,
  faEye,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import { colors } from '../../../styles/colors';
import { ImportPreviewModal } from './ImportPreviewModal';
import { productService } from '../../../services/productService';
import type { Product } from '../../../types/product';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, csvText?: string) => Promise<any>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState('');
  const [mode, setMode] = useState<'file' | 'text'>('file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [existingProducts, setExistingProducts] = useState<Product[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const loadExistingProducts = async () => {
    try {
      const response = await productService.list({ limit: 1000 });
      setExistingProducts(response.data);
    } catch (err) {
      console.error('Error loading existing products:', err);
    }
  };

  const parseCSV = (text: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('Error al parsear CSV: ' + results.errors[0].message));
          } else {
            resolve(results.data);
          }
        },
        error: (err) => reject(err),
      });
    });
  };

  const handlePreview = async () => {
    if (mode === 'file' && !file) {
      setError('Por favor selecciona un archivo CSV');
      return;
    }

    if (mode === 'text' && !csvText.trim()) {
      setError('Por favor ingresa el contenido CSV');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let csvContent = '';
      if (mode === 'file' && file) {
        csvContent = await file.text();
      } else if (mode === 'text') {
        csvContent = csvText;
      }

      const parsedData = await parseCSV(csvContent);
      
      if (parsedData.length === 0) {
        setError('El archivo CSV está vacío');
        return;
      }

      await loadExistingProducts();
      setPreviewData(parsedData);
      setShowPreview(true);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async (selectedRows: any[]) => {
    // Convertir los datos seleccionados al formato esperado por el backend
    const importData = selectedRows.map(row => ({
      nombre: row.nombre,
      descripcion: row.descripcion || '',
      sku: row.sku || '',
      categoria: row.categoria || '',
      precio: row.precio,
      stock: row.stock,
      stock_minimo: row.stock_minimo,
      activo: row.activo,
    }));

    // Crear un CSV temporal con los datos seleccionados
    const csvString = Papa.unparse(importData);
    
    // Crear un archivo Blob y pasarlo a onImport
    const blob = new Blob([csvString], { type: 'text/csv' });
    const tempFile = new File([blob], 'import_selected.csv', { type: 'text/csv' });
    
    await onImport(tempFile);
  };

  const downloadTemplate = () => {
    const template = 'NOMBRE,DESCRIPCION,SKU,CATEGORIA,PRECIO,STOCK,STOCK_MINIMO,ACTIVO\n"Pomada Mate","Pomada de fijacion media con acabado mate","POM-001","Styling",150,50,10,true\n"Pomada Brillante","Pomada de fijacion fuerte con brillo","POM-002","Styling",190,20,10,true';
    const blob = new Blob(['\uFEFF' + template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_productos.csv';
    link.click();
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
    maxWidth: '550px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: active ? colors.doradoClasico : '#E2E8F0',
    color: active ? 'white' : '#475569',
    border: 'none',
    marginRight: '8px',
  });

  const fileInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '2px dashed #E2E8F0',
    borderRadius: '8px',
    marginBottom: '16px',
    cursor: 'pointer',
  };

  const textAreaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '200px',
    padding: '12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    marginBottom: '16px',
  };

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#0369A1',
  };

  return (
    <>
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.negroSuave, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FontAwesomeIcon icon={faFileCsv} style={{ color: colors.doradoClasico }} />
              Importar Productos desde CSV
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTimes} style={{ color: '#718096', fontSize: '18px' }} />
            </button>
          </div>

          {/*<div style={infoBoxStyle}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
            Columnas requeridas: <strong>NOMBRE, PRECIO</strong> (obligatorias)
            <br />
            Columnas opcionales: DESCRIPCION, SKU, CATEGORIA, STOCK, STOCK_MINIMO, ACTIVO
            <br />
            <small>Los nombres de las columnas pueden estar en mayúsculas o minúsculas</small>
          </div>*/}

          <div style={{ marginBottom: '20px' }}>
            <button style={tabStyle(mode === 'file')} onClick={() => setMode('file')}>
              Subir archivo
            </button>
            <button
              style={tabStyle(false)}
              onClick={downloadTemplate}
              title="Descargar plantilla"
            >
              <FontAwesomeIcon icon={faDownload} /> Plantilla
            </button>
          </div>

          {mode === 'file' ? (
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setError(null);
                }
              }}
              style={fileInputStyle}
            />
          ) : (
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="NOMBRE,DESCRIPCION,SKU,CATEGORIA,PRECIO,STOCK,STOCK_MINIMO,ACTIVO&#10;Pomada Mate,Pomada de fijacion media,POM-001,Styling,150,50,10,true"
              style={textAreaStyle}
            />
          )}

          {error && (
            <div style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
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
              onClick={handlePreview}
              disabled={loading || (mode === 'file' && !file) || (mode === 'text' && !csvText)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: colors.doradoClasico,
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: (loading || (mode === 'file' && !file) || (mode === 'text' && !csvText)) ? 0.6 : 1,
              }}
            >
              {loading ? (
                <><FontAwesomeIcon icon={faSpinner} spin /> Procesando...</>
              ) : (
                <><FontAwesomeIcon icon={faEye} /> Previsualizar</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de previsualización */}
      <ImportPreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewData([]);
        }}
        csvData={previewData}
        existingProducts={existingProducts}
        onConfirm={handleConfirmImport}
      />
    </>
  );
};