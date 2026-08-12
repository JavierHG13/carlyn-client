import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCalendarCheck,
  faChartLine,
  faChartPie,
  faChevronRight,
  faClock,
  faEnvelope,
  faExclamationTriangle,
  faFilter,
  faMoneyBillTrendUp,
  faPhone,
  faRotate,
  faScissors,
  faUsers,
  faUsersViewfinder,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { prediccionService } from '../../services/prediccionService';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type ModuleKey = 'no-show' | 'ingresos' | 'segmentacion';

const modules = {
  'no-show': {
    title: 'No asistencia',
    subtitle: 'Seguimiento de citas que requieren confirmacion antes del servicio',
    accent: '#232A67',
    icon: faExclamationTriangle,
  },
  ingresos: {
    title: 'Pronostico de ingresos',
    subtitle: 'Proyeccion semanal por sucursal y desempeno esperado',
    accent: '#2B6A35',
    icon: faMoneyBillTrendUp,
  },
  segmentacion: {
    title: 'Segmentacion de clientes',
    subtitle: 'Grupos de clientes segun frecuencia, gasto y riesgo de fuga',
    accent: '#65519A',
    icon: faUsersViewfinder,
  },
} as const;

const tabs: Array<{ key: ModuleKey; label: string }> = [
  { key: 'no-show', label: 'No asistencia' },
  { key: 'segmentacion', label: 'Clientes' },
];

interface MetricInfo {
  algorithm?: string;
  trained_at?: string;
  samples?: number;
}

interface NoShowCita {
  id: number;
  fecha: string;
  hora: string;
  cliente: string;
  telefono?: string;
  email?: string;
  servicio: string;
  riesgo: number;
  nivel: string;
}

interface IncomeBranch {
  id: number;
  local: string;
  semana: number;
  ingreso: number;
  ocupacion: number;
  variacion: number;
}

interface ClientSegmentSummary {
  nombre: string;
  color: string;
  total: number;
  gastoPromedio: number;
  noShowPromedio: number;
}

interface SegmentedClient {
  clienteRef: number;
  cliente: string;
  segmento: string;
  gasto: number;
  recencia: number;
  accion: string;
}

interface Campaign {
  segmento: string;
  texto: string;
}

interface NoShowModule {
  metric?: MetricInfo;
  kpis: {
    citasEnRiesgo: number;
    riesgoAlto: number;
    horariosRecuperables: number;
    recordatoriosSugeridos: number;
  };
  citas: NoShowCita[];
  acciones: string[];
}

interface IncomeModule {
  metric?: MetricInfo;
  kpis: {
    ingresoProyectado: number;
    ticketPromedio: number;
    ocupacionEsperada: number;
    variacion: number;
  };
  sucursales: IncomeBranch[];
  decisiones: string[];
}

interface SegmentationModule {
  metric?: MetricInfo;
  segmentos: ClientSegmentSummary[];
  clientes: SegmentedClient[];
  campanas: Campaign[];
}

type KnowledgeData = NoShowModule | IncomeModule | SegmentationModule;

const money = (value: number) => `$${Number(value || 0).toLocaleString('es-MX')}`;

const panelStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E6EAF0',
  borderRadius: '16px',
  padding: '22px',
};

const panelTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  margin: '0 0 18px',
  fontSize: '18px',
  fontWeight: 800,
  color: '#111827',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 10px',
  color: '#64748B',
  background: '#F8FAFC',
  borderBottom: '1px solid #E2E8F0',
  fontWeight: 800,
};

const tdStyle: React.CSSProperties = {
  padding: '13px 10px',
  borderBottom: '1px solid #EEF2F7',
  color: '#334155',
  verticalAlign: 'middle',
};

const kpiCard = (label: string, value: string, hint: string, color: string, icon: IconDefinition) => (
  <div style={{
    background: '#FFFFFF',
    border: '1px solid #E6EAF0',
    borderRadius: '14px',
    padding: '18px',
    minHeight: '118px',
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: `${color}16`,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px',
    }}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '13px', color: '#475569', fontWeight: 700, marginTop: '7px' }}>{label}</div>
    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{hint}</div>
  </div>
);

const statusPill = (text: string) => {
  const statusConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
    Alta: { bg: '#FEF2F2', color: '#B42318', border: '#FECACA', label: 'Alta' },
    Media: { bg: '#FFFBEB', color: '#B54708', border: '#FEDF89', label: 'Media' },
    Baja: { bg: '#F0FDF4', color: '#027A48', border: '#BBF7D0', label: 'Baja' },
    'Alta prioridad': { bg: '#FEF2F2', color: '#B42318', border: '#FECACA', label: 'Alta' },
    'Prioridad media': { bg: '#FFFBEB', color: '#B54708', border: '#FEDF89', label: 'Media' },
    'En observacion': { bg: '#F0FDF4', color: '#027A48', border: '#BBF7D0', label: 'Baja' },
  };
  const tone = statusConfig[text] || statusConfig.Baja;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      borderRadius: '999px',
      padding: '7px 12px',
      background: tone.bg,
      color: tone.color,
      border: `1px solid ${tone.border}`,
      fontSize: '12px',
      fontWeight: 800,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: tone.color,
        display: 'inline-block',
      }} />
      {tone.label}
    </span>
  );
};

const contactCell = (row: NoShowCita) => {
  const phone = row.telefono?.trim();
  const email = row.email?.trim();
  const whatsapp = phone ? `https://wa.me/52${phone.replace(/\D/g, '').replace(/^52/, '')}` : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <strong style={{ color: '#111827', fontSize: 13 }}>{row.cliente}</strong>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {phone && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 9px',
              borderRadius: 999,
              background: '#ECFDF5',
              color: '#047857',
              border: '1px solid #BBF7D0',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <FontAwesomeIcon icon={faPhone} />
            {phone}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 9px',
              borderRadius: 999,
              background: '#F8FAFC',
              color: '#475569',
              border: '1px solid #E2E8F0',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            Correo
          </a>
        )}
        {!phone && !email && (
          <span style={{ color: '#94A3B8', fontSize: 12 }}>Sin contacto</span>
        )}
      </div>
    </div>
  );
};

const getErrorMessage = (err: unknown, fallback: string) => {
  const error = err as { response?: { data?: { error?: string } } };
  return error.response?.data?.error || fallback;
};

export const AdminKnowledgeProposal: React.FC = () => {
  const navigate = useNavigate();
  const { tipo } = useParams();
  const key = (tabs.some((tab) => tab.key === tipo) ? tipo : 'no-show') as ModuleKey;
  const current = modules[key];
  const [data, setData] = useState<KnowledgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await prediccionService.getKnowledgeModule(key);
      setData(response);
    } catch (err: unknown) {
      setData(null);
      setError(getErrorMessage(err, 'No se pudo cargar el modulo de prediccion.'));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const trainedAt = useMemo(() => {
    if (!data?.metric?.trained_at) return 'Sin entrenamiento';
    return new Date(data.metric.trained_at).toLocaleString('es-MX');
  }, [data]);

  const handleTrain = async () => {
    setTraining(true);
    setError('');
    try {
      await prediccionService.entrenarKnowledgeModels(1000);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo entrenar el modelo.'));
    } finally {
      setTraining(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#111827',
    background: '#F6F7FB',
    borderRadius: '18px',
    padding: '4px',
  };

  const headerStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E6EAF0',
    borderRadius: '16px',
    padding: '22px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    marginBottom: '18px',
  };

  const tabStyle = (active: boolean, accent: string): React.CSSProperties => ({
    border: `1px solid ${active ? accent : '#E2E8F0'}`,
    background: active ? `${accent}12` : '#FFFFFF',
    color: active ? accent : '#475569',
    borderRadius: '999px',
    padding: '10px 16px',
    fontWeight: 800,
    cursor: 'pointer',
  });

  const renderNoShow = () => {
    const moduleData = data as NoShowModule | null;
    const kpis = moduleData?.kpis || {};
    const citas = moduleData?.citas || [];
    const acciones = moduleData?.acciones || [];

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          {kpiCard('Citas por revisar', String(kpis.citasEnRiesgo || 0), 'para proximos dias', current.accent, faCalendarCheck)}
          {kpiCard('Riesgo alto', String(kpis.riesgoAlto || 0), 'requieren confirmacion manual', '#DC2626', faExclamationTriangle)}
          {kpiCard('Horarios recuperables', `${kpis.horariosRecuperables || 0}h`, 'si se confirma a tiempo', '#0EA5E9', faClock)}
          {kpiCard('Recordatorios sugeridos', String(kpis.recordatoriosSugeridos || 0), 'WhatsApp, llamada o correo', '#D97706', faBell)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(280px, 0.8fr)', gap: '18px' }}>
          <section style={{
            ...panelStyle,
            padding: 0,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '22px 22px 8px' }}>
            <h3 style={panelTitleStyle}>
              <FontAwesomeIcon icon={faFilter} style={{ color: current.accent }} />
              Citas con seguimiento pendiente
            </h3>
            <p style={{
              margin: '-8px 0 14px 28px',
              color: '#64748B',
              fontSize: '13px',
              lineHeight: 1.5,
            }}>
              Revisa el riesgo de inasistencia de cada cita y decide si necesita confirmacion manual.
            </p>
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['Fecha', 'Hora', 'Cliente y contacto', 'Servicio', 'Riesgo de inasistencia'].map((h) => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {citas.map((row: NoShowCita) => (
                  <tr key={row.id}>
                    <td style={tdStyle}>{String(row.fecha).slice(0, 10)}</td>
                    <td style={tdStyle}>{row.hora}</td>
                    <td style={tdStyle}>{contactCell(row)}</td>
                    <td style={tdStyle}>{row.servicio}</td>
                    <td style={tdStyle}>{statusPill(row.nivel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={panelStyle}>
            <h3 style={panelTitleStyle}>
              <FontAwesomeIcon icon={faPhone} style={{ color: current.accent }} />
              Acciones sugeridas
            </h3>
            {acciones.map((action: string) => (
              <div key={action} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid #EEF2F7',
                color: '#334155',
                fontWeight: 700,
              }}>
                {action}
                <FontAwesomeIcon icon={faChevronRight} style={{ color: '#94A3B8' }} />
              </div>
            ))}
          </section>
        </div>
      </>
    );
  };

  const renderIngresos = () => {
    const moduleData = data as IncomeModule | null;
    const kpis = moduleData?.kpis || {};
    const sucursales = moduleData?.sucursales || [];
    const decisiones = moduleData?.decisiones || [];

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          {kpiCard('Ingreso proyectado', money(kpis.ingresoProyectado), 'proxima semana', current.accent, faMoneyBillTrendUp)}
          {kpiCard('Ticket promedio', money(kpis.ticketPromedio), 'estimado por cita pagada', '#D97706', faScissors)}
          {kpiCard('Ocupacion esperada', `${kpis.ocupacionEsperada || 0}%`, 'promedio de sucursales', '#0EA5E9', faChartLine)}
          {kpiCard('Variacion', `${kpis.variacion || 0}%`, 'contra semana anterior', '#16A34A', faChartPie)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '18px' }}>
          <section style={panelStyle}>
            <h3 style={panelTitleStyle}>
              <FontAwesomeIcon icon={faChartLine} style={{ color: current.accent }} />
              Proyeccion por sucursal
            </h3>
            {sucursales.map((row: IncomeBranch) => (
              <div key={row.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', fontWeight: 800 }}>
                  <span>{row.local} - Semana {row.semana}</span>
                  <span>{money(row.ingreso)}</span>
                </div>
                <div style={{ height: '10px', borderRadius: '999px', background: '#EEF2F7', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(row.ocupacion, 100)}%`, height: '100%', background: current.accent, borderRadius: '999px' }} />
                </div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748B' }}>
                  Ocupacion {row.ocupacion}% - variacion {row.variacion}%
                </div>
              </div>
            ))}
          </section>

          <section style={panelStyle}>
            <h3 style={panelTitleStyle}>
              <FontAwesomeIcon icon={faMoneyBillTrendUp} style={{ color: current.accent }} />
              Decisiones operativas
            </h3>
            {decisiones.map((title: string) => (
              <div key={title} style={{ padding: '15px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '12px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#111827' }}>{title}</strong>
                <p style={{ margin: '6px 0 0', color: '#64748B', fontSize: '13px', lineHeight: 1.5 }}>
                  Sugerencia generada a partir de citas, ocupacion y ticket promedio esperado.
                </p>
              </div>
            ))}
          </section>
        </div>
      </>
    );
  };

  const renderSegmentacion = () => {
    const moduleData = data as SegmentationModule | null;
    const segmentos = moduleData?.segmentos || [];
    const clientes = moduleData?.clientes || [];
    const campanas = moduleData?.campanas || [];

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          {segmentos.map((segment: ClientSegmentSummary) => (
            <div key={segment.nombre} style={{ ...panelStyle, padding: '18px', borderTop: `4px solid ${segment.color}` }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: segment.color }}>{segment.total} clientes</div>
              <div style={{ marginTop: '6px', fontWeight: 800 }}>{segment.nombre}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(300px, 0.9fr)', gap: '18px' }}>
          <section style={panelStyle}>
            <h3 style={panelTitleStyle}>
              <FontAwesomeIcon icon={faUsers} style={{ color: current.accent }} />
              Clientes destacados por segmento
            </h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['Cliente', 'Segmento', 'Gasto', 'Recencia', 'Accion'].map((h) => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {clientes.map((row: SegmentedClient) => (
                  <tr key={row.clienteRef}>
                    <td style={tdStyle}>{row.cliente}</td>
                    <td style={tdStyle}>{row.segmento}</td>
                    <td style={tdStyle}>{money(row.gasto)}</td>
                    <td style={tdStyle}>{row.recencia} dias</td>
                    <td style={tdStyle}>{row.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={panelStyle}>
            <h3 style={panelTitleStyle}>
              <FontAwesomeIcon icon={faBell} style={{ color: current.accent }} />
              Campanas sugeridas
            </h3>
            {campanas.map((item: Campaign) => (
              <div key={item.segmento} style={{ padding: '15px', background: '#FAF4E8', border: '1px solid #E7D7AE', borderRadius: '12px', marginBottom: '12px' }}>
                <strong>{item.segmento}</strong>
                <p style={{ margin: '6px 0 0', color: '#64748B', fontSize: '13px', lineHeight: 1.5 }}>{item.texto}</p>
              </div>
            ))}
          </section>
        </div>
      </>
    );
  };

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: `${current.accent}14`,
              color: current.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}>
              <FontAwesomeIcon icon={current.icon} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontFamily: 'Playfair Display, serif', color: '#111827' }}>
                {current.title}
              </h1>
              <p style={{ margin: '6px 0 0', color: '#64748B', fontSize: '14px' }}>{current.subtitle}</p>
              <p style={{ margin: '5px 0 0', color: '#94A3B8', fontSize: '12px' }}>
                {data?.metric?.algorithm || 'Modelo'} - {data?.metric?.samples || 0} muestras - {trainedAt}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              style={{
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#475569',
                borderRadius: '999px',
                padding: '10px 16px',
                fontWeight: 800,
                cursor: training ? 'wait' : 'pointer',
              }}
              onClick={handleTrain}
              disabled={training}
            >
              <FontAwesomeIcon icon={faRotate} spin={training} style={{ marginRight: '8px' }} />
              {training ? 'Entrenando' : 'Reentrenar'}
            </button>
            <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  style={tabStyle(tab.key === key, modules[tab.key].accent)}
                  onClick={() => navigate(`/admin/conocimiento/${tab.key}`)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {error && (
          <div style={{ ...panelStyle, borderColor: '#FCA5A5', color: '#991B1B', marginBottom: '18px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={panelStyle}>Cargando predicciones...</div>
        ) : (
          <>
            {key === 'no-show' && renderNoShow()}
            {key === 'ingresos' && renderIngresos()}
            {key === 'segmentacion' && renderSegmentacion()}
          </>
        )}
      </div>
    </AdminLayout>
  );
};
