import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faLocationDot,
  faMoon,
  faSave,
  faSun,
  faSync,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { colors } from '../../styles/colors';
import { barberoService } from '../../services/barberoService';
import type { Barbero } from '../../types/barbero';
import { horarioService, type HorarioDia, type HorarioPlantilla } from '../../services/horarioService';

const dias = [
  { id: 0, nombre: 'Domingo', corto: 'Dom' },
  { id: 1, nombre: 'Lunes', corto: 'Lun' },
  { id: 2, nombre: 'Martes', corto: 'Mar' },
  { id: 3, nombre: 'Miercoles', corto: 'Mie' },
  { id: 4, nombre: 'Jueves', corto: 'Jue' },
  { id: 5, nombre: 'Viernes', corto: 'Vie' },
  { id: 6, nombre: 'Sabado', corto: 'Sab' },
];

const baseSemana = (): HorarioDia[] => dias.map((dia) => ({
  dia_semana: dia.id,
  hora_inicio: '09:00',
  hora_fin: '19:00',
  activo: dia.id !== 0,
}));

export const AdminHorarios: React.FC = () => {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [selectedBarberoId, setSelectedBarberoId] = useState<number>(0);
  const [horarios, setHorarios] = useState<HorarioDia[]>(baseSemana());
  const [plantillas, setPlantillas] = useState<HorarioPlantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectedBarbero = useMemo(
    () => barberos.find((barbero) => barbero.barbero_id === selectedBarberoId) || null,
    [barberos, selectedBarberoId]
  );

  const activeDays = horarios.filter((horario) => horario.activo);
  const inactiveDays = horarios.length - activeDays.length;
  const weeklyHours = activeDays.reduce((sum, horario) => {
    const start = timeToMinutes(horario.hora_inicio);
    const end = timeToMinutes(horario.hora_fin);
    return end > start ? sum + (end - start) / 60 : sum;
  }, 0);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedBarbero) return;
    setHorarios(mergeSemana(selectedBarbero.horarios || []));
  }, [selectedBarbero]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setMessage('');
      const [barberosData, plantillasData] = await Promise.all([
        barberoService.getAll(),
        horarioService.getPlantillas(),
      ]);
      setBarberos(barberosData);
      setPlantillas(plantillasData);
      if (barberosData[0]) {
        setSelectedBarberoId(barberosData[0].barbero_id);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'No se pudieron cargar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const mergeSemana = (existentes: HorarioDia[]) => {
    const semana = baseSemana();
    return semana.map((diaBase) => {
      const existente = existentes.find((h) => h.dia_semana === diaBase.dia_semana);
      return existente
        ? {
          ...diaBase,
          ...existente,
          hora_inicio: existente.hora_inicio.slice(0, 5),
          hora_fin: existente.hora_fin.slice(0, 5),
        }
        : diaBase;
    });
  };

  const updateDia = (diaSemana: number, patch: Partial<HorarioDia>) => {
    setHorarios((prev) => prev.map((horario) => (
      horario.dia_semana === diaSemana ? { ...horario, ...patch } : horario
    )));
  };

  const applyPlantilla = (plantilla: HorarioPlantilla) => {
    setHorarios(mergeSemana(plantilla.horarios));
    setMessage(`Plantilla aplicada: ${plantilla.nombre}`);
  };

  const saveHorarios = async () => {
    if (!selectedBarberoId) return;
    const invalid = horarios.find((h) => h.activo && h.hora_inicio >= h.hora_fin);
    if (invalid) {
      setMessage('Revisa los horarios: la hora de inicio debe ser menor que la hora fin.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      await horarioService.saveBarberoHorarios(selectedBarberoId, horarios);
      const updated = await barberoService.getAll();
      setBarberos(updated);
      setMessage('Horarios guardados correctamente');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'No se pudieron guardar los horarios');
    } finally {
      setSaving(false);
    }
  };

  const pageStyle: React.CSSProperties = { width: '100%' };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 22,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: 0,
    fontFamily: 'Playfair Display, serif',
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '8px 0 0',
    color: '#667085',
    fontSize: 15,
  };

  const buttonStyle = (bg: string, color = '#FFFFFF'): React.CSSProperties => ({
    height: 44,
    padding: '0 16px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: bg,
    color,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontWeight: 800,
    fontSize: 14,
  });

  const heroCardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
  };

  const selectorGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 420px) repeat(3, minmax(160px, 1fr))',
    gap: 16,
    alignItems: 'stretch',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    height: 46,
    padding: '0 14px',
    border: '1px solid #D9E1EC',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#101828',
    fontSize: 14,
    outline: 'none',
  };

  const metricCardStyle: React.CSSProperties = {
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: 16,
    background: '#FBFCFE',
  };

  const sectionCardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.05)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: '0 0 16px',
    fontSize: 20,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const templateButtonStyle: React.CSSProperties = {
    border: '1px solid #D9E1EC',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    padding: '12px 14px',
    color: '#344054',
    cursor: 'pointer',
    textAlign: 'left',
    minWidth: 170,
  };

  const weekGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(145px, 1fr))',
    gap: 12,
  };

  const dayCardStyle = (active: boolean): React.CSSProperties => ({
    border: active ? `1px solid ${colors.doradoClasico}` : '1px solid #E2E8F0',
    background: active ? '#FFFAEB' : '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    minHeight: 188,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: active ? '0 10px 24px rgba(184, 134, 11, 0.09)' : 'none',
  });

  const switchStyle = (active: boolean): React.CSSProperties => ({
    width: 46,
    height: 25,
    borderRadius: 999,
    background: active ? colors.doradoClasico : '#CDD5DF',
    padding: 3,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: active ? 'flex-end' : 'flex-start',
  });

  const switchDotStyle: React.CSSProperties = {
    width: 19,
    height: 19,
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 4px rgba(16,24,40,0.2)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 40,
    padding: '0 10px',
    border: '1px solid #D9E1EC',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#101828',
    fontSize: 13,
    outline: 'none',
  };

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              <FontAwesomeIcon icon={faClock} style={{ color: colors.doradoClasico }} />
              Horarios de Barberos
            </h1>
            <p style={subtitleStyle}>Configura la disponibilidad semanal por barbero y sucursal.</p>
          </div>
          <button style={buttonStyle('#E2E8F0', '#475569')} onClick={loadInitialData}>
            <FontAwesomeIcon icon={faSync} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: colors.azulAcero }}>Cargando horarios...</div>
        ) : (
          <>
            <section style={heroCardStyle}>
              <div style={selectorGridStyle}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#667085', fontWeight: 800, marginBottom: 8 }}>
                    Barbero
                  </label>
                  <select
                    style={selectStyle}
                    value={selectedBarberoId}
                    onChange={(event) => setSelectedBarberoId(Number(event.target.value))}
                  >
                    {barberos.map((barbero) => (
                      <option key={barbero.barbero_id} value={barbero.barbero_id}>
                        {barbero.nombre} {barbero.local_nombre ? `- ${barbero.local_nombre}` : ''}
                      </option>
                    ))}
                  </select>

                  {selectedBarbero && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: colors.doradoClasico,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                      }}>
                        {selectedBarbero.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ color: '#101828' }}>{selectedBarbero.nombre}</strong>
                        <div style={{ color: '#667085', fontSize: 13 }}>
                          <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 6, color: colors.doradoClasico }} />
                          {selectedBarbero.local_nombre || 'Sin sucursal asignada'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {[
                  { label: 'Dias activos', value: activeDays.length, detail: `${inactiveDays} descanso` },
                  { label: 'Horas semanales', value: `${weeklyHours.toFixed(0)}h`, detail: 'disponibles' },
                  { label: 'Primer turno', value: getFirstShift(horarios), detail: 'inicio mas temprano' },
                ].map((metric) => (
                  <div key={metric.label} style={metricCardStyle}>
                    <div style={{ color: '#667085', fontSize: 13, fontWeight: 800 }}>{metric.label}</div>
                    <div style={{ color: '#101828', fontSize: 28, fontWeight: 900, marginTop: 8 }}>{metric.value}</div>
                    <div style={{ color: '#98A2B3', fontSize: 13, marginTop: 4 }}>{metric.detail}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: colors.doradoClasico }} />
                Plantillas rapidas
              </h2>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {plantillas.map((plantilla) => (
                  <button key={plantilla.nombre} style={templateButtonStyle} onClick={() => applyPlantilla(plantilla)}>
                    <div style={{ fontWeight: 900, color: '#101828' }}>{plantilla.nombre}</div>
                    <div style={{ color: '#667085', fontSize: 13, marginTop: 4 }}>{plantilla.descripcion || 'Aplicar horario predefinido'}</div>
                  </button>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
                <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                  <FontAwesomeIcon icon={faUserTie} style={{ color: colors.doradoClasico }} />
                  Semana laboral
                </h2>
                <button style={buttonStyle(colors.doradoClasico)} onClick={saveHorarios} disabled={saving || !selectedBarberoId}>
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Guardando...' : 'Guardar horarios'}
                </button>
              </div>

              <div style={weekGridStyle}>
                {horarios.map((horario) => {
                  const dia = dias.find((d) => d.id === horario.dia_semana);
                  const invalid = horario.activo && horario.hora_inicio >= horario.hora_fin;

                  return (
                    <article key={horario.dia_semana} style={dayCardStyle(horario.activo)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <div>
                          <div style={{ color: colors.doradoClasico, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>{dia?.corto}</div>
                          <strong style={{ color: '#101828', fontSize: 16 }}>{dia?.nombre}</strong>
                        </div>
                        <button
                          type="button"
                          aria-label={`Cambiar estado de ${dia?.nombre}`}
                          style={switchStyle(horario.activo)}
                          onClick={() => updateDia(horario.dia_semana, { activo: !horario.activo })}
                        >
                          <span style={switchDotStyle} />
                        </button>
                      </div>

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: horario.activo ? '#067647' : '#667085',
                        fontSize: 13,
                        fontWeight: 800,
                      }}>
                        <FontAwesomeIcon icon={horario.activo ? faSun : faMoon} />
                        {horario.activo ? 'Disponible' : 'Descanso'}
                      </div>

                      <div style={{ display: 'grid', gap: 10, opacity: horario.activo ? 1 : 0.55 }}>
                        <label style={{ display: 'grid', gap: 5, color: '#667085', fontSize: 12, fontWeight: 800 }}>
                          Inicio
                          <input
                            type="time"
                            style={inputStyle}
                            value={horario.hora_inicio}
                            disabled={!horario.activo}
                            onChange={(event) => updateDia(horario.dia_semana, { hora_inicio: event.target.value })}
                          />
                        </label>
                        <label style={{ display: 'grid', gap: 5, color: '#667085', fontSize: 12, fontWeight: 800 }}>
                          Fin
                          <input
                            type="time"
                            style={inputStyle}
                            value={horario.hora_fin}
                            disabled={!horario.activo}
                            onChange={(event) => updateDia(horario.dia_semana, { hora_fin: event.target.value })}
                          />
                        </label>
                      </div>

                      {invalid && (
                        <div style={{ color: '#B42318', fontSize: 12, fontWeight: 800 }}>
                          Inicio debe ser menor que fin.
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {message && (
                <div style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: message.includes('correctamente') ? '#ECFDF3' : '#FFFAEB',
                  color: message.includes('correctamente') ? '#067647' : '#92400E',
                  border: message.includes('correctamente') ? '1px solid #ABEFC6' : '1px solid #FEDF89',
                  fontWeight: 700,
                }}>
                  {message}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function getFirstShift(horarios: HorarioDia[]) {
  const first = horarios
    .filter((horario) => horario.activo)
    .map((horario) => horario.hora_inicio)
    .sort((a, b) => a.localeCompare(b))[0];

  return first || '--:--';
}
