import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faSave, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CitaCliente } from '../../types/misCitas';
import { misCitasService } from '../../services/misCitasService';
import { colors } from '../../styles/colors';

interface ReagendarCitaModalProps {
  isOpen: boolean;
  cita: CitaCliente | null;
  onClose: () => void;
  onConfirm: (fecha: string, horaInicio: string) => Promise<void>;
  loading?: boolean;
}

export const ReagendarCitaModal: React.FC<ReagendarCitaModalProps> = ({
  isOpen,
  cita,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [horarios, setHorarios] = useState<Array<{ hora: string; disponible?: boolean; ocupado?: boolean }>>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !cita) return;
    setFecha('');
    setHora('');
    setHorarios([]);
    setError('');
  }, [isOpen, cita]);

  useEffect(() => {
    const loadHorarios = async () => {
      if (!cita || !fecha) return;
      try {
        setLoadingHorarios(true);
        setError('');
        const data = await misCitasService.getHorariosDisponibles(cita.barbero_id, fecha);
        setHorarios(data);
        setHora((current) =>
          current && data.some((slot) => slot.hora === current && slot.disponible !== false)
            ? current
            : ''
        );
      } catch {
        setError('No pudimos cargar horarios para esa fecha.');
        setHorarios([]);
      } finally {
        setLoadingHorarios(false);
      }
    };

    loadHorarios();
  }, [cita, fecha]);

  if (!isOpen || !cita) return null;

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async () => {
    if (!fecha || !hora) {
      setError('Selecciona fecha y horario.');
      return;
    }
    await onConfirm(fecha, hora);
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 520,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize: 14,
  };

  const buttonStyle = (bg: string, color = 'white'): React.CSSProperties => ({
    border: 'none',
    borderRadius: 8,
    padding: '12px 16px',
    backgroundColor: bg,
    color,
    cursor: 'pointer',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  });

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(event) => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, color: colors.negroSuave }}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: colors.doradoClasico, marginRight: 8 }} />
            Reagendar cita
          </h3>
          <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', borderRadius: 8, padding: 14, marginBottom: 18 }}>
          <strong>{cita.servicio_nombre}</strong>
          <div style={{ color: '#718096', fontSize: 13, marginTop: 4 }}>
            Actual: {new Date(cita.fecha).toLocaleDateString()} · {cita.hora_inicio.slice(0, 5)} hrs
          </div>
        </div>

        {error && <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: 10, borderRadius: 8, marginBottom: 14 }}>{error}</div>}

        <label style={{ display: 'block', color: colors.azulAcero, fontWeight: 600, fontSize: 13, marginBottom: 7 }}>
          Nueva fecha
        </label>
        <input type="date" min={today} value={fecha} onChange={(event) => setFecha(event.target.value)} style={inputStyle} />

        <div style={{ marginTop: 18 }}>
          <label style={{ display: 'block', color: colors.azulAcero, fontWeight: 600, fontSize: 13, marginBottom: 7 }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} />
            Horario disponible
          </label>
          {loadingHorarios ? (
            <div style={{ padding: 22, textAlign: 'center' }}>
              <FontAwesomeIcon icon={faSpinner} spin style={{ color: colors.doradoClasico }} />
            </div>
          ) : horarios.length === 0 ? (
            <div style={{ padding: 16, color: '#718096', backgroundColor: '#F8FAFC', borderRadius: 8 }}>
              {fecha ? 'No hay horarios disponibles.' : 'Selecciona una fecha.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
              {horarios.map((slot) => {
                const disabled = slot.disponible === false || slot.ocupado === true;
                return (
                  <button
                    key={slot.hora}
                    type="button"
                    disabled={disabled}
                    title={disabled ? 'Horario reservado' : 'Horario disponible'}
                    onClick={() => {
                      if (!disabled) setHora(slot.hora);
                    }}
                    style={{
                      ...buttonStyle(
                        disabled ? '#F1F3F5' : hora === slot.hora ? colors.doradoClasico : '#F1F5F9',
                        disabled ? '#9AA3AE' : hora === slot.hora ? 'white' : '#475569',
                      ),
                      justifyContent: 'center',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.72 : 1,
                      display: 'grid',
                      gap: 2,
                    }}
                  >
                    <span>{slot.hora.slice(0, 5)}</span>
                    {disabled && <small style={{ fontSize: 10, fontWeight: 600 }}>Ocupado</small>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button style={buttonStyle('#E2E8F0', '#475569')} onClick={onClose}>Cancelar</button>
          <button style={buttonStyle(colors.doradoClasico)} onClick={handleSubmit} disabled={loading}>
            <FontAwesomeIcon icon={loading ? faSpinner : faSave} spin={loading} />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};
