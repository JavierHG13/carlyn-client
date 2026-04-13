import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faTimes,
  faCalendarAlt,
  faUser,
  faUserTie,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../styles/colors';

interface CitaFiltersProps {
  onFilterChange: (filters: {
    q: string;
    telefono: string;
    fechaInicio: string;
    fechaFin: string;
    estadoId: number;
    barberoId: number;
  }) => void;
  barberos?: Array<{ id: number; nombre: string }>;
  estados?: Array<{ id: number; nombre: string }>;
}

export const CitaFilters: React.FC<CitaFiltersProps> = ({
  onFilterChange,
  barberos = [],
  estados = [],
}) => {
  const [q, setQ] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoId, setEstadoId] = useState<number>(0);
  const [barberoId, setBarberoId] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQ, setDebouncedQ] = useState(q);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 500);
    return () => clearTimeout(timer);
  }, [q]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    onFilterChange({
      q: debouncedQ,
      telefono,
      fechaInicio,
      fechaFin,
      estadoId,
      barberoId,
    });
  }, [debouncedQ, telefono, fechaInicio, fechaFin, estadoId, barberoId]);

  const clearFilters = () => {
    setQ('');
    setTelefono('');
    setFechaInicio('');
    setFechaFin('');
    setEstadoId(0);
    setBarberoId(0);
  };

  const hasActiveFilters = q || telefono || fechaInicio || fechaFin || estadoId || barberoId;

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchInputContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  };

  const searchInputStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    outline: 'none',
    marginLeft: '8px',
    width: '100%',
    fontSize: '14px',
  };

  const filterButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: colors.grafito,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  };

  const clearButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#E2E8F0',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  };

  const filtersPanelStyle: React.CSSProperties = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #EDF2F7',
    display: showFilters ? 'grid' : 'none',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: colors.azulAcero,
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
  };

  return (
    <div style={containerStyle}>
      <div style={searchContainerStyle}>
        <div style={searchInputContainerStyle}>
          <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
          <input
            type="text"
            placeholder="Buscar por cliente, barbero o servicio..."
            style={searchInputStyle}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        
        <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}>
          <FontAwesomeIcon icon={faFilter} />
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
        
        {hasActiveFilters && (
          <button style={clearButtonStyle} onClick={clearFilters}>
            <FontAwesomeIcon icon={faTimes} />
            Limpiar
          </button>
        )}
      </div>

      <div style={filtersPanelStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
            Fecha desde
          </label>
          <input
            type="date"
            style={inputStyle}
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
            Fecha hasta
          </label>
          <input
            type="date"
            style={inputStyle}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <FontAwesomeIcon icon={faTag} style={{ marginRight: '4px' }} />
            Estado
          </label>
          <select
            style={selectStyle}
            value={estadoId}
            onChange={(e) => setEstadoId(Number(e.target.value))}
          >
            <option value={0}>Todos los estados</option>
            {estados.map(estado => (
              <option key={estado.id} value={estado.id}>{estado.nombre}</option>
            ))}
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '4px' }} />
            Barbero
          </label>
          <select
            style={selectStyle}
            value={barberoId}
            onChange={(e) => setBarberoId(Number(e.target.value))}
          >
            <option value={0}>Todos los barberos</option>
            {barberos.map(barbero => (
              <option key={barbero.id} value={barbero.id}>{barbero.nombre}</option>
            ))}
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '4px' }} />
            Teléfono
          </label>
          <input
            type="text"
            placeholder="Teléfono del cliente"
            style={inputStyle}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};