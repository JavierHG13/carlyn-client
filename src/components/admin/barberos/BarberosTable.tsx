import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faToggleOn,
  faToggleOff,
  faStar,
  faStarHalfAlt,
  faCalendarAlt,
  faPhone,
  faEnvelope,
  faEye,
  faChartLine,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type { Barbero } from '../../../types/barbero';
import { colors } from '../../../styles/colors';

interface BarberosTableProps {
  barberos: Barbero[];
  loading: boolean;
  onEdit: (barbero: Barbero) => void;
  onToggleStatus: (barbero: Barbero) => void;
  onViewDetails: (barbero: Barbero) => void;
  onViewStats: (barbero: Barbero) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BarberosTable: React.FC<BarberosTableProps> = ({
  barberos,
  loading,
  onEdit,
  onToggleStatus,
  onViewDetails,
  onViewStats,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: '#FBBF24' }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} style={{ color: '#FBBF24' }} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: '#E2E8F0' }} />);
      }
    }
    return stars;
  };

  const getDiaNombre = (dia: number) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[dia];
  };

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #EDF2F7',
    backgroundColor: 'white',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1200px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #EDF2F7',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #EDF2F7',
    fontSize: '14px',
    verticalAlign: 'middle',
  };

  const avatarStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: colors.doradoClasico,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  };

  const statusBadgeStyle = (activo: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: activo ? '#D1FAE5' : '#FEE2E2',
    color: activo ? '#10B981' : '#EF4444',
  });

  const horarioBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    margin: '2px',
  };

  const actionButtonStyle = (color: string): React.CSSProperties => ({
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: color,
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 2px',
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  });

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    marginTop: '20px',
  };

  const paginationButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        Cargando barberos...
      </div>
    );
  }

  return (
    <div>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Barbero</th>
              <th style={thStyle}>Contacto</th>
              <th style={thStyle}>Especialidad</th>
              <th style={thStyle}>Experiencia</th>
              <th style={thStyle}>Calificación</th>
              <th style={thStyle}>Horario</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {barberos.map((barbero) => (
              <tr key={barbero.barbero_id}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {barbero.foto && !imageErrors[barbero.barbero_id] ? (
                      <img
                        src={barbero.foto}
                        alt={barbero.nombre}
                        style={avatarStyle}
                        onError={() => setImageErrors(prev => ({ ...prev, [barbero.barbero_id]: true }))}
                      />
                    ) : (
                      <div style={avatarStyle}>
                        {barbero.nombre.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{barbero.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>ID: {barbero.barbero_id}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <FontAwesomeIcon icon={faEnvelope} style={{ color: '#718096', width: '14px' }} />
                      {barbero.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <FontAwesomeIcon icon={faPhone} style={{ color: '#718096', width: '14px' }} />
                      {barbero.telefono || 'No registrado'}
                    </span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{barbero.especialidad || '—'}</div>
                    {barbero.descripcion && (
                      <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                        {barbero.descripcion.length > 50 
                          ? `${barbero.descripcion.substring(0, 50)}...` 
                          : barbero.descripcion}
                      </div>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#718096' }} />
                    {barbero.años_experiencia} años
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {renderStars(barbero.calificacion)}
                    <span style={{ marginLeft: '4px', fontSize: '13px', color: '#718096' }}>
                      ({barbero.calificacion})
                    </span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                    {barbero.horarios?.slice(0, 3).map((h) => (
                      <span key={h.dia_semana} style={horarioBadgeStyle}>
                        {getDiaNombre(h.dia_semana)}: {h.hora_inicio.slice(0, 5)}-{h.hora_fin.slice(0, 5)}
                      </span>
                    ))}
                    {barbero.horarios?.length > 3 && (
                      <span style={horarioBadgeStyle}>+{barbero.horarios.length - 3}</span>
                    )}
                    {(!barbero.horarios || barbero.horarios.length === 0) && (
                      <span style={{ color: '#A0AEC0', fontSize: '12px' }}>Sin horario</span>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(barbero.activo)}>
                    {barbero.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      style={actionButtonStyle(colors.azulAcero)}
                      onClick={() => onViewStats(barbero)}
                      title="Ver estadísticas"
                    >
                      <FontAwesomeIcon icon={faChartLine} />
                    </button>
                    <button
                      style={actionButtonStyle(colors.azulAcero)}
                      onClick={() => onViewDetails(barbero)}
                      title="Ver detalles"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      style={actionButtonStyle(colors.doradoClasico)}
                      onClick={() => onEdit(barbero)}
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      style={actionButtonStyle(barbero.activo ? '#F59E0B' : '#10B981')}
                      onClick={() => onToggleStatus(barbero)}
                      title={barbero.activo ? 'Desactivar' : 'Activar'}
                    >
                      <FontAwesomeIcon icon={barbero.activo ? faToggleOff : faToggleOn} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            style={paginationButtonStyle(currentPage === 1)}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            Anterior
          </button>
          <span style={{ fontSize: '14px', color: '#718096' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            style={paginationButtonStyle(currentPage === totalPages)}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};