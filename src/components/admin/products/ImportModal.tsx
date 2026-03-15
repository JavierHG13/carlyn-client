import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUpload,
  faFileCsv,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faInfoCircle,
  faDownload,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../styles/colors';
import type { ImportResult } from '../../../types/product';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, csvText?: string) => Promise<ImportResult>;
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
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleImport = async () => {
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
    setResult(null);

    try {
      const importResult = await onImport(
        file as File,
        mode === 'text' ? csvText : undefined
      );
      setResult(importResult);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al importar');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'nombre,descripcion,categoria,precio,stock,stock_minimo,activo\n"Tijera Profesional","Tijera de acero inoxidable","Herramientas",25.99,10,2,true\n"Navaja Clásica","Navaja de barbero","Herramientas",15.50,5,1,true';
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

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#0369A1',
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

  const resultBoxStyle = (bgColor: string): React.CSSProperties => ({
    backgroundColor: bgColor,
    padding: '16px',
    borderRadius: '8px',
    marginTop: '20px',
  });

  const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #EDF2F7',
  };

  const buttonStyle = (variant: 'primary' | 'secondary' | 'success' | 'danger'): React.CSSProperties => {
    const colorsMap = {
      primary: { bg: colors.doradoClasico, text: 'white' },
      secondary: { bg: '#E2E8F0', text: '#475569' },
      success: { bg: '#10B981', text: 'white' },
      danger: { bg: '#EF4444', text: 'white' },
    };
    return {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      backgroundColor: colorsMap[variant].bg,
      color: colorsMap[variant].text,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    };
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faFileCsv} style={{ color: colors.doradoClasico }} />
            Importar Productos desde CSV
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={infoBoxStyle}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
          Columnas requeridas: <strong>nombre, precio</strong> (obligatorias)
          <br />
          Columnas opcionales: descripcion, categoria, stock, stock_minimo, activo
          <br />
          <small>El SKU se genera automáticamente</small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button style={tabStyle(mode === 'file')} onClick={() => setMode('file')}>
            Subir archivo
          </button>
          <button style={tabStyle(mode === 'text')} onClick={() => setMode('text')}>
            Pegar texto CSV
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
            onChange={handleFileChange}
            style={fileInputStyle}
          />
        ) : (
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="nombre,descripcion,categoria,precio,stock,stock_minimo,activo&#10;'Tijera Profesional','Acero inoxidable','Herramientas',25.99,10,2,true"
            style={textAreaStyle}
          />
        )}

        {error && (
          <div style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
          </div>
        )}

        {result && (
          <div style={resultBoxStyle(result.errors.length > 0 ? '#FEF3C7' : '#D1FAE5')}>
            <h4 style={{ marginBottom: '12px', fontWeight: 600 }}>
              Resultado de la importación:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>{result.created}</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Creados</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6' }}>{result.updated}</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Actualizados</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#718096' }}>{result.skipped}</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Sin cambios</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444' }}>{result.errors.length}</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Errores</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#F59E0B', marginRight: '4px' }} />
                  Errores por fila:
                </h5>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {result.errors.map((err, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#EF4444', marginBottom: '4px' }}>
                      Fila {err.fila}: {err.nombre} - {err.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={modalFooterStyle}>
          <button style={buttonStyle('secondary')} onClick={onClose}>
            Cancelar
          </button>
          <button
            style={buttonStyle('primary')}
            onClick={handleImport}
            disabled={loading || (mode === 'file' && !file) || (mode === 'text' && !csvText)}
          >
            <FontAwesomeIcon icon={faUpload} />
            {loading ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  );
};