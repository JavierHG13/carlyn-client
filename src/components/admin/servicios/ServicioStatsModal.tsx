import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faChartLine,
  faCalendarCheck,
  faCheckCircle,
  faDollarSign,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import type { Servicio, ServicioStats } from '../../../types/servicio';
import { servicioService } from '../../../services/servicioService';
import { colors } from '../../../styles/colors';

interface ServicioStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: Servicio | null;
}

export const ServicioStatsModal: React.FC<ServicioStatsModalProps> = ({
  isOpen,
  onClose,
  servicio,
}) => {
  const [stats, setStats] = useState<ServicioStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && servicio) {
      loadStats();
    }
  }, [isOpen, servicio]);

  const loadStats = async () => {
    if (!servicio) return;
    setLoading(true);
    try {
      const data = await servicioService.getStats(servicio.id);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !servicio) return null;

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
    maxWidth: '500px',
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

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
  };

  const statCardStyle = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: `${color}10`,
    borderRadius: '12px',
  });

  const statIconStyle = (color: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    fontSize: '24px',
  });

  const statValueStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.negroSuave,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#718096',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FontAwesomeIcon icon={faChartLine} style={{ color: colors.doradoClasico }} />
            Estadísticas: {servicio.nombre}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTimes} style={{ color: '#718096' }} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
          </div>
        ) : stats ? (
          <div style={statsGridStyle}>
            <div style={statCardStyle('#3B82F6')}>
              <div style={statIconStyle('#3B82F6')}>
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
              <div>
                <div style={statValueStyle}>{stats.total_citas}</div>
                <div style={statLabelStyle}>Total de citas</div>
              </div>
            </div>

            <div style={statCardStyle('#10B981')}>
              <div style={statIconStyle('#10B981')}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div>
                <div style={statValueStyle}>{stats.citas_completadas}</div>
                <div style={statLabelStyle}>Citas completadas</div>
              </div>
            </div>

            <div style={statCardStyle(colors.doradoClasico)}>
              <div style={statIconStyle(colors.doradoClasico)}>
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div>
                <div style={statValueStyle}>${stats.ingresos_totales.toFixed(2)}</div>
                <div style={statLabelStyle}>Ingresos totales</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
};