import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faChartLine,
  faCalendarCheck,
  faCheckCircle,
  faTimesCircle,
  faUserSlash,
  faDollarSign,
  faTicket,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import type { Barbero, ResumenBarbero } from '../../../types/barbero';
import { barberoService } from '../../../services/barberoService';
import { colors } from '../../../styles/colors';

interface BarberoStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbero: Barbero | null;
}

export const BarberoStatsModal: React.FC<BarberoStatsModalProps> = ({
  isOpen,
  onClose,
  barbero,
}) => {
  const [stats, setStats] = useState<ResumenBarbero | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && barbero) {
      loadStats();
    }
  }, [isOpen, barbero]);

  const loadStats = async () => {
    if (!barbero) return;
    setLoading(true);
    try {
      const data = await barberoService.getResumen(barbero.barbero_id);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !barbero) return null;

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

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px',
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
            Estadísticas: {barbero.nombre}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
          </div>
        ) : stats ? (
          <>
            <div style={statsGridStyle}>
              <div style={statCardStyle('#10B981')}>
                <div style={statIconStyle('#10B981')}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div>
                  <div style={statValueStyle}>{stats.completadas}</div>
                  <div style={statLabelStyle}>Citas Completadas</div>
                </div>
              </div>

              <div style={statCardStyle('#EF4444')}>
                <div style={statIconStyle('#EF4444')}>
                  <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <div>
                  <div style={statValueStyle}>{stats.canceladas}</div>
                  <div style={statLabelStyle}>Canceladas</div>
                </div>
              </div>

              <div style={statCardStyle('#F59E0B')}>
                <div style={statIconStyle('#F59E0B')}>
                  <FontAwesomeIcon icon={faUserSlash} />
                </div>
                <div>
                  <div style={statValueStyle}>{stats.no_asistio}</div>
                  <div style={statLabelStyle}>No Asistió</div>
                </div>
              </div>

              <div style={statCardStyle('#3B82F6')}>
                <div style={statIconStyle('#3B82F6')}>
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <div>
                  <div style={statValueStyle}>{stats.proximas}</div>
                  <div style={statLabelStyle}>Próximas Citas</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={statCardStyle(colors.doradoClasico)}>
                <div style={statIconStyle(colors.doradoClasico)}>
                  <FontAwesomeIcon icon={faDollarSign} />
                </div>
                <div>
                  <div style={statValueStyle}>${stats.ingresos_total.toFixed(2)}</div>
                  <div style={statLabelStyle}>Ingresos Totales</div>
                </div>
              </div>

              <div style={statCardStyle('#8B5CF6')}>
                <div style={statIconStyle('#8B5CF6')}>
                  <FontAwesomeIcon icon={faTicket} />
                </div>
                <div>
                  <div style={statValueStyle}>${stats.ticket_promedio.toFixed(2)}</div>
                  <div style={statLabelStyle}>Ticket Promedio</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EDF2F7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#718096' }}>Citas hoy:</span>
                <span style={{ fontSize: '18px', fontWeight: 600, color: colors.doradoClasico }}>
                  {stats.hoy}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
};