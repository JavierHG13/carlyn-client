import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUser,
  faCut,
  faCalendarAlt,
  faDollarSign,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type { Cita } from '../../../types/citas';
import { colors } from '../../../styles/colors';

interface CitasTableProps {
  citas: Cita[];
  loading: boolean;
  onView: (cita: Cita) => void;
  onEdit: (cita: Cita) => void;
  onCancel: (cita: Cita) => void;
  onComplete: (cita: Cita) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CitasTable: React.FC<CitasTableProps> = ({
  citas,
  loading,
  onView,
  onEdit,
  onCancel,
  onComplete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getEstadoBadge = (estado: string) => {
    const estadoConfig: Record<string, { bg: string; color: string; icon: any }> = {
      'Pendiente': { bg: '#FEF3C7', color: '#F59E0B', icon: faClock },
      'Confirmada': { bg: '#DBEAFE', color: '#3B82F6', icon: faCheckCircle },
      'Completada': { bg: '#D1FAE5', color: '#10B981', icon: faCheckCircle },
      'Cancelada': { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle },
      'No_asistio': { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle },
    };
    
    const config = estadoConfig[estado] || { bg: '#E2E8F0', color: '#475569', icon: faClock };
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
      }}>
        <FontAwesomeIcon icon={config.icon} style={{ fontSize: '10px' }} />
        {estado}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
        Cargando citas...
      </div>
    );
  }

  return (
    <div>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Barbero</th>
              <th style={thStyle}>Servicio</th>
              <th style={thStyle}>Fecha/Hora</th>
              <th style={thStyle}>Monto</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td style={tdStyle}>#{cita.id}</td>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{cita.cliente_nombre}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{cita.cliente_telefono}</div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{cita.barbero_nombre}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{cita.barbero_especialidad}</div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>
                    <div>{cita.servicio_nombre}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{cita.servicio_duracion} min</div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{formatFecha(cita.fecha)}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{cita.hora_inicio.slice(0, 5)} - {cita.hora_fin.slice(0, 5)}</div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600, color: colors.doradoClasico }}>
                    ${(cita.monto_pagado || cita.servicio_precio)}
                  </span>
                </td>
                <td style={tdStyle}>
                  {getEstadoBadge(cita.estado_nombre)}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      style={actionButtonStyle(colors.azulAcero)}
                      onClick={() => onView(cita)}
                      title="Ver detalles"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {cita.estado_nombre !== 'Completada' && cita.estado_nombre !== 'Cancelada' && (
                      <>
                        <button
                          style={actionButtonStyle(colors.doradoClasico)}
                          onClick={() => onEdit(cita)}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          style={actionButtonStyle('#10B981')}
                          onClick={() => onComplete(cita)}
                          title="Completar"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      </>
                    )}
                    {cita.estado_nombre !== 'Cancelada' && cita.estado_nombre !== 'Completada' && (
                      <button
                        style={actionButtonStyle('#EF4444')}
                        onClick={() => onCancel(cita)}
                        title="Cancelar"
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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