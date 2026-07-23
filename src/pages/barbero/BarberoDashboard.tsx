import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faChartLine,
  faCheckCircle,
  faClock,
  faDollarSign,
  faHistory,
  faLocationDot,
  faPhone,
  faSave,
  faScissors,
  faSpinner,
  faTimesCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { barberoService } from '../../services/barberoService';
import { citaService } from '../../services/citasService';
import type { Barbero, CitaBarbero, Horario, ResumenBarbero } from '../../types/barbero';
import { colors } from '../../styles/colors';

type Tab = 'inicio' | 'agenda' | 'historial' | 'horarios' | 'perfil';

const dias = [
  { id: 0, label: 'Domingo' },
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
];

const emptyResumen: ResumenBarbero = {
  completadas: 0,
  canceladas: 0,
  no_asistio: 0,
  proximas: 0,
  hoy: 0,
  ingresos_total: 0,
  ticket_promedio: 0,
};

export const BarberoDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [perfil, setPerfil] = useState<Barbero | null>(null);
  const [resumen, setResumen] = useState<ResumenBarbero>(emptyResumen);
  const [proximas, setProximas] = useState<CitaBarbero[]>([]);
  const [historial, setHistorial] = useState<CitaBarbero[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyEstado, setHistoryEstado] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [perfilForm, setPerfilForm] = useState({
    especialidad: '',
    años_experiencia: 0,
    descripcion: '',
  });

  const normalizedHorarios = useMemo(() => {
    return dias.map((dia) => {
      const existing = horarios.find((h) => Number(h.dia_semana) === dia.id);
      return {
        id: existing?.id || dia.id,
        dia_semana: dia.id,
        hora_inicio: existing?.hora_inicio?.slice(0, 5) || '09:00',
        hora_fin: existing?.hora_fin?.slice(0, 5) || '18:00',
        activo: existing?.activo ?? dia.id !== 0,
      };
    });
  }, [horarios]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [perfilData, resumenData, proximasData, horariosData] = await Promise.all([
        barberoService.getPerfil(),
        barberoService.getResumen(),
        barberoService.getProximasCitas(8),
        barberoService.getHorarios(),
      ]);

      setPerfil(perfilData);
      setResumen({
        ...emptyResumen,
        ...Object.fromEntries(
          Object.entries(resumenData || {}).map(([key, value]) => [key, Number(value) || 0])
        ),
      });
      setProximas(proximasData || []);
      setHorarios(horariosData || []);
      setPerfilForm({
        especialidad: perfilData.especialidad || '',
        años_experiencia: perfilData.años_experiencia || 0,
        descripcion: perfilData.descripcion || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.mensaje || err.response?.data?.message || 'No pudimos cargar tu dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const loadHistorial = async (page = historyPage) => {
    try {
      const data = await barberoService.getHistorialCitas({
        page,
        limit: 8,
        estado: historyEstado || undefined,
      });
      setHistorial(data.data || []);
      setHistoryPage(data.page || page);
      setHistoryTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'No pudimos cargar el historial.');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'historial') loadHistorial(1);
  }, [activeTab, historyEstado]);

  const showSuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(''), 3500);
  };

  const updateHorario = (diaSemana: number, patch: Partial<Horario>) => {
    setHorarios((current) => {
      const exists = current.some((h) => Number(h.dia_semana) === diaSemana);
      if (!exists) {
        return [
          ...current,
          {
            id: diaSemana,
            dia_semana: diaSemana,
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true,
            ...patch,
          },
        ];
      }
      return current.map((h) =>
        Number(h.dia_semana) === diaSemana ? { ...h, ...patch } : h
      );
    });
  };

  const saveHorarios = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = normalizedHorarios.map((h) => ({
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        activo: h.activo,
      }));
      const saved = await barberoService.updateHorarios(payload);
      setHorarios(saved);
      showSuccess('Horarios guardados correctamente.');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'No pudimos guardar los horarios.');
    } finally {
      setSaving(false);
    }
  };

  const savePerfil = async () => {
    setSaving(true);
    setError('');
    try {
      await barberoService.updatePerfil(perfilForm);
      await loadDashboard();
      showSuccess('Perfil actualizado correctamente.');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'No pudimos actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const completeCita = async (id: number) => {
    setSaving(true);
    try {
      await citaService.complete(id);
      await Promise.all([loadDashboard(), activeTab === 'historial' ? loadHistorial() : Promise.resolve()]);
      showSuccess('Cita marcada como completada.');
    } catch {
      setError('No pudimos completar la cita.');
    } finally {
      setSaving(false);
    }
  };

  const cancelCita = async (id: number) => {
    const motivo = window.prompt('Motivo de cancelación');
    if (motivo === null) return;
    setSaving(true);
    try {
      await citaService.cancel(id, motivo || 'Cancelada por el barbero');
      await Promise.all([loadDashboard(), activeTab === 'historial' ? loadHistorial() : Promise.resolve()]);
      showSuccess('Cita cancelada correctamente.');
    } catch {
      setError('No pudimos cancelar la cita.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={loadingStyle}>
          <FontAwesomeIcon icon={faSpinner} spin style={{ color: colors.doradoClasico, fontSize: 34 }} />
          <span>Cargando dashboard del barbero...</span>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Panel del barbero</p>
          <h1 style={titleStyle}>Hola, {perfil?.nombre || 'barbero'}</h1>
          <p style={subtitleStyle}>
            {perfil?.especialidad || 'Gestiona tu agenda'} · {perfil?.local_nombre || 'Sin sucursal asignada'}
          </p>
        </div>
        <button type="button" style={refreshButtonStyle} onClick={loadDashboard}>
          Actualizar
        </button>
      </section>

      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}

      <nav style={tabsStyle}>
        <TabButton tab="inicio" activeTab={activeTab} setActiveTab={setActiveTab} icon={faChartLine} label="Inicio" />
        <TabButton tab="agenda" activeTab={activeTab} setActiveTab={setActiveTab} icon={faCalendarCheck} label="Agenda" />
        <TabButton tab="historial" activeTab={activeTab} setActiveTab={setActiveTab} icon={faHistory} label="Historial" />
        <TabButton tab="horarios" activeTab={activeTab} setActiveTab={setActiveTab} icon={faClock} label="Horarios" />
        <TabButton tab="perfil" activeTab={activeTab} setActiveTab={setActiveTab} icon={faUser} label="Perfil" />
      </nav>

      {activeTab === 'inicio' && (
        <>
          <section style={statsGridStyle}>
            <MetricCard icon={faCalendarCheck} label="Citas hoy" value={resumen.hoy} color="#3B82F6" />
            <MetricCard icon={faClock} label="Próximas" value={resumen.proximas} color={colors.doradoClasico} />
            <MetricCard icon={faCheckCircle} label="Completadas" value={resumen.completadas} color="#10B981" />
            <MetricCard icon={faDollarSign} label="Ingresos" value={`$${Number(resumen.ingresos_total).toFixed(2)}`} color="#8B5CF6" />
          </section>
          <section style={panelStyle}>
            <PanelHeader title="Próximas citas" description="Tus siguientes reservas activas." />
            <CitasList citas={proximas} onComplete={completeCita} onCancel={cancelCita} saving={saving} />
          </section>
        </>
      )}

      {activeTab === 'agenda' && (
        <section style={panelStyle}>
          <PanelHeader title="Agenda próxima" description="Citas pendientes o confirmadas." />
          <CitasList citas={proximas} onComplete={completeCita} onCancel={cancelCita} saving={saving} />
        </section>
      )}

      {activeTab === 'historial' && (
        <section style={panelStyle}>
          <div style={panelHeaderRowStyle}>
            <PanelHeader title="Historial de citas" description="Consulta y filtra el historial de atención." />
            <select style={inputStyle} value={historyEstado} onChange={(e) => setHistoryEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="No_asistio">No asistió</option>
            </select>
          </div>
          <CitasList citas={historial} onComplete={completeCita} onCancel={cancelCita} saving={saving} compact />
          <div style={paginationStyle}>
            <button style={secondaryButtonStyle} disabled={historyPage <= 1} onClick={() => loadHistorial(historyPage - 1)}>
              Anterior
            </button>
            <span>Página {historyPage} de {historyTotalPages}</span>
            <button style={secondaryButtonStyle} disabled={historyPage >= historyTotalPages} onClick={() => loadHistorial(historyPage + 1)}>
              Siguiente
            </button>
          </div>
        </section>
      )}

      {activeTab === 'horarios' && (
        <section style={panelStyle}>
          <PanelHeader title="Horarios de atención" description="Activa días y define tu jornada por sucursal." />
          <div style={scheduleGridStyle}>
            {normalizedHorarios.map((horario) => (
              <div key={horario.dia_semana} style={scheduleRowStyle}>
                <label style={toggleLabelStyle}>
                  <input
                    type="checkbox"
                    checked={horario.activo}
                    onChange={(e) => updateHorario(horario.dia_semana, { activo: e.target.checked })}
                  />
                  <strong>{dias.find((d) => d.id === horario.dia_semana)?.label}</strong>
                </label>
                <input
                  type="time"
                  style={inputStyle}
                  value={horario.hora_inicio}
                  disabled={!horario.activo}
                  onChange={(e) => updateHorario(horario.dia_semana, { hora_inicio: e.target.value })}
                />
                <input
                  type="time"
                  style={inputStyle}
                  value={horario.hora_fin}
                  disabled={!horario.activo}
                  onChange={(e) => updateHorario(horario.dia_semana, { hora_fin: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button type="button" style={primaryButtonStyle} onClick={saveHorarios} disabled={saving}>
            <FontAwesomeIcon icon={saving ? faSpinner : faSave} spin={saving} /> Guardar horarios
          </button>
        </section>
      )}

      {activeTab === 'perfil' && (
        <section style={panelStyle}>
          <PanelHeader title="Perfil profesional" description="Actualiza la información que ve el equipo administrativo." />
          <div style={profileGridStyle}>
            <div style={profileCardStyle}>
              <div style={avatarStyle}>
                {perfil?.foto ? <img src={perfil.foto} alt={perfil.nombre} style={avatarImageStyle} /> : perfil?.nombre?.charAt(0)}
              </div>
              <h2>{perfil?.nombre}</h2>
              <p>{perfil?.email}</p>
              <p><FontAwesomeIcon icon={faPhone} /> {perfil?.telefono || 'Sin teléfono'}</p>
              <p><FontAwesomeIcon icon={faLocationDot} /> {perfil?.local_nombre || 'Sin sucursal'}</p>
            </div>
            <div style={formGridStyle}>
              <label>
                Especialidad
                <input
                  style={inputStyle}
                  value={perfilForm.especialidad}
                  onChange={(e) => setPerfilForm({ ...perfilForm, especialidad: e.target.value })}
                />
              </label>
              <label>
                Años de experiencia
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={perfilForm.años_experiencia}
                  onChange={(e) => setPerfilForm({ ...perfilForm, años_experiencia: Number(e.target.value) })}
                />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                Descripción
                <textarea
                  style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
                  value={perfilForm.descripcion}
                  onChange={(e) => setPerfilForm({ ...perfilForm, descripcion: e.target.value })}
                />
              </label>
              <button type="button" style={primaryButtonStyle} onClick={savePerfil} disabled={saving}>
                <FontAwesomeIcon icon={saving ? faSpinner : faSave} spin={saving} /> Guardar perfil
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

const TabButton = ({ tab, activeTab, setActiveTab, icon, label }: {
  tab: Tab;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  icon: any;
  label: string;
}) => (
  <button type="button" style={tabButtonStyle(activeTab === tab)} onClick={() => setActiveTab(tab)}>
    <FontAwesomeIcon icon={icon} /> {label}
  </button>
);

const PanelHeader = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h2 style={panelTitleStyle}>{title}</h2>
    <p style={panelDescriptionStyle}>{description}</p>
  </div>
);

const MetricCard = ({ icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div style={metricCardStyle}>
    <span style={{ ...metricIconStyle, color, backgroundColor: `${color}18` }}>
      <FontAwesomeIcon icon={icon} />
    </span>
    <small>{label}</small>
    <strong>{value}</strong>
  </div>
);

const CitasList = ({ citas, onComplete, onCancel, saving, compact = false }: {
  citas: CitaBarbero[];
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  saving: boolean;
  compact?: boolean;
}) => {
  if (!citas.length) {
    return (
      <div style={emptyStateStyle}>
        <FontAwesomeIcon icon={faScissors} />
        <span>No hay citas para mostrar.</span>
      </div>
    );
  }

  return (
    <div style={citasListStyle}>
      {citas.map((cita) => (
        <article key={cita.id} style={citaCardStyle}>
          <div>
            <strong>{cita.servicio}</strong>
            <p>{formatDate(cita.fecha)} · {formatTime(cita.hora_inicio)} - {formatTime(cita.hora_fin)}</p>
            <p>{cita.cliente_nombre} · {cita.cliente_telefono || 'Sin teléfono'}</p>
            {!compact && cita.local_nombre && <p>{cita.local_nombre}</p>}
          </div>
          <div style={citaSideStyle}>
            <span style={statusBadgeStyle(cita.estado)}>{cita.estado}</span>
            <strong>${Number(cita.monto_pagado || cita.precio || 0).toFixed(2)}</strong>
            {['Pendiente', 'Confirmada'].includes(cita.estado) && (
              <div style={actionRowStyle}>
                <button type="button" style={smallButtonStyle} disabled={saving} onClick={() => onComplete(cita.id)}>
                  Completar
                </button>
                <button type="button" style={dangerButtonStyle} disabled={saving} onClick={() => onCancel(cita.id)}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

const formatDate = (value: string) => new Date(value).toLocaleDateString('es-MX', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});

const formatTime = (value: string) => value?.slice(0, 5) || '--:--';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#F3F5F7',
  padding: '32px 24px',
};

const heroStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto 20px',
  padding: 28,
  borderRadius: 8,
  backgroundColor: colors.grafito,
  color: colors.blancoHueso,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 18,
  alignItems: 'center',
};

const eyebrowStyle: React.CSSProperties = {
  color: colors.doradoClasico,
  textTransform: 'uppercase',
  fontSize: 12,
  fontWeight: 800,
  margin: 0,
};

const titleStyle: React.CSSProperties = {
  margin: '8px 0',
  fontSize: 32,
};

const subtitleStyle: React.CSSProperties = {
  color: '#CAD3DC',
  margin: 0,
};

const refreshButtonStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.3)',
  backgroundColor: 'transparent',
  color: colors.blancoHueso,
  borderRadius: 8,
  padding: '10px 16px',
  cursor: 'pointer',
};

const tabsStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto 18px',
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
};

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  border: `1px solid ${active ? colors.doradoClasico : '#D8DEE6'}`,
  backgroundColor: active ? colors.doradoClasico : 'white',
  color: active ? '#11181F' : colors.azulAcero,
  borderRadius: 8,
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
});

const statsGridStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto 18px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: 14,
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  border: '1px solid #E6EAF0',
  borderRadius: 8,
  padding: 18,
  display: 'grid',
  gap: 8,
};

const metricIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 8,
  display: 'grid',
  placeItems: 'center',
};

const panelStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  backgroundColor: 'white',
  border: '1px solid #E6EAF0',
  borderRadius: 8,
  padding: 22,
};

const panelHeaderRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.negroSuave,
};

const panelDescriptionStyle: React.CSSProperties = {
  margin: '6px 0 18px',
  color: '#718096',
};

const citasListStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
};

const citaCardStyle: React.CSSProperties = {
  border: '1px solid #E6EAF0',
  borderRadius: 8,
  padding: 16,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 18,
  flexWrap: 'wrap',
};

const citaSideStyle: React.CSSProperties = {
  display: 'grid',
  justifyItems: 'end',
  alignContent: 'start',
  gap: 8,
};

const statusBadgeStyle = (estado: string): React.CSSProperties => {
  const color =
    estado === 'Completada' ? '#10B981' :
    estado === 'Cancelada' ? '#EF4444' :
    estado === 'No_asistio' ? '#64748B' :
    colors.doradoClasico;
  return {
    color,
    backgroundColor: `${color}18`,
    borderRadius: 999,
    padding: '5px 10px',
    fontSize: 12,
    fontWeight: 800,
  };
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
};

const smallButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 10px',
  backgroundColor: '#10B981',
  color: 'white',
  cursor: 'pointer',
};

const dangerButtonStyle: React.CSSProperties = {
  ...smallButtonStyle,
  backgroundColor: '#EF4444',
};

const scheduleGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  marginBottom: 18,
};

const scheduleRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 160px 160px',
  gap: 12,
  alignItems: 'center',
  border: '1px solid #E6EAF0',
  borderRadius: 8,
  padding: 12,
};

const toggleLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const inputStyle: React.CSSProperties = {
  border: '1px solid #D8DEE6',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '11px 16px',
  backgroundColor: colors.doradoClasico,
  color: '#11181F',
  fontWeight: 800,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const secondaryButtonStyle: React.CSSProperties = {
  border: '1px solid #D8DEE6',
  borderRadius: 8,
  padding: '9px 12px',
  backgroundColor: 'white',
  cursor: 'pointer',
};

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 14,
  alignItems: 'center',
  marginTop: 18,
};

const profileGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gap: 22,
};

const profileCardStyle: React.CSSProperties = {
  border: '1px solid #E6EAF0',
  borderRadius: 8,
  padding: 18,
};

const avatarStyle: React.CSSProperties = {
  width: 76,
  height: 76,
  borderRadius: '50%',
  backgroundColor: colors.doradoClasico,
  color: '#11181F',
  display: 'grid',
  placeItems: 'center',
  fontSize: 28,
  fontWeight: 900,
};

const avatarImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 14,
};

const emptyStateStyle: React.CSSProperties = {
  border: '1px dashed #CBD5E1',
  borderRadius: 8,
  padding: 30,
  display: 'grid',
  placeItems: 'center',
  gap: 8,
  color: '#718096',
};

const loadingStyle: React.CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  gap: 14,
  minHeight: '60vh',
  color: colors.azulAcero,
};

const errorStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto 14px',
  border: '1px solid rgba(239,68,68,0.35)',
  backgroundColor: 'rgba(239,68,68,0.08)',
  color: '#B91C1C',
  borderRadius: 8,
  padding: 12,
};

const successStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto 14px',
  border: '1px solid rgba(16,185,129,0.35)',
  backgroundColor: 'rgba(16,185,129,0.08)',
  color: '#047857',
  borderRadius: 8,
  padding: 12,
};
