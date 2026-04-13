import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: string[];
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
  minDate = new Date(),
  maxDate,
  disabledDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Verificar si es menor que la fecha mínima
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return true;
    }
    
    // Verificar si es mayor que la fecha máxima
    if (maxDate && date > maxDate) {
      return true;
    }
    
    // Verificar si está en la lista de fechas deshabilitadas
    if (disabledDates.includes(dateStr)) {
      return true;
    }
    
    return false;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Ajustar para que la semana empiece en lunes (0 = domingo, 1 = lunes)
    let startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Días vacíos al inicio
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} style={emptyDayStyle} />);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = dateStr === selectedDate;
      const isDisabled = isDateDisabled(date);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <button
          key={day}
          style={{
            ...dayStyle,
            ...(isSelected && selectedDayStyle),
            ...(isDisabled && disabledDayStyle),
            ...(isToday && !isSelected && todayStyle),
          }}
          onClick={() => !isDisabled && onSelectDate(dateStr)}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '16px',
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '0 8px',
  };

  const monthTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.negroSuave,
  };

  const navButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: colors.azulAcero,
    transition: 'background-color 0.2s',
  };

  const weekdaysStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  };

  const weekdayStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#718096',
  };

  const daysGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  };

  const emptyDayStyle: React.CSSProperties = {
    padding: '10px',
  };

  const dayStyle: React.CSSProperties = {
    padding: '10px',
    textAlign: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    border: 'none',
    background: 'transparent',
    transition: 'all 0.2s',
  };

  const selectedDayStyle: React.CSSProperties = {
    backgroundColor: colors.doradoClasico,
    color: 'white',
  };

  const disabledDayStyle: React.CSSProperties = {
    color: '#CBD5E0',
    cursor: 'not-allowed',
    backgroundColor: '#F8FAFC',
  };

  const todayStyle: React.CSSProperties = {
    border: `1px solid ${colors.doradoClasico}`,
    color: colors.doradoClasico,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button onClick={handlePrevMonth} style={navButtonStyle}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span style={monthTitleStyle}>
          {meses[currentMonth]} {currentYear}
        </span>
        <button onClick={handleNextMonth} style={navButtonStyle}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      
      <div style={weekdaysStyle}>
        {diasSemana.map((dia, idx) => (
          <div key={idx} style={weekdayStyle}>{dia}</div>
        ))}
      </div>
      
      <div style={daysGridStyle}>
        {renderCalendar()}
      </div>
    </div>
  );
};