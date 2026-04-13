import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

interface TimeSlotPickerProps {
  horarios: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  loading?: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  horarios,
  selectedTime,
  onSelectTime,
  loading = false,
}) => {
  const containerStyle: React.CSSProperties = {
    marginTop: '16px',
  };

  const titleStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '12px',
    fontWeight: 500,
    fontSize: '14px',
    color: colors.azulAcero,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
  };

  const slotStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '12px',
    backgroundColor: isSelected ? colors.doradoClasico : '#F8FAFC',
    color: isSelected ? 'white' : '#475569',
    border: `1px solid ${isSelected ? colors.doradoClasico : '#E2E8F0'}`,
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  });

  const emptyStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#FEF2F2',
    borderRadius: '12px',
    color: '#EF4444',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <FontAwesomeIcon icon={faClock} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div style={emptyStyle}>
        <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
        No hay horarios disponibles para esta fecha
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <label style={titleStyle}>
        <FontAwesomeIcon icon={faClock} style={{ marginRight: '6px' }} />
        Horarios disponibles
      </label>
      <div style={gridStyle}>
        {horarios.map((hora) => (
          <button
            key={hora}
            style={slotStyle(selectedTime === hora)}
            onClick={() => onSelectTime(hora)}
          >
            {hora.slice(0, 5)}
          </button>
        ))}
      </div>
    </div>
  );
};