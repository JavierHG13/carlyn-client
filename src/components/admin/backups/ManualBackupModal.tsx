import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faDatabase,
  faPlay,
  faSpinner,
  faCheckSquare,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import { backupService } from '../../../services/backupService';
import type { TablaInfo } from '../../../types/backup';
import { colors } from '../../../styles/colors';

interface ManualBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManualBackupModal: React.FC<ManualBackupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [backupType, setBackupType] = useState<'completo' | 'parcial'>('completo');
  const [tablas, setTablas] = useState<TablaInfo[]>([]);
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
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
      setSelectedTables(new Set(tablas.map(t => `${t.table_schema}.${t.table_name}`)));
    }
  };

  const handleToggleTable = (tableKey: string) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableKey)) {
      newSelected.delete(tableKey);
    } else {
      newSelected.add(tableKey);
    }
    setSelectedTables(newSelected);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data: any = { descripcion: descripcion || undefined };
      
      if (backupType === 'parcial') {
        data.incluir_tablas = Array.from(selectedTables).map(key => {
          const [schema, name] = key.split('.');
          return name;
        });
      }
      
      await backupService.createManual(data);
      onSuccess();
      onClose();
      // Limpiar formulario
      setBackupType('completo');
      setSelectedTables(new Set());
      setDescripcion('');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error al crear el backup');
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
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const optionStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '16px',
    borderRadius: '10px',
    border: `2px solid ${isSelected ? colors.doradoClasico : '#E2E8F0'}`,
    backgroundColor: isSelected ? `${colors.doradoClasico}10` : 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const tablesContainerStyle: React.CSSProperties = {
    maxHeight: '300px',
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
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faDatabase} style={{ color: colors.doradoClasico }} />
            Crear Backup Manual
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} style={{ color: '#718096', fontSize: '18px' }} />
          </button>
        </div>

        {/* Tipo de backup */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: colors.azulAcero, marginBottom: '8px', display: 'block' }}>
            Tipo de Backup
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={optionStyle(backupType === 'completo')}
              onClick={() => setBackupType('completo')}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Backup Completo</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Todas las tablas de la base de datos</div>
            </div>
            <div
              style={optionStyle(backupType === 'parcial')}
              onClick={() => setBackupType('parcial')}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Backup Parcial</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>Selecciona tablas específicas</div>
            </div>
          </div>
        </div>

        {/* Selección de tablas para backup parcial */}
        {backupType === 'parcial' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: colors.azulAcero }}>
                Seleccionar Tablas
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                style={{ fontSize: '12px', color: colors.doradoClasico, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {selectedTables.size === tablas.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
              </button>
            </div>
            
            {loadingTables ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <FontAwesomeIcon icon={faSpinner} spin />
              </div>
            ) : (
              <div style={tablesContainerStyle}>
                {tablas.map((tabla) => {
                  const tableKey = `${tabla.table_schema}.${tabla.table_name}`;
                  const isSelected = selectedTables.has(tableKey);
                  return (
                    <div
                      key={tableKey}
                      style={tableItemStyle}
                      onClick={() => handleToggleTable(tableKey)}
                    >
                      <FontAwesomeIcon
                        icon={isSelected ? faCheckSquare : faSquare}
                        style={{ color: isSelected ? colors.doradoClasico : '#A0AEC0' }}
                      />
                      <span style={{ fontSize: '13px' }}>{tabla.table_schema}.{tabla.table_name}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedTables.size === 0 && (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '8px' }}>
                Debes seleccionar al menos una tabla
              </p>
            )}
          </div>
        )}

        {/* Descripción */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: colors.azulAcero, marginBottom: '8px', display: 'block' }}>
            Descripción (opcional)
          </label>
          <textarea
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '60px',
            }}
            placeholder="Ej. Backup antes de actualización"
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
            disabled={loading || (backupType === 'parcial' && selectedTables.size === 0)}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Creando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlay} />
                Crear Backup
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};