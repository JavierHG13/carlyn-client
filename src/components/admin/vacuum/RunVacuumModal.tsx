import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPlay,
  faSpinner,
  faCheckSquare,
  faSquare,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { vacuumService } from '../../../services/vacuumService';
import { backupService } from '../../../services/backupService';
import type { TablaInfo } from '../../../types/backup';
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
  const [tablas, setTablas] = useState<TablaInfo[]>([]);
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [runAllTables, setRunAllTables] = useState(true);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTables();
    }
  }, [isOpen]);

  const loadTables = async () => {
    setLoadingTables(true);
    try {
      const data = await backupService.getTables();
      setTablas(data);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoadingTables(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedTables.size === tablas.length) {
      setSelectedTables(new Set());
    } else {
      setSelectedTables(new Set(tablas.map(t => t.table_name)));
    }
  };

  const handleToggleTable = (tableName: string) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableName)) {
      newSelected.delete(tableName);
    } else {
      newSelected.add(tableName);
    }
    setSelectedTables(newSelected);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data: any = {
        analyze: true,
        verbose: false,
        descripcion: descripcion || undefined,
      };
      
      if (!runAllTables && selectedTables.size > 0) {
        data.tablas = Array.from(selectedTables);
      }
      
      await vacuumService.runManual(data);
      onSuccess();
      onClose();
      // Limpiar formulario
      setRunAllTables(true);
      setSelectedTables(new Set());
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

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

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

  const optionStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '12px',
    borderRadius: '10px',
    border: `2px solid ${isSelected ? colors.doradoClasico : '#E2E8F0'}`,
    backgroundColor: isSelected ? `${colors.doradoClasico}10` : 'white',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  });

  const tablesContainerStyle: React.CSSProperties = {
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    marginTop: '12px',
  };

  const tableItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderBottom: '1px solid #E2E8F0',
    cursor: 'pointer',
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

        <div style={formGroupStyle}>
          <label style={labelStyle}>¿Qué optimizar?</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={optionStyle(runAllTables)} onClick={() => setRunAllTables(true)}>
              <div style={{ fontWeight: 600 }}>Todas las tablas</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Optimizar toda la BD</div>
            </div>
            <div style={optionStyle(!runAllTables)} onClick={() => setRunAllTables(false)}>
              <div style={{ fontWeight: 600 }}>Tablas específicas</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Seleccionar tablas</div>
            </div>
          </div>
        </div>

        {!runAllTables && (
          <div style={formGroupStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={labelStyle}>Seleccionar tablas</label>
              <button type="button" onClick={handleSelectAll} style={{ fontSize: '12px', color: colors.doradoClasico, background: 'none', border: 'none', cursor: 'pointer' }}>
                {selectedTables.size === tablas.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
              </button>
            </div>
            
            {loadingTables ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Cargando tablas...</div>
            ) : (
              <div style={tablesContainerStyle}>
                {tablas.map((tabla) => {
                  const isSelected = selectedTables.has(tabla.table_name);
                  return (
                    <div key={tabla.table_name} style={tableItemStyle} onClick={() => handleToggleTable(tabla.table_name)}>
                      <FontAwesomeIcon icon={isSelected ? faCheckSquare : faSquare} style={{ color: isSelected ? colors.doradoClasico : '#A0AEC0' }} />
                      <span>{tabla.table_name}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedTables.size === 0 && !runAllTables && (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '8px' }}>
                Selecciona al menos una tabla
              </p>
            )}
          </div>
        )}

        <div style={formGroupStyle}>
          <input
            style={textareaStyle}
            type='hidden'
            placeholder="Ej. Mantenimiento semanal"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div style={modalFooterStyle}>
          <button style={buttonStyle('secondary')} onClick={onClose}>
            Cancelar
          </button>
          <button
            style={buttonStyle('primary')}
            onClick={handleSubmit}
            disabled={loading || (!runAllTables && selectedTables.size === 0)}
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