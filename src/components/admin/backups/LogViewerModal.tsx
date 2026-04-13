import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload, faSpinner, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../styles/colors';

interface LogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logUrl: string | null;
  logFileName: string;
}

export const LogViewerModal: React.FC<LogViewerModalProps> = ({
  isOpen,
  onClose,
  logUrl,
  logFileName,
}) => {
  const [logContent, setLogContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && logUrl) {
      loadLog();
    }
  }, [isOpen, logUrl]);

  const loadLog = async () => {
    if (!logUrl) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(logUrl);
      const text = await response.text();
      setLogContent(text);
    } catch (err) {
      setError('Error al cargar el log');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (logUrl) {
      window.open(logUrl, '_blank');
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
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const logContainerStyle: React.CSSProperties = {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    padding: '16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '500px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const buttonStyle = (color: string): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
  });

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faFileAlt} style={{ color: colors.doradoClasico }} />
            Log de Backup: {logFileName}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} style={{ color: '#718096', fontSize: '18px' }} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444' }}>{error}</div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <button style={buttonStyle(colors.doradoClasico)} onClick={handleDownload}>
                <FontAwesomeIcon icon={faDownload} />
                Descargar Log
              </button>
            </div>
            <pre style={logContainerStyle}>{logContent || 'No hay contenido en el log'}</pre>
          </>
        )}
      </div>
    </div>
  );
};